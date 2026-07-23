package br.gov.siga.operacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record OperacaoRequest(
    @NotBlank @Size(max = 255) String nome,
    @Size(max = 40) String numeroInquerito,
    @Size(max = 1000) String razaoNome,
    LocalDate dataInicio,
    @Size(max = 2000) String descricao,
    @Size(max = 4000) String notas,
    Long etapaId,
    @Size(min = 1, max = 1) String visibilidadeId
) {}
