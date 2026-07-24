package br.gov.siga.operacao.etapa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_etapa_operacao")
public class EtapaOperacao {
    @Id
    @Column(name = "id_etapa_operacao")
    private Long id;

    @Column(name = "cd_etapa_operacao", nullable = false, length = 60)
    private String codigo;

    @Column(name = "ds_etapa_operacao", nullable = false, length = 120)
    private String descricao;

    protected EtapaOperacao() {}

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getDescricao() { return descricao; }
}
