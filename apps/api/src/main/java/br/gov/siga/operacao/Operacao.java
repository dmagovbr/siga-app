/**
 * OBJETIVO DO ARQUIVO: Representa uma operação persistida no banco de dados.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Informa ao JPA que esta classe representa uma tabela persistida.
@Entity
// Associa explicitamente a entidade à tabela indicada no banco.
@Table(name = "tb_operacao")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class Operacao {
    // Identifica a chave primária da entidade.
    @Id
    // Delega ao banco a geração automática do identificador.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "id_operacao")
    private Long id;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "id_etapa_operacao_fk")
    private Long etapaId = 10L;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "id_visibilidade_fk", nullable = false, length = 1)
    private String visibilidadeId = "R";

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "nr_inquerito_ipl", length = 12)
    private String numeroInquerito;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "no_operacao", nullable = false, length = 255)
    private String nome;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "ds_razao_nome", length = 1000)
    private String razaoNome;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "dt_inicio_operacao")
    private LocalDate dataInicio;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "ds_operacao", length = 2000)
    private String descricao;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "ds_notas", length = 4000)
    private String notas;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "dt_cadastro", insertable = false, updatable = false)
    private LocalDateTime dataCadastro;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "dt_ultima_alteracao")
    private LocalDateTime dataUltimaAlteracao = LocalDateTime.now();

    protected Operacao() {}

    public Long getId() { return id; }
    public Long getEtapaId() { return etapaId; }
    public void setEtapaId(Long etapaId) { this.etapaId = etapaId; }
    public String getVisibilidadeId() { return visibilidadeId; }
    public void setVisibilidadeId(String visibilidadeId) { this.visibilidadeId = visibilidadeId; }
    public String getNumeroInquerito() { return numeroInquerito; }
    public void setNumeroInquerito(String numeroInquerito) { this.numeroInquerito = numeroInquerito; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getRazaoNome() { return razaoNome; }
    public void setRazaoNome(String razaoNome) { this.razaoNome = razaoNome; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public LocalDateTime getDataUltimaAlteracao() { return dataUltimaAlteracao; }
    public void setDataUltimaAlteracao(LocalDateTime dataUltimaAlteracao) { this.dataUltimaAlteracao = dataUltimaAlteracao; }
}
