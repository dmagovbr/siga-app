/**
 * OBJETIVO DO ARQUIVO: Define os dados devolvidos após uma autenticação bem-sucedida.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.auth;

import java.util.List;

/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public record LoginResponse(
    Long id,
    String usuario,
    String nome,
    String email,
    boolean trocarSenha,
    List<String> perfis
) {}
