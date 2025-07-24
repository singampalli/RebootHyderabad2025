package com.hackathon.gcp.exporter.api;

import com.hackathon.gcp.exporter.fetcher.ComputeFetcher;
import com.hackathon.gcp.exporter.model.GCPMetric;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class MetricController {

    private final ComputeFetcher fetcher = new ComputeFetcher();

    @GetMapping("/cpu")
    public List<GCPMetric> getCpuMetrics(@RequestParam String projectId) {
        return fetcher.getCPUUtilization(projectId);
    }

    @GetMapping("/memory")
    public List<GCPMetric> getMemoryMetrics(@RequestParam String projectId) {
        return fetcher.getMemoryUsage(projectId);
    }

    @GetMapping("/billing")
    public List<GCPMetric> getBillingMetrics(@RequestParam String projectId) {
        return fetcher.getBillingUsage(projectId);
    }
}