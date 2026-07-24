/**
 * OBJETIVO DO ARQUIVO: Implementa os endpoints de consulta e manutenção de operações.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// Marca a classe como controller REST; os retornos são serializados em JSON.
@RestController
// Define o prefixo comum usado pelos endpoints desta classe.
@RequestMapping("/api/operacoes")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class OperacaoController {
    private final OperacaoRepository repository;

    /** Executa a responsabilidade de `OperacaoController` mantendo este fluxo isolado e testável. */
    public OperacaoController(OperacaoRepository repository) {
        this.repository = repository;
    }

    private static final Set<String> CAMPOS_ORDENAVEIS = Set.of(
        "id", "nome", "numeroInquerito", "etapaId", "visibilidadeId", "dataInicio"
    );

    // Atende uma consulta HTTP GET sem alterar dados.
    @GetMapping
    public Page<Operacao> listar(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id") String sort,
        @RequestParam(defaultValue = "desc") String direction,
        @RequestParam(defaultValue = "") String q
    ) {
        int tamanho = Math.max(1, Math.min(size, 100));
        String campo = CAMPOS_ORDENAVEIS.contains(sort) ? sort : "id";
        Sort.Direction direcao = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String termo = q == null ? "" : q.trim().toLowerCase(Locale.ROOT);

        Specification<Operacao> filtro = (root, query, cb) -> {
            // Valida a condição antes de continuar pelo fluxo correspondente.
            if (termo.isBlank()) return cb.conjunction();
            String like = "%" + termo + "%";
            // Devolve o resultado final deste caminho de execução.
            return cb.or(
                cb.like(cb.lower(root.get("nome")), like),
                cb.like(cb.lower(root.get("numeroInquerito")), like)
            );
        };

        // Devolve o resultado final deste caminho de execução.
        return repository.findAll(
            filtro,
            PageRequest.of(Math.max(page, 0), tamanho, Sort.by(direcao, campo))
        );
    }

    // Atende uma inclusão HTTP POST.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    /** Executa a responsabilidade de `criar` mantendo este fluxo isolado e testável. */
    public Operacao criar(@Valid @RequestBody OperacaoRequest request) {
        // Devolve o resultado final deste caminho de execução.
        return repository.save(preencher(new Operacao(), request));
    }

    // Atende uma alteração HTTP PUT.
    @PutMapping("/{id}")
    /** Executa a responsabilidade de `alterar` mantendo este fluxo isolado e testável. */
    public Operacao alterar(@PathVariable Long id, @Valid @RequestBody OperacaoRequest request) {
        Operacao operacao = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Operação não encontrada."));
        // Devolve o resultado final deste caminho de execução.
        return repository.save(preencher(operacao, request));
    }

    // Atende uma remoção HTTP DELETE.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    /** Executa a responsabilidade de `remover` mantendo este fluxo isolado e testável. */
    public void remover(@PathVariable Long id) {
        // Valida a condição antes de continuar pelo fluxo correspondente.
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Operação não encontrada.");
        }
        repository.deleteById(id);
    }

    /** Executa a responsabilidade de `preencher` mantendo este fluxo isolado e testável. */
    private Operacao preencher(Operacao operacao, OperacaoRequest request) {
        operacao.setNome(request.nome().trim());
        operacao.setNumeroInquerito(request.numeroInquerito());
        operacao.setRazaoNome(request.razaoNome());
        operacao.setDataInicio(request.dataInicio());
        operacao.setDescricao(request.descricao());
        operacao.setNotas(request.notas());
        operacao.setEtapaId(request.etapaId() == null ? 10L : request.etapaId());
        operacao.setVisibilidadeId(request.visibilidadeId() == null ? "R" : request.visibilidadeId());
        operacao.setDataUltimaAlteracao(LocalDateTime.now());
        // Devolve o resultado final deste caminho de execução.
        return operacao;
    }
}
