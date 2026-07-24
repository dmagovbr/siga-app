/**
 * OBJETIVO DO ARQUIVO: Consulta opções de visibilidade no banco de dados.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao.visibilidade;

import org.springframework.data.jpa.repository.JpaRepository;

/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public interface VisibilidadeRepository extends JpaRepository<Visibilidade, String> {}
