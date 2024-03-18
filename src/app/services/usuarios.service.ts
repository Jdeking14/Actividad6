import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url: string = 'https://peticiones.online/api/users'

  private httpClient = inject(HttpClient);


  getUsersByPage(page: number, total_pages: number,): Observable<any> {
    return this.httpClient.get<any>(this.url, { params: { page, total_pages } });
  }

  getUserById(id: string): Observable<any> {
    return this.httpClient.get<any>(this.url + '/' + id);
  }

  createNewUser(newUser: Usuario): Observable<any> {
    return this.httpClient.post<any>(this.url, newUser);
  }

  updateUser(id: string, usuario: Usuario): Observable<any> {
    return this.httpClient.put<any>(this.url + '/' + id, usuario);
  }

  deleteUser(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/${id}`);
  }
}
