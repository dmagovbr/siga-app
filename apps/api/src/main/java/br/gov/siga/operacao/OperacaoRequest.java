/**
 * OBJETIVO DO ARQUIVO: Define e valida os campos aceitos ao criar ou alterar uma operação.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.operacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public record OperacaoRequest(
    @NotBlank @Size(max = 255) String nome,
    @Size(max = 12) String numeroInquerito,
    @Size(max = 1000) String razaoNome,
    LocalDate dataInicio,
    @Size(max = 2000) String descricao,
    @Size(max = 4000) String notas,
    Long etapaId,
    @Size(min = 1, max = 1) String visibilidadeId
) {}
