export interface Transaccion {
  id: number;
  usuarioId: number;
  fondoId: string;
  tipo: 'APERTURA' | 'CANCELACION';
  fecha: string;
  monto: number;
}