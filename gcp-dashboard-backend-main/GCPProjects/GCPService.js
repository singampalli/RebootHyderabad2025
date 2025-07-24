const express = require('express');
const GCPProjectConfigManager = require('./GCPProjectConfigManager');

const router = express.Router();
const manager = new GCPProjectConfigManager();

// 🟩 GET all projects
router.get('/', (req, res) => {
  const data = manager.readConfig();
  console.log("📂 Fetched projects:", data.GCPProjectConfig);
  res.json(data.GCPProjectConfig);
});

// 🟦 POST a new project
router.post('/', (req, res) => {
  const { projectId, projectName, projectDescription } = req.body;
  if (!projectId || !projectName) {
    return res.status(400).json({ error: 'projectId and projectName are required' });
  }

  manager.addOrUpdateProject({
    projectId,
    projectName,
    projectDescription: projectDescription || ''
  });
  res.status(201).json({ message: 'Project added or updated' });
});

// 🟨 PUT update project
router.put('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const { projectName } = req.body;
  const { projectDescription } = req.body;

  if (!projectName) {
    return res.status(400).json({ error: 'projectName required' });
  }

  manager.addOrUpdateProject({ projectId, projectName, projectDescription });
  res.json({ message: 'Project updated' });
});

// 🟥 DELETE project
router.delete('/:projectId', (req, res) => {
  const { projectId } = req.params;
  const config = manager.readConfig();
  const updatedList = config.GCPProjectConfig.filter(p => p.projectId !== projectId);

  if (updatedList.length === config.GCPProjectConfig.length) {
    return res.status(404).json({ error: 'Project not found' });
  }

  manager.writeConfig({ GCPProjectConfig: updatedList });
  res.json({ message: 'Project deleted' });
});

module.exports = router;
