/**
 * OBJETIVO DO ARQUIVO: Define os dados recebidos no pedido de login.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.auth;

import jakarta.validation.constraints.NotBlank;

/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public record LoginRequest(
    @NotBlank String usuario,
    @NotBlank String senha
) {}
