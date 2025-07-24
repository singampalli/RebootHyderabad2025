// src/components/MetricsDisplay.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Charts from './Charts';
import { fetchMetrics } from '../services/MetricsService';
import { useParams } from 'react-router-dom';


 // 👈 grabs param from the URL


function MetricsDisplay() {
  const [metrics, setMetrics] = useState(null);
  const [metricType, setMetricType] = useState('cpu');
  const { projectId } = useParams();

  useEffect(() => {
    async function loadData() {
      const data = await fetchMetrics(metricType, projectId);
      setMetrics(data);
    }
    loadData();
  }, [metricType, projectId]);

  const handleMetricChange = (event, newType) => {
    if (newType) setMetricType(newType);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        📊 Metrics
      </Typography>

      <ToggleButtonGroup
        value={metricType}
        exclusive
        onChange={handleMetricChange}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="cpu">CPU Utilization</ToggleButton>
        <ToggleButton value="memory">Memory</ToggleButton>
        <ToggleButton value="disk-metrics">Disk I/O Metrics</ToggleButton>
      </ToggleButtonGroup>

      {metrics ? (
        <Charts data={metrics} type={metricType} />
      ) : (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={24} />
          <Typography variant="body1">Loading or no data available...</Typography>
        </Box>
      )}
    </Paper>
  );
}

export default MetricsDisplay;