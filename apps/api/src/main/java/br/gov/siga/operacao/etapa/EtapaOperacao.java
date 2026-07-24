/**
 * OBJETIVO DO ARQUIVO: Representa uma etapa possível do ciclo de uma operação.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao.etapa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Informa ao JPA que esta classe representa uma tabela persistida.
@Entity
// Associa explicitamente a entidade à tabela indicada no banco.
@Table(name = "tb_etapa_operacao")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class EtapaOperacao {
    // Identifica a chave primária da entidade.
    @Id
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "id_etapa_operacao")
    private Long id;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "cd_etapa_operacao", nullable = false, length = 60)
    private String codigo;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "ds_etapa_operacao", nullable = false, length = 120)
    private String descricao;

    protected EtapaOperacao() {}

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getDescricao() { return descricao; }
}
