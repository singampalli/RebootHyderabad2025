package com.hackathon.gcp.exporter.fetcher;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.monitoring.v3.MetricServiceSettings;
import com.google.protobuf.util.Timestamps;
import com.hackathon.gcp.exporter.model.GCPMetric;
import com.google.cloud.monitoring.v3.MetricServiceClient;
import com.google.monitoring.v3.*;
import com.google.monitoring.v3.ProjectName;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

public class ComputeFetcher {
    public List<GCPMetric> getCPUUtilization(String projectId) {
        List<GCPMetric> metrics = new ArrayList<>();
        try {
            // Load service account credentials from file
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new FileInputStream("D:\\GCP-Monitoring\\gcp-dashboard-backend\\creds\\key.json")
            );

            // Set credentials into client settings
            MetricServiceSettings settings = MetricServiceSettings.newBuilder()
                    .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                    .build();

            try (MetricServiceClient client = MetricServiceClient.create(settings)) {
                String metricType = "agent.googleapis.com/cpu/utilization";
                String filter = String.format(
                        "metric.type=\"%s\" AND resource.type=\"gce_instance\"",
                        metricType
                );

                TimeInterval interval = TimeInterval.newBuilder()
                        .setStartTime(Timestamps.fromMillis(System.currentTimeMillis() - 600000)) // 10 minutes ago
                        .setEndTime(Timestamps.fromMillis(System.currentTimeMillis())) // now
                        .build();

                ListTimeSeriesRequest request = ListTimeSeriesRequest.newBuilder()
                        .setName(String.valueOf(ProjectName.of(projectId)))
                        .setFilter(filter)
                        .setInterval(interval)
                        .setView(ListTimeSeriesRequest.TimeSeriesView.FULL)
                        .build();

                System.out.println("Sending filter: " + filter);
                int count = 0;

                for (TimeSeries ts : client.listTimeSeries(request).iterateAll()) {
                    double value = ts.getPoints(0).getValue().getDoubleValue();
                    String instanceId = ts.getResource().getLabelsMap().getOrDefault("instance_id", "unknown");

                    System.out.printf("📡 Instance: %s | CPU: %.2f%% | Time: %d%n",
                            instanceId, value * 100, System.currentTimeMillis());

                    metrics.add(new GCPMetric("cpu_utilization", instanceId, value, System.currentTimeMillis()));
                    count++;
                }

                System.out.println("✅ Fetched metrics count: " + count);
            }

        } catch (IOException e) {
            System.err.println("⚠️ Failed to fetch metrics: " + e.getMessage());
        }

        return metrics;
    }

    public List<GCPMetric> getMemoryUsage(String projectId) {
        List<GCPMetric> metrics = new ArrayList<>();
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new FileInputStream("D:\\GCP-Monitoring\\gcp-dashboard-backend\\creds\\key.json")
            );

            MetricServiceSettings settings = MetricServiceSettings.newBuilder()
                    .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                    .build();

            try (MetricServiceClient client = MetricServiceClient.create(settings)) {
                String metricType = "agent.googleapis.com/memory/percent_used";
                String filter = String.format("metric.type=\"%s\" AND resource.type=\"gce_instance\"", metricType);

                TimeInterval interval = TimeInterval.newBuilder()
                        .setStartTime(Timestamps.fromMillis(System.currentTimeMillis() - 600000))
                        .setEndTime(Timestamps.fromMillis(System.currentTimeMillis()))
                        .build();

                ListTimeSeriesRequest request = ListTimeSeriesRequest.newBuilder()
                        .setName(String.valueOf(ProjectName.of(projectId)))
                        .setFilter(filter)
                        .setInterval(interval)
                        .setView(ListTimeSeriesRequest.TimeSeriesView.FULL)
                        .build();

                for (TimeSeries ts : client.listTimeSeries(request).iterateAll()) {
                    double value = ts.getPoints(0).getValue().getDoubleValue();
                    String instanceId = ts.getResource().getLabelsMap().getOrDefault("instance_id", "unknown");

                    metrics.add(new GCPMetric("memory_usage", instanceId, value, System.currentTimeMillis()));
                }
            }

        } catch (IOException e) {
            System.err.println("⚠️ Failed to fetch memory metrics: " + e.getMessage());
        }

        return metrics;
    }

    public List<GCPMetric> getBillingUsage(String projectId) {
        List<GCPMetric> metrics = new ArrayList<>();
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new FileInputStream("D:\\GCP-Monitoring\\gcp-dashboard-backend\\creds\\key.json")
            );

            MetricServiceSettings settings = MetricServiceSettings.newBuilder()
                    .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                    .build();

            try (MetricServiceClient client = MetricServiceClient.create(settings)) {
                String metricType = "monitoring.googleapis.com/billing/bytes_ingested_hourly";
                String filter = String.format("metric.type=\"%s\" AND resource.type=\"gce_instance\"", metricType);

                TimeInterval interval = TimeInterval.newBuilder()
                        .setStartTime(Timestamps.fromMillis(System.currentTimeMillis() - 600000))
                        .setEndTime(Timestamps.fromMillis(System.currentTimeMillis()))
                        .build();

                ListTimeSeriesRequest request = ListTimeSeriesRequest.newBuilder()
                        .setName(String.valueOf(ProjectName.of(projectId)))
                        .setFilter(filter)
                        .setInterval(interval)
                        .setView(ListTimeSeriesRequest.TimeSeriesView.FULL)
                        .build();

                for (TimeSeries ts : client.listTimeSeries(request).iterateAll()) {
                    double value = ts.getPoints(0).getValue().getDoubleValue();
                    String instanceId = ts.getResource().getLabelsMap().getOrDefault("instance_id", "unknown");

                    metrics.add(new GCPMetric("memory_usage", instanceId, value, System.currentTimeMillis()));
                }
            }

        } catch (IOException e) {
            System.err.println("⚠️ Failed to fetch memory metrics: " + e.getMessage());
        }

        return metrics;
    }

}