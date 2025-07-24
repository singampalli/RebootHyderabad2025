const fs = require('fs');
const path = require('path');

class GCPProjectConfigManager {
  constructor(fileName = 'data.json') {
    this.configPath = path.resolve(__dirname, fileName);
  }

  readConfig() {
    if (!fs.existsSync(this.configPath)) {
      return { GCPProjectConfig: [] };
    }

    const data = fs.readFileSync(this.configPath, 'utf-8');
    return JSON.parse(data);
  }

  writeConfig(config) {
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  addOrUpdateProject(newProject) {
    const config = this.readConfig();

    const index = config.GCPProjectConfig.findIndex(
      (proj) => proj.projectId === newProject.projectId
    );

    if (index >= 0) {
      config.GCPProjectConfig[index] = newProject;
      console.log(`🔄 Updated project: ${newProject.projectId}`);
    } else {
      config.GCPProjectConfig.push(newProject);
      console.log(`➕ Added new project: ${newProject.projectId}`);
    }

    this.writeConfig(config);
  }
}

module.exports = GCPProjectConfigManager;