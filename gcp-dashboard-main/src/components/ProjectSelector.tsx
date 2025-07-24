import React, { useState } from "react";
import { useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import GCPConfigService from "../services/GCPConfigService";


// const projects = [
//   {
//     id: "midyear-reactor-383704",
//     name: "Goals Dashboard",
//     description: "Financial Goals",
//     icon: <ComputerIcon fontSize="large" color="primary" />,
//   },
//   {
//     id: "skywatch-prod-789",
//     name: "PNF Dashboard",
//     description: "PNF",
//     icon: <CloudIcon fontSize="large" color="primary" />,
//   },
//   {
//     id: "devops-lab-001",
//     name: "INF Dashboard",
//     description: "INF",
//     icon: <StorageIcon fontSize="large" color="primary" />,
//   },
// ];

const ProjectSelector: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [logs, setLogs] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectList, setProjectList] = useState([] as any[]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await GCPConfigService.getProjects();
        setProjectList(Array.isArray(projects) ? projects : []);
        console.log("📂 Fetched projects:", projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const showMetrics = (projectId: string) => {
    window.location.href = `/showMetrics/${projectId}`;
  };

  const handleSelect = async (projectId: string) => {
    setSelectedProject(projectId);
    setLoading(true);
    setLogs(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/launch-observability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setLogs(data.logs || "No output from backend");
      window.open(
        `http://localhost:8080/#/service?keyword=${projectId}`,
        "_blank"
      );
    } catch (err: any) {
      setError(err.message);
      alert("in catch");
    } finally {
      setLoading(false);
      alert("in loading");
    }
  };

  const generateYaml = (projectId: string) => {
    return `receivers:
  googlecloudmonitoring:
    project_id: ${projectId}

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
      exporters: [otlp]`;
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {projectList.map((project) => (
          <Grid
            item
            key={project.id}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
                p: 2,
                borderRadius: 4,
                boxShadow: 6,
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 10,
                },
              }}
            >
              <Box mt={2}>{<CloudIcon fontSize="large" color="primary" />}</Box>
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {project.projectName}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {project.projectDescription}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1 }}
                  color="text.secondary"
                >
                  ID: {project.projectId}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => showMetrics(project.projectId)}
                >
                  Launch
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {projectList.length === 0 && (
          <Grid item xs={12}>
            <Alert
              severity="info"
              sx={{
              mt: 2,
              py: 4,
              px: 3,
              fontSize: "1.25rem",
              fontWeight: 600,
              textAlign: "center",
              }}
            >
              No GCP project configurations found. Please add a configuration to get started.
            </Alert>
          </Grid>
        )}
      </Grid>

      {selectedProject && (
        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            ✍️ Auto-generated OpenTelemetry Config
          </Typography>
          <Box
            component="pre"
            sx={{
              backgroundColor: "#0f111a",
              color: "#e0e0e0",
              padding: 3,
              borderRadius: 2,
              overflowX: "auto",
              fontSize: "0.85rem",
              mt: 2,
              textAlign: "left",
            }}
          >
            {generateYaml(selectedProject)}
          </Box>

          {loading && (
            <Box mt={3}>
              <CircularProgress />
              <Typography variant="body2" mt={2}>
                Launching collector…
              </Typography>
            </Box>
          )}

          {error && (
            <Box mt={3}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {logs && (
            <Box mt={3}>
              <Typography variant="h6">📜 Backend Logs</Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: "#111",
                  color: "#fff",
                  padding: 2,
                  borderRadius: 2,
                  mt: 1,
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                {logs}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProjectSelector;
