import { Routes } from '@angular/router';
import { ActualizaUsuarioComponent } from './components/actualiza-usuario/actualiza-usuario.component';
import { DetalleUsuarioComponent } from './components/detalle-usuario/detalle-usuario.component';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { NuevoUsuarioComponent } from './components/nuevo-usuario/nuevo-usuario.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: ListaUsuariosComponent },
  { path: 'user/:iduser', component: DetalleUsuarioComponent },
  { path: 'newuser', component: NuevoUsuarioComponent },
  { path: 'updateuser/:iduser', component: ActualizaUsuarioComponent },
  { path: "**", redirectTo: 'home' }
];
