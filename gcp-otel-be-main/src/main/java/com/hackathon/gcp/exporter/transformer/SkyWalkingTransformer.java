package com.hackathon.gcp.exporter.transformer;

import com.hackathon.gcp.exporter.model.GCPMetric;
import com.hackathon.gcp.exporter.model.SkyMetric;

import java.util.*;
import java.util.stream.Collectors;

public class SkyWalkingTransformer {
    public List<SkyMetric> transformAll(List<GCPMetric> rawList) {
        return rawList.stream()
                .map(metric -> new SkyMetric(
                        "GCP-" + metric.resourceId,
                        metric.type,
                        metric.value,
                        metric.timestamp))
                .collect(Collectors.toList());
    }
}