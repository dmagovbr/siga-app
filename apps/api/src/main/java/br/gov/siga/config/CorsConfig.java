/**
 * OBJETIVO DO ARQUIVO: Configura quais origens web podem acessar a API durante o desenvolvimento.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class CorsConfig implements WebMvcConfigurer {
    @Override
    /** Executa a responsabilidade de `addCorsMappings` mantendo este fluxo isolado e testável. */
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200", "http://127.0.0.1:4200")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*");
    }
}
