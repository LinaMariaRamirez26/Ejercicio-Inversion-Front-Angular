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

  // Mapeo de IDs de fondos del frontend a IDs del backend
  private fondoIdMapping: { [key: string]: string } = {
    'FPV_BTG_PACTUAL_RECAUDADORA': '1',
    'FPV_BTG_PACTUAL_ECOPETROL': '2',
    'DEUDAPRIVADA': '3',
    'FDO-ACCIONES': '4',
    'FPV_BTG_PACTUAL_DINAMICA': '5'
  };

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

  // Suscribir usuario a un fondo
  suscribirAFondo(usuarioId: string, fondoId: string, monto: number): Observable<any> {
    // Convertir el ID del frontend al ID del backend
    const fondoIdBackend = this.fondoIdMapping[fondoId] || fondoId;
    return this.http.post<any>(`${this.apiUrl}/${this.USUARIO_ID}/fondos/${fondoIdBackend}?monto=${monto}`, {});
  }

  // Cancelar suscripción a un fondo
  cancelarSuscripcion(usuarioId: string, fondoId: string): Observable<any> {
    // Convertir el ID del frontend al ID del backend
    const fondoIdBackend = this.fondoIdMapping[fondoId] || fondoId;
    return this.http.delete<any>(`${this.apiUrl}/${this.USUARIO_ID}/fondos/${fondoIdBackend}`);
  }

  // Obtener historial de transacciones por usuario
  obtenerHistorialTransacciones(usuarioId: string): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.apiUrl}/${this.USUARIO_ID}/transacciones`);
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