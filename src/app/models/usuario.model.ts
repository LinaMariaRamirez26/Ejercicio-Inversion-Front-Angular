export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  saldo: number;
  notificacionEmail: boolean;
  notificacionSMS: boolean;
  fondosSuscritos: string[];
}

export interface Fondo {
  id: number;
  nombre: string;
  monto: number;
}