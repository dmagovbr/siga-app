/**
 * OBJETIVO DO ARQUIVO: Fornece um endpoint simples para verificar se a API está ativa.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.controller;

import java.time.OffsetDateTime;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Marca a classe como controller REST; os retornos são serializados em JSON.
@RestController
// Define o prefixo comum usado pelos endpoints desta classe.
@RequestMapping("/api")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class HealthController {
    // Atende uma consulta HTTP GET sem alterar dados.
    @GetMapping("/health")
    /** Executa a responsabilidade de `health` mantendo este fluxo isolado e testável. */
    public Map<String, Object> health() {
        // Devolve o resultado final deste caminho de execução.
        return Map.of(
            "status", "ok",
            "application", "siga-api",
            "timestamp", OffsetDateTime.now().toString()
        );
    }
}
