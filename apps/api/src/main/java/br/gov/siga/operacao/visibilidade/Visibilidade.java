package br.gov.siga.operacao.visibilidade;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_visibilidade")
public class Visibilidade {
    @Id
    @Column(name = "id_visibilidade", length = 1)
    private String id;

    @Column(name = "ds_visibilidade", nullable = false, length = 60)
    private String descricao;

    protected Visibilidade() {}

    public String getId() { return id; }
    public String getDescricao() { return descricao; }
}
