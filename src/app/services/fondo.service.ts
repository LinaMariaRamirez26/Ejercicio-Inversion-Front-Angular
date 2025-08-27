import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Fondo } from '../models/fondo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FondoService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // Datos mock de fondos disponibles
  private fondosMock: Fondo[] = [
    {
      id: 'FPV_BTG_PACTUAL_RECAUDADORA',
      nombre: 'FPV_BTG_PACTUAL_RECAUDADORA',
      montoMinimo: 75000,
      categoria: 'FPV'
    },
    {
      id: 'FPV_BTG_PACTUAL_ECOPETROL',
      nombre: 'FPV_BTG_PACTUAL_ECOPETROL',
      montoMinimo: 125000,
      categoria: 'FPV'
    },
    {
      id: 'DEUDAPRIVADA',
      nombre: 'DEUDAPRIVADA',
      montoMinimo: 50000,
      categoria: 'FIC'
    },
    {
      id: 'FDO-ACCIONES',
      nombre: 'FDO-ACCIONES',
      montoMinimo: 250000,
      categoria: 'FIC'
    },
    {
      id: 'FPV_BTG_PACTUAL_DINAMICA',
      nombre: 'FPV_BTG_PACTUAL_DINAMICA',
      montoMinimo: 100000,
      categoria: 'FPV'
    }
  ];

  // Mapeo de IDs de fondos del frontend a IDs del backend
  private fondoIdMapping: { [key: string]: string } = {
    'FPV_BTG_PACTUAL_RECAUDADORA': '1',
    'FPV_BTG_PACTUAL_ECOPETROL': '2',
    'DEUDAPRIVADA': '3',
    'FDO-ACCIONES': '4',
    'FPV_BTG_PACTUAL_DINAMICA': '5'
  };

  // ID de usuario fijo para el backend
  private readonly USUARIO_ID = 'usuario-unico';

  constructor(private http: HttpClient) { }

  // Método para obtener el nombre del fondo por ID del backend
  obtenerNombreFondoPorIdBackend(idBackend: string): string {
    // Buscar el ID del frontend que corresponde al ID del backend
    const fondoFrontendId = Object.keys(this.fondoIdMapping).find(
      key => this.fondoIdMapping[key] === idBackend
    );
    
    if (fondoFrontendId) {
      const fondo = this.fondosMock.find(f => f.id === fondoFrontendId);
      return fondo?.nombre || `Fondo ${idBackend}`;
    }
    
    return `Fondo ${idBackend}`;
  }

  obtenerFondos(): Observable<Fondo[]> {
    // Retornamos los datos mock ya que el backend no tiene endpoint para fondos
    return of(this.fondosMock);
  }

  obtenerFondo(id: string): Observable<Fondo> {
    const fondo = this.fondosMock.find(f => f.id === id);
    return of(fondo!);
  }

  suscribirAFondo(usuarioId: string, fondoId: string, monto: number): Observable<any> {
    const backendFondoId = this.fondoIdMapping[fondoId] || fondoId;
    return this.http.post(`${this.apiUrl}/${this.USUARIO_ID}/fondos/${backendFondoId}?monto=${monto}`, {});
  }

  cancelarFondo(usuarioId: string, fondoId: string): Observable<any> {
    const backendFondoId = this.fondoIdMapping[fondoId] || fondoId;
    return this.http.delete(`${this.apiUrl}/${this.USUARIO_ID}/fondos/${backendFondoId}`);
  }
}