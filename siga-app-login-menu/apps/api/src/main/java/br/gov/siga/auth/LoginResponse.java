package br.gov.siga.auth;

import java.util.List;

public record LoginResponse(
    Long id,
    String usuario,
    String nome,
    String email,
    boolean trocarSenha,
    List<String> perfis
) {}
