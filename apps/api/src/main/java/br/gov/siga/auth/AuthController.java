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

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioRepository usuarios;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarios.findByCodigoIgnoreCase(request.usuario().trim())
            .filter(item -> "1".equals(item.getAtivo()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos."));

        if (!encoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos.");
        }

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
