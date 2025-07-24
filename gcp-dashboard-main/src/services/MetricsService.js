// src/services/fetchMetrics.js

export async function fetchMetrics(type, projectId) {
  console.log(type, projectId);
  try {
    const response = await fetch(`http://localhost:5000/api/metrics/${type}/${projectId}`);
    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }
    const data = await response.json();
    console.log("📊 Metrics fetched successfully:", data);
    return data;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return null;
  }
}
