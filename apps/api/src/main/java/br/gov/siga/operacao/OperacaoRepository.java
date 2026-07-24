package br.gov.siga.operacao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface OperacaoRepository extends JpaRepository<Operacao, Long>, JpaSpecificationExecutor<Operacao> {
}
