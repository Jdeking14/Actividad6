import { Component } from '@angular/core';
import { FormularioComponent } from '../formulario/formulario.component';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [ FormularioComponent ],
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent {
    newUsuario: boolean = true;
}
