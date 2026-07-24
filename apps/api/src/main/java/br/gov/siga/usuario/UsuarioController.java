/**
 * OBJETIVO DO ARQUIVO: Implementa os endpoints de consulta e manutenção de usuários.
 * Comentários destacam responsabilidades e decisões; linhas óbvias permanecem limpas.
 */
package br.gov.siga.usuario;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
// Marca a classe como controller REST; os retornos são serializados em JSON.
@RestController @RequestMapping("/api/usuarios")
/** Define o tipo principal e concentra apenas a responsabilidade deste arquivo. */
public class UsuarioController {
 private final UsuarioRepository repository; private final BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();
 public UsuarioController(UsuarioRepository repository){this.repository=repository;}
 // Atende uma consulta HTTP GET sem alterar dados.
 @GetMapping public List<UsuarioResponse> listar(){return repository.findAll(Sort.by("nome")).stream().map(UsuarioResponse::from).toList();}
 // Atende uma inclusão HTTP POST.
 @PostMapping @ResponseStatus(HttpStatus.CREATED)
 /** Executa a responsabilidade de `criar` mantendo este fluxo isolado e testável. */
 public UsuarioResponse criar(@Valid @RequestBody UsuarioRequest r){
   if(repository.findByCodigoIgnoreCase(r.usuario().trim()).isPresent()) throw new IllegalArgumentException("Usuário já cadastrado.");
   Usuario u=new Usuario(); u.setCodigo(r.usuario().trim().toLowerCase()); u.setNome(r.nome().trim()); u.setEmail(r.email()==null?null:r.email().trim().toLowerCase()); u.setSenhaHash(encoder.encode(r.senha())); return UsuarioResponse.from(repository.save(u));
 }
}
