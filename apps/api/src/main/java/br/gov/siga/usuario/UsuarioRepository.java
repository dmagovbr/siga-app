/**
 * OBJETIVO DO ARQUIVO: Fornece acesso ao banco para usuários.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.usuario;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCodigoIgnoreCase(String codigo);
}
