/**
 * OBJETIVO DO ARQUIVO: Expõe o endpoint de autenticação e devolve os dados básicos da sessão.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.auth;

import br.gov.siga.usuario.Usuario;
import br.gov.siga.usuario.UsuarioRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// Marca a classe como controller REST; os retornos são serializados em JSON.
@RestController
// Define o prefixo comum usado pelos endpoints desta classe.
@RequestMapping("/api/auth")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class AuthController {
    private final UsuarioRepository usuarios;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /** Executa a responsabilidade de `AuthController` mantendo este fluxo isolado e testável. */
    public AuthController(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    // Atende uma inclusão HTTP POST.
    @PostMapping("/login")
    /** Executa a responsabilidade de `login` mantendo este fluxo isolado e testável. */
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarios.findByCodigoIgnoreCase(request.usuario().trim())
            .filter(item -> "1".equals(item.getAtivo()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos."));

        // Valida a condição antes de continuar pelo fluxo correspondente.
        if (!encoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos.");
        }

        // Devolve o resultado final deste caminho de execução.
        return new LoginResponse(
            usuario.getId(),
            usuario.getCodigo(),
            usuario.getNome(),
            usuario.getEmail(),
            "1".equals(usuario.getTrocarSenha()),
            List.of("administrador")
        );
    }
}
