package com.hackathon.gcp.exporter.model;

public class SkyMetric {
    public String serviceInstance;
    public String metricName;
    public double value;
    public long timestamp;

    public SkyMetric(String serviceInstance, String metricName, double value, long timestamp) {
        this.serviceInstance = serviceInstance;
        this.metricName = metricName;
        this.value = value;
        this.timestamp = timestamp;
    }
}