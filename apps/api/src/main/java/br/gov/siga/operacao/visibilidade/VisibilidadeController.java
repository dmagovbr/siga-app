package br.gov.siga.operacao.visibilidade;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/visibilidades")
public class VisibilidadeController {
    private final VisibilidadeRepository repository;

    public VisibilidadeController(VisibilidadeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Visibilidade> listar() {
        return repository.findAll(Sort.by("id"));
    }
}
