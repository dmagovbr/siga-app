/**
 * OBJETIVO DO ARQUIVO: Representa um usuário persistido no banco de dados.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.usuario;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Informa ao JPA que esta classe representa uma tabela persistida.
@Entity
// Associa explicitamente a entidade à tabela indicada no banco.
@Table(name = "tb_usuario")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class Usuario {
    // Identifica a chave primária da entidade.
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "id_usuario") private Long id;
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "cd_usuario", nullable = false, unique = true) private String codigo;
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "no_usuario", nullable = false) private String nome;
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "ds_email", unique = true) private String email;
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "ds_senha_hash", nullable = false) private String senhaHash;
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "st_ativo", nullable = false, length = 1) private String ativo = "1";
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "st_trocar_senha", nullable = false, length = 1) private String trocarSenha = "1";
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "dt_cadastro", insertable = false, updatable = false) private LocalDateTime dataCadastro;
    protected Usuario() {}
    public Long getId(){return id;} public String getCodigo(){return codigo;} public void setCodigo(String v){codigo=v;}
    public String getNome(){return nome;} public void setNome(String v){nome=v;} public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getSenhaHash(){return senhaHash;} public void setSenhaHash(String v){senhaHash=v;} public String getAtivo(){return ativo;} public String getTrocarSenha(){return trocarSenha;}
    public LocalDateTime getDataCadastro(){return dataCadastro;}
}
