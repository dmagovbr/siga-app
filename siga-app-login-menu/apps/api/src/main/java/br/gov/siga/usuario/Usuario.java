package br.gov.siga.usuario;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_usuario")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario") private Long id;
    @Column(name = "cd_usuario", nullable = false, unique = true) private String codigo;
    @Column(name = "no_usuario", nullable = false) private String nome;
    @Column(name = "ds_email", unique = true) private String email;
    @Column(name = "ds_senha_hash", nullable = false) private String senhaHash;
    @Column(name = "st_ativo", nullable = false, length = 1) private String ativo = "1";
    @Column(name = "st_trocar_senha", nullable = false, length = 1) private String trocarSenha = "1";
    @Column(name = "dt_cadastro", insertable = false, updatable = false) private LocalDateTime dataCadastro;
    protected Usuario() {}
    public Long getId(){return id;} public String getCodigo(){return codigo;} public void setCodigo(String v){codigo=v;}
    public String getNome(){return nome;} public void setNome(String v){nome=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getSenhaHash(){return senhaHash;} public void setSenhaHash(String v){senhaHash=v;} public String getAtivo(){return ativo;} public String getTrocarSenha(){return trocarSenha;}
    public LocalDateTime getDataCadastro(){return dataCadastro;}
}
