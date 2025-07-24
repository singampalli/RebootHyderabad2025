package com.hackathon.gcp.exporter.model;

public class GCPMetric {
    public String type;
    public String resourceId;
    public double value;
    public long timestamp;

    public GCPMetric(String type, String resourceId, double value, long timestamp) {
        this.type = type;
        this.resourceId = resourceId;
        this.value = value;
        this.timestamp = timestamp;
    }
}