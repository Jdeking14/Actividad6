import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  id: string = '';
  usuario: Usuario | any = {};

  @Input() newUsuario: boolean | any;

  formModel: FormGroup;

  constructor(
    private usuariosService: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    //Aqui implemetno un formgroup con validators para todos los campos del formulario
    this.formModel = new FormGroup({
      first_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ]),
      last_name: new FormControl("", [
        Validators.required
      ]),
      username: new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.pattern(/^(?=(.*[a-zA-Z].*){2,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/)
      ]),
      repetirpassword: new FormControl("", [
        Validators.required
      ])
    }, [
      this.checkPassword
    ]);

  }

  ngOnInit(): void {
    if (!this.newUsuario) {
      this.activatedRoute.params.subscribe(params => {
        this.id = params['iduser'];
        const miObservable = {
          next: (response: Usuario) => {
            if (response) {
              this.usuario = response;
              console.log(response);
              this.formModel = new FormGroup({
                first_name: new FormControl(this.usuario.first_name, [
                  Validators.required,
                  Validators.minLength(3)
                ]),
                last_name: new FormControl(this.usuario.last_name, [
                  Validators.required
                ]),
                username: new FormControl(this.usuario.username, [
                  Validators.required,
                  Validators.minLength(3)
                ]),
                email: new FormControl(this.usuario.email, [
                  Validators.required
                ]),
                image: new FormControl(this.usuario.image, [
                  Validators.required
                ]),
                password: new FormControl(this.usuario.password, [
                  Validators.required,
                  Validators.minLength(8)
                ]),
                repetirpassword: new FormControl(this.usuario.password, [
                  Validators.required
                ])
              }, [
                this.checkPassword
              ]);
            }
          },
          error: (error: any) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Vaya',
              text: 'El usuario que intentas actualizar no existe'
            })
          }
        };
        if (this.id) {
          this.usuariosService.getUserById(this.id).subscribe(miObservable)
        }
      })
    }
  }

  getDataForm() {

    if (this.newUsuario) {

      let nuevoUsuario: Usuario = this.formModel.value;

      this.usuariosService.createNewUser(nuevoUsuario).subscribe(data => {
        let dataResponseCreate = data;
        console.log(dataResponseCreate);
        Swal.fire({
          title: `Usuario registrado con id: ${dataResponseCreate.id}`,
          html: `
          <p>Nombre: ${dataResponseCreate.first_name}</p>
          <p>Apellido: ${dataResponseCreate.last_name}</p>
          <p>Apodo: ${dataResponseCreate.username}</p>
          <p>Email: ${dataResponseCreate.email}</p>
          <p>Imagen: ${dataResponseCreate.image}</p>
          `
        });
      });

      this.formModel.reset();
    } else {
      let usuarioActualizado: Usuario = this.formModel.value;

      this.activatedRoute.params.subscribe(params => {
        this.id = params['iduser'];
        const miObservable = {
          next: (response: Usuario) => {
            if (response) {
              const dataResponseUpdate = response;
              console.log(dataResponseUpdate);
              Swal.fire({
                title: `Se ha actualizado el usuario con los siguientes datos:`,
                html: `
                  <p>Nombre: ${dataResponseUpdate.first_name}</p>
                  <p>Apellidos: ${dataResponseUpdate.last_name}</p>
                  <p>Apodo: ${dataResponseUpdate.username}</p>
                  <p>Email: ${dataResponseUpdate.email}</p>
                  <p>Url imagen: ${dataResponseUpdate.image}</p>
                  `,
                icon: 'success' // Esto queda genial con los sweetalert
              });
            }
          },
          error: (error: any) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El usuario que intentas editar no existe'
            })
          }
        };
        if (this.id) {
          this.usuariosService.updateUser(this.id, usuarioActualizado).subscribe(miObservable);
        }
      })
      this.formModel.reset();
      this.router.navigate(['/home']);
    }
  }
/**
 * Funcion que sirve para controlar los campos del formulario
 * @param pControlName 
 * @param pError 
 * @returns 
 */
  checkControl(pControlName: string, pError: string): boolean {
    if (this.formModel.get(pControlName)?.hasError(pError) && this.formModel.get(pControlName)?.touched) {
      return true;
    }
    return false;
  }
/**
 * Con esta funcion valido la contraseña que se le pasa al formulario
 * @param pFormValue 
 * @returns 
 */
  checkPassword(pFormValue: AbstractControl) {
    const password: string = pFormValue.get('password')?.value;
    const repeatPassword: string = pFormValue.get('repetirpassword')?.value;

    if (password !== repeatPassword) {
      return { 'comprobarpass': true }
    }
    return null;
  }

  /**
   * Funcion que se encarga de obtener una imagen a traves de un file que se pasa en la pagina web
   * @param event 
   */
  displayImageURL(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.usuario.image = e.target!.result as string; // Almacena la representación Base64 de la imagen
      };
      reader.readAsDataURL(file); // Convierte la imagen a Base64
    }
  }
}
