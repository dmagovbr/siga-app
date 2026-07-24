/**
 * OBJETIVO DO ARQUIVO: Disponibiliza opções de visibilidade para o frontend.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao.visibilidade;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Marca a classe como controller REST; os retornos são serializados em JSON.
@RestController
// Define o prefixo comum usado pelos endpoints desta classe.
@RequestMapping("/api/visibilidades")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class VisibilidadeController {
    private final VisibilidadeRepository repository;

    /** Executa a responsabilidade de `VisibilidadeController` mantendo este fluxo isolado e testável. */
    public VisibilidadeController(VisibilidadeRepository repository) {
        this.repository = repository;
    }

    // Atende uma consulta HTTP GET sem alterar dados.
    @GetMapping
    /** Executa a responsabilidade de `listar` mantendo este fluxo isolado e testável. */
    public List<Visibilidade> listar() {
        // Devolve o resultado final deste caminho de execução.
        return repository.findAll(Sort.by("id"));
    }
}
