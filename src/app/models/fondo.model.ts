export interface Fondo {
  id: string;
  nombre: string;
  descripcion?: string;
  rentabilidad?: number;
  montoMinimo: number;
  categoria: string;
}