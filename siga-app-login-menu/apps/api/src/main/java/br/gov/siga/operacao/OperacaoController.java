package br.gov.siga.operacao;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/operacoes")
public class OperacaoController {
    private final OperacaoRepository repository;

    public OperacaoController(OperacaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Operacao> listar() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Operacao criar(@Valid @RequestBody OperacaoRequest request) {
        Operacao operacao = new Operacao();
        operacao.setNome(request.nome().trim());
        operacao.setNumeroInquerito(request.numeroInquerito());
        operacao.setRazaoNome(request.razaoNome());
        operacao.setDataInicio(request.dataInicio());
        operacao.setDescricao(request.descricao());
        operacao.setNotas(request.notas());
        operacao.setEtapaId(request.etapaId() == null ? 10L : request.etapaId());
        operacao.setVisibilidadeId(request.visibilidadeId() == null ? "R" : request.visibilidadeId());
        operacao.setDataUltimaAlteracao(LocalDateTime.now());
        return repository.save(operacao);
    }
}
