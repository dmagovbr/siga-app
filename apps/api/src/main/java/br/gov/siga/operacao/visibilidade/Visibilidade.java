/**
 * OBJETIVO DO ARQUIVO: Representa uma opção de visibilidade da operação.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao.visibilidade;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Informa ao JPA que esta classe representa uma tabela persistida.
@Entity
// Associa explicitamente a entidade à tabela indicada no banco.
@Table(name = "tb_visibilidade")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class Visibilidade {
    // Identifica a chave primária da entidade.
    @Id
    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "id_visibilidade", length = 1)
    private String id;

    // Mapeia o atributo para a coluna e aplica suas restrições básicas.
    @Column(name = "ds_visibilidade", nullable = false, length = 60)
    private String descricao;

    protected Visibilidade() {}

    public String getId() { return id; }
    public String getDescricao() { return descricao; }
}
