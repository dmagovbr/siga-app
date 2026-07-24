/**
 * OBJETIVO DO ARQUIVO: Ponto de entrada da API Spring Boot do SIGACrim.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class SigaApiApplication {
    /** Executa a responsabilidade de `main` mantendo este fluxo isolado e testável. */
    public static void main(String[] args) {
        SpringApplication.run(SigaApiApplication.class, args);
    }
}
