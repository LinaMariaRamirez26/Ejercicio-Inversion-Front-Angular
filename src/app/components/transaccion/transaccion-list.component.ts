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
  paginaActual = 0;
  tamanoPagina = 5;
  totalPaginas = 0;
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
    this.usuarioService.obtenerHistorialTransacciones(this.usuarioId, this.paginaActual, this.tamanoPagina)
      .subscribe({
        next: (data) => {
          this.transacciones = data.content;
          this.totalPaginas = data.totalPages;
        },
        error: (error) => {
          console.error('Error al cargar transacciones', error);
        }
      });
  }

  paginaSiguiente(): void {
    this.paginaActual++;
    this.cargarTransacciones();
  }

  paginaAnterior(): void {
    this.paginaActual--;
    this.cargarTransacciones();
  }


  obtenerNombreFondo(fondoId: string): string {
    return this.fondoService.obtenerNombreFondoPorIdBackend(fondoId);
  }
}
