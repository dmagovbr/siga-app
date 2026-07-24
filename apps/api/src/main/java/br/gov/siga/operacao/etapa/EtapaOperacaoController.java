package br.gov.siga.operacao.etapa;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/etapas-operacao")
public class EtapaOperacaoController {
    private final EtapaOperacaoRepository repository;

    public EtapaOperacaoController(EtapaOperacaoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<EtapaOperacao> listar() {
        return repository.findAll(Sort.by("id"));
    }
}
