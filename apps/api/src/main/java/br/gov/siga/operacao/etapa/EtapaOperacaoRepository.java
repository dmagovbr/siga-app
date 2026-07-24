/**
 * OBJETIVO DO ARQUIVO: Consulta etapas de operação no banco de dados.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao.etapa;

import org.springframework.data.jpa.repository.JpaRepository;

/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public interface EtapaOperacaoRepository extends JpaRepository<EtapaOperacao, Long> {}
