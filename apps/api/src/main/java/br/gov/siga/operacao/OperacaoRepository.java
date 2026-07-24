/**
 * OBJETIVO DO ARQUIVO: Fornece acesso ao banco para a entidade Operacao usando Spring Data JPA.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public interface OperacaoRepository extends JpaRepository<Operacao, Long>, JpaSpecificationExecutor<Operacao> {
}
