import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Fondo } from '../models/fondo.model';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FondoService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private fondosApiUrl = `${environment.apiUrl}/fondos`;
  private nombreFondoCache: Record<string, string> = {};

  // ID de usuario fijo para el backend
  private readonly USUARIO_ID = 'usuario-unico';

  constructor(private http: HttpClient) { }


  /**  Metodo para obtener el nombre del fondo por ID del backend
   *
   * @param idBackend
   */
  obtenerNombreFondoPorIdBackend(idBackend: string): string {
    const cached = this.nombreFondoCache[idBackend];
    if (cached) return cached;

    const placeholder = `Fondo ${idBackend}`;
    this.http.get<Fondo>(`${this.fondosApiUrl}/id/${idBackend}`).pipe(
      map((fondo) => fondo?.nombre ?? placeholder),
      catchError(() => of(placeholder))
    ).subscribe(nombre => {
      this.nombreFondoCache[idBackend] = nombre;
    });

    return placeholder;
  }

  obtenerFondos(): Observable<Fondo[]> {
    return this.http.get<Fondo[]>(`${this.fondosApiUrl}`);
  }

  obtenerFondo(id: string): Observable<Fondo> {
    return this.http.get<Fondo>(`${this.fondosApiUrl}/id/${id}`);
  }

  suscribirAFondo(usuarioId: string, fondoId: string, monto: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.USUARIO_ID}/fondos/${fondoId}?monto=${monto}`, {});
  }

  cancelarFondo(usuarioId: string, fondoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${this.USUARIO_ID}/fondos/${fondoId}`);
  }
}
