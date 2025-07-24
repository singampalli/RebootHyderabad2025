package com.hackathon.gcp.exporter.emitter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.gcp.exporter.model.SkyMetric;

import java.io.File;
import java.util.List;

public class JSONEmitter {
    private final String outputPath;
    private final ObjectMapper mapper = new ObjectMapper();

    public JSONEmitter(String outputPath) {
        this.outputPath = outputPath;
    }

    public void emit(List<SkyMetric> metrics) {
        try {
            mapper.writeValue(new File(outputPath), metrics);
            System.out.println(metrics);
            System.out.println("✅ Metrics exported to " + outputPath);
        } catch (Exception e) {
            System.err.println("Failed to write JSON: " + e.getMessage());
        }
    }
}