import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Transaccion } from '../../models/transaccion.model';
import { UsuarioService } from '../../services/usuario.service';
import { FondoService } from '../../services/fondo.service';

@Component({
  selector: 'app-transaccion-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './transaccion-list.component.html',
  styles: []
})
export class TransaccionListComponent implements OnInit {
  usuarioId: string = '';
  transacciones: Transaccion[] = [];
  cargando: boolean = false;
  error: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private fondoService: FondoService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usuarioId = params['id']; // Mantener como string
      this.cargarTransacciones();
    });
  }

  cargarTransacciones(): void {
    this.cargando = true;
    this.error = '';
    
    this.usuarioService.obtenerHistorialTransacciones(this.usuarioId).subscribe({
      next: (data) => {
        this.transacciones = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar las transacciones', error);
        this.error = 'Error al cargar el historial de transacciones. Verifique que el backend esté ejecutándose.';
        this.cargando = false;
      }
    });
  }

  obtenerNombreFondo(fondoId: string): string {
    return this.fondoService.obtenerNombreFondoPorIdBackend(fondoId);
  }
}