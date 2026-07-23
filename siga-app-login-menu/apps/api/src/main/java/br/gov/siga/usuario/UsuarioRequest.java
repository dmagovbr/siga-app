package br.gov.siga.usuario;
import jakarta.validation.constraints.*;
public record UsuarioRequest(@NotBlank @Size(max=255) String usuario, @NotBlank @Size(max=255) String nome, @Email @Size(max=255) String email, @NotBlank @Size(min=8,max=200) String senha) {}
