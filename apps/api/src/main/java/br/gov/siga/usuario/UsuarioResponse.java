package br.gov.siga.usuario;
import java.time.LocalDateTime;
public record UsuarioResponse(Long id, String usuario, String nome, String email, String ativo, String trocarSenha, LocalDateTime dataCadastro) {
    static UsuarioResponse from(Usuario u){return new UsuarioResponse(u.getId(),u.getCodigo(),u.getNome(),u.getEmail(),u.getAtivo(),u.getTrocarSenha(),u.getDataCadastro());}
}
