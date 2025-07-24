package com.hackathon.gcp.exporter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExporterApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExporterApplication.class, args);
        System.out.println("🚀 API server is live on http://localhost:9090");
    }
}