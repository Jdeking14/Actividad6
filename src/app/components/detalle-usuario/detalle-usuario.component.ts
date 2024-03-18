import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Usuario } from '../../interfaces/usuario.interface';
import { UsuariosService } from '../../services/usuarios.service';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-usuario',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {

  id: string = '';
  usuario: Usuario | any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private usuariosService: UsuariosService,
    private router: Router
    ) {}

    ngOnInit(): void {
      this.activatedRoute.params.pipe(
        tap(params => this.id = params['iduser']),
        filter(params => !!params['iduser']),
        switchMap(params => this.usuariosService.getUserById(params['iduser'])),
        catchError(error => {
          this.showError('El usuario que intentas acceder no existe');
          return of(null); // Aqui Manejo el error para que el flujo pueda continuar
        })
      ).subscribe(usuario => {
        if(usuario) {
          this.usuario = usuario;
          console.log(usuario);
        }
      });
    }
  
    delete(id: string | undefined): void {
      Swal.fire({
        title: '¿Está usted seguro?',
        text: "No podrá revertir el resultado",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrarlo!'
      }).then(result => {
        if (result.isConfirmed && id) {
          this.usuariosService.deleteUser(id).pipe(
            catchError(error => {
              this.showError('El usuario que intentas borrar no existe');
              return of(null); // Evita que el flujo se detenga.
            })
          ).subscribe(response => {
            if(response) {
              Swal.fire(
                'Eliminado!',
                `El usuario ${response.first_name} ha sido borrado.`,
                'success'
              );
              this.router.navigate(['/home']);
            }
          });
        }
      });
    }
  
    private showError(message: string): void {
      Swal.fire({
        icon: 'error',
        title: 'vaya...',
        text: message,
      });
      console.error(message);
    }
  }