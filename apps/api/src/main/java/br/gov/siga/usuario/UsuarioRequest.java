/**
 * OBJETIVO DO ARQUIVO: Define e valida os dados aceitos no cadastro de usuário.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.usuario;
import jakarta.validation.constraints.*;
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public record UsuarioRequest(@NotBlank @Size(max=255) String usuario, @NotBlank @Size(max=255) String nome, @Email @Size(max=255) String email, @NotBlank @Size(min=8,max=200) String senha) {}
