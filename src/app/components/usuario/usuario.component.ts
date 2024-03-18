import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario.interface';
import { UsuariosService } from '../../services/usuarios.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  @Input() miUsuario: Usuario | any;

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  delete(id: string): void {
    Swal.fire({
      title: '¿Está usted seguro?',
      text: "No podrá revertir este cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí'
    }).then((result) => {
      if (result.isConfirmed && id) {
        this.usuariosService.deleteUser(id).subscribe({
          next: (response) => {
            Swal.fire(
              'Eliminado!',
              `El usuario ha sido borrado correctamente.`,
              'success'
            );
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ha ocurrido un error al intentar borrar el usuario'
            });
          }
        });
      }
    });
  }
}
