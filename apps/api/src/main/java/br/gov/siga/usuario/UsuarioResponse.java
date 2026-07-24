/**
 * OBJETIVO DO ARQUIVO: Define os dados de usuário devolvidos pela API.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.usuario;
import java.time.LocalDateTime;
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public record UsuarioResponse(Long id, String usuario, String nome, String email, String ativo, String trocarSenha, LocalDateTime dataCadastro) {
    static UsuarioResponse from(Usuario u){return new UsuarioResponse(u.getId(),u.getCodigo(),u.getNome(),u.getEmail(),u.getAtivo(),u.getTrocarSenha(),u.getDataCadastro());}
}
