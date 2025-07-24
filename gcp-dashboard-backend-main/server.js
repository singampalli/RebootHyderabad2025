const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const gcpService = require('./GCPProjects/GCPService');

const PORT = 5000;
const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use('/api/projects', gcpService);
/**
 * Wraps a Docker spawn command in a Promise for async handling.
 * Captures stdout and stderr, sets a timeout safeguard.
 */
function runDockerCommand(dockerArgs) {
  return new Promise((resolve, reject) => {
    const docker = spawn("docker", dockerArgs);
    let output = "";

    console.log("🔧 Docker process started...");

    docker.stdout.on("data", (data) => {
      const line = data.toString();
      output += `[STDOUT] ${line}\n`;
      console.log("📤 Docker stdout:", line.trim());
    });

    docker.stderr.on("data", (data) => {
      const line = data.toString();
      output += `[STDERR] ${line}\n`;
      console.warn("⚠️ Docker stderr:", line.trim());
    });

    docker.on("close", (code) => {
      console.log(`✅ Docker process exited with code ${code}`);
      resolve({ code, output });
    });

    docker.on("error", (err) => {
      console.error("❌ Docker spawn error:", err);
      reject(err);
    });

    setTimeout(() => {
      reject(new Error("⏱️ Timeout: Docker command exceeded safe duration (60s)"));
    }, 60 * 1000);
  });
}

/**
 * POST /launch-observability
 * Dynamically creates an OpenTelemetry Collector config using the projectId,
 * launches a one-time collector container, and returns logs to frontend.
 */
app.post("/launch-observability", async (req, res) => {
  const { projectId } = req.body;

  console.log("📨 Received launch request for projectId:", projectId);

  if (!projectId) {
    console.warn("⛔ No projectId in request body");
    return res.status(400).json({ error: "Missing projectId" });
  }

  // Build OpenTelemetry YAML configuration with inline comments
  const yamlContent = `# OpenTelemetry Collector Configuration for GCP Project: ${projectId}
receivers:
  googlecloudmonitoring:
    project_id: ${projectId}
    metrics_list:
      - metric_name: "compute.googleapis.com/instance/cpu/usage_time"
      - metric_name: "connectors.googleapis.com/flex/instance/cpu/usage_time"

processors:
  resource:
    attributes:
      - key: service.name
        value: ${projectId}-monitoring
        action: insert
      - key: service.instance.id
        value: ${projectId}-host
        action: insert

exporters:
  otlp:
    endpoint: skywalking-oap:11800
    tls:
      insecure: true

service:
  pipelines:
    metrics:
      receivers: [googlecloudmonitoring]
      processors: [resource]
      exporters: [otlp]
`;

  // Define path for temporary config file
  const configPath = path.join(__dirname, `otel-config-${projectId}.yaml`);
  console.log("📝 Writing config file to:", configPath);

  try {
    fs.writeFileSync(configPath, yamlContent, "utf-8");
    console.log("✅ Config file created successfully");
  } catch (err) {
    console.error("❌ Failed to write config file:", err);
    return res.status(500).json({ error: "Config file creation failed", details: err.message });
  }

  // Construct Docker command with correct volumes and environment
  const dockerArgs = [
    "run",
    "--rm",
    "--network", "skywalking-net",
    "-v", `${configPath}:/otel-local-config.yaml`,
    "-v", `${__dirname}/creds:/otel/creds`,
    "-e", "GOOGLE_APPLICATION_CREDENTIALS=/otel/creds/key.json",
    "otel/opentelemetry-collector-contrib:latest",
    "--config=/otel-local-config.yaml",
  ];

  console.log("🐳 Launching Docker with args:", dockerArgs.join(" "));

  try {
    const { code, output } = await runDockerCommand(dockerArgs);

    // Cleanup temporary config file after collector exit
    try {
      fs.unlinkSync(configPath);
      console.log("🧹 Temp config file deleted");
    } catch (cleanupErr) {
      console.warn("⚠️ Could not delete temp config file:", cleanupErr.message);
    }

    res.json({
      message: `Collector completed with exit code ${code}`,
      logs: output,
    });
  } catch (err) {
    console.error("💥 Error during Docker execution:", err);

    if (!res.headersSent) {
      res.status(500).json({
        error: "Collector launch failed",
        details: err.message,
      });
    }
  }
});
app.use(cors());
app.use(bodyParser.json());

app.post("/launch-observability", (req, res) => {
  const { projectId } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId" });
  }

  // Step 1: Build YAML config dynamically
  const yamlContent = `receivers:
  googlecloudmonitoring:
    project_id: ${projectId}
    metrics_list:
      - metric_name: "compute.googleapis.com/instance/cpu/usage_time"
      - metric_name: "connectors.googleapis.com/flex/instance/cpu/usage_time"

processors:
  resource:
    attributes:
      - key: service.name
        value: ${projectId}-monitoring
        action: insert
      - key: service.instance.id
        value: ${projectId}-host
        action: insert

exporters:
  otlp:
    endpoint: skywalking-oap:11800
    tls:
      insecure: true

service:
  pipelines:
    metrics:
      receivers: [googlecloudmonitoring]
      processors: [resource]
      exporters: [otlp]
`;

  // Step 2: Write config to file
  const configPath = path.join(__dirname, `otel-config-${projectId}.yaml`);
  fs.writeFileSync(configPath, yamlContent, "utf-8");

  // Step 3: Build the Docker command
  const dockerArgs = [
    "run",
    "--rm",
    "--network",
    "skywalking-net",
    "-v",
    `${configPath}:/otel-local-config.yaml`,
    "-v",
    `${__dirname}/creds:/otel/creds`,
    "-e",
    "GOOGLE_APPLICATION_CREDENTIALS=/otel/creds/key.json",
    "otel/opentelemetry-collector-contrib:latest",
    "--config=/otel-local-config.yaml",
  ];
console.log("before docker")
  const docker = spawn("docker", dockerArgs);

  let output = "";
  docker.stdout.on("data", (data) => {
    output += data.toString();
  });

  docker.stderr.on("data", (data) => {
    output += data.toString();
  });
console.log("🚀 Starting Docker container with args:", dockerArgs.join(" "));
  docker.on("close", (code) => {
  console.log("✅ Docker container exited with code:", code);
  console.log("📦 Full output from Docker:\n", output);

  try {
    res.json({
      message: `Collector run complete with code ${code}`,
      logs: output,
    });
  } catch (err) {
    console.error("❌ Failed to send response to frontend:", err);
    // Optional safeguard:
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error (post-exit)" });
    }
  }
});
});

app.listen(PORT, () => {
  console.log(`🟢 Backend listening at http://localhost:${PORT}`);
});