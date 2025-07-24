package com.hackathon.gcp.exporter;

import com.hackathon.gcp.exporter.fetcher.ComputeFetcher;
import com.hackathon.gcp.exporter.model.GCPMetric;
import com.hackathon.gcp.exporter.model.SkyMetric;
import com.hackathon.gcp.exporter.transformer.SkyWalkingTransformer;
import com.hackathon.gcp.exporter.emitter.JSONEmitter;

import java.util.List;
import java.util.concurrent.*;

public class App {
    public static void main(String[] args) {
        String projectId = "midyear-reactor-383704";
        ComputeFetcher fetcher = new ComputeFetcher();
        SkyWalkingTransformer transformer = new SkyWalkingTransformer();
        JSONEmitter emitter = new JSONEmitter("src/main/resources/output/metrics.json");

        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(() -> {
            List<GCPMetric> rawMetrics = fetcher.getCPUUtilization(projectId);
            List<SkyMetric> transformed = transformer.transformAll(rawMetrics);
            emitter.emit(transformed);
        }, 0, 60, TimeUnit.SECONDS);

        System.out.println("GCP exporter started! 🚀 Pulling metrics every 60 seconds...");
    }
}