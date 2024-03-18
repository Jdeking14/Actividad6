import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Usuario } from '../../interfaces/usuario.interface';
import { UsuariosService } from '../../services/usuarios.service';
import { UsuarioComponent } from '../usuario/usuario.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [UsuarioComponent, SpinnerComponent, CommonModule, RouterModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {
  arrUsuarios: Usuario[] = [];
  page: number = 1;
  total_pages: number = 2;
  loading: boolean = true;
  paginaProxima: boolean = false;
  paginaPrevia: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.obtenerUsuariosPorPagina();
  }

  obtenerUsuariosPorPagina(): void {
    this.loading = true;
    this.usuariosService.getUsersByPage(this.page, this.total_pages).pipe(
      finalize(() => this.loading = false),
      tap(() => {
        this.paginaPrevia = this.page > 1; // Habilita el botón de página previa si no estamos en la primera página
        this.paginaProxima = this.page < this.total_pages; // Habilita el botón de próxima página si no es la última
      })
    ).subscribe({
      next: (data) => this.arrUsuarios = data.results,
      error: (error) => console.error(error)
    });
  }

  nextPage(): void {
    if (this.page < this.total_pages) {
      this.page++;
      this.obtenerUsuariosPorPagina();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.obtenerUsuariosPorPagina();
    }
  }

  goStart(): void {
    this.scroller.scrollToAnchor('inicio');
  }
}
