package br.gov.siga.controller;

import java.time.OffsetDateTime;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
            "status", "ok",
            "application", "siga-api",
            "timestamp", OffsetDateTime.now().toString()
        );
    }
}
