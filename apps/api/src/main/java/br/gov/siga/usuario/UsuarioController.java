package br.gov.siga.usuario;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/usuarios")
public class UsuarioController {
 private final UsuarioRepository repository; private final BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();
 public UsuarioController(UsuarioRepository repository){this.repository=repository;}
 @GetMapping public List<UsuarioResponse> listar(){return repository.findAll(Sort.by("nome")).stream().map(UsuarioResponse::from).toList();}
 @PostMapping @ResponseStatus(HttpStatus.CREATED)
 public UsuarioResponse criar(@Valid @RequestBody UsuarioRequest r){
   if(repository.findByCodigoIgnoreCase(r.usuario().trim()).isPresent()) throw new IllegalArgumentException("Usuário já cadastrado.");
   Usuario u=new Usuario(); u.setCodigo(r.usuario().trim().toLowerCase()); u.setNome(r.nome().trim()); u.setEmail(r.email()==null?null:r.email().trim().toLowerCase()); u.setSenhaHash(encoder.encode(r.senha())); return UsuarioResponse.from(repository.save(u));
 }
}
