import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Transaccion } from '../models/transaccion.model';
import { TransaccionService } from './transaccion.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // ID de usuario fijo para el backend
  private readonly USUARIO_ID = 'usuario-unico';

  constructor(
    private http: HttpClient,
    private transaccionService: TransaccionService
  ) { }

  // Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  // Obtener usuario por ID
  getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${this.USUARIO_ID}`);
  }

  // Suscribir usuario a un fondo (ahora se usa el ID del backend directamente)
  suscribirAFondo(usuarioId: string, fondoId: string, monto: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${this.USUARIO_ID}/fondos/${fondoId}?monto=${monto}`, {});
  }

  // Cancelar suscripción a un fondo
  cancelarSuscripcion(usuarioId: string, fondoId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${this.USUARIO_ID}/fondos/${fondoId}`);
  }

  // Obtener historial de transacciones por usuario
  obtenerHistorialTransacciones(usuarioId: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${usuarioId}/transacciones?page=${page}&size=${size}`);
  }

  // Actualizar preferencias de notificación
  actualizarPreferenciasNotificacion(usuarioId: string, email: boolean, sms: boolean): Observable<Usuario> {
    const preferencias = {
      notificacionEmail: email,
      notificacionSMS: sms
    };
    return this.http.put<Usuario>(`${this.apiUrl}/${this.USUARIO_ID}/preferencias`, preferencias);
  }
}
