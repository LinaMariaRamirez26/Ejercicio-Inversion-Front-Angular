import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { FondoService } from '../../services/fondo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './usuario-detail.component.html',
  styles: []
})
export class UsuarioDetailComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private fondoService: FondoService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id']; // Convertir a número
      this.cargarUsuario(id);
    });
  }

  cargarUsuario(id: number): void {
    this.usuarioService.getUsuario(id.toString()).subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (error) => {
        console.error('Error al cargar el usuario', error);
        alert('Error al cargar la información del usuario');
      }
    });
  }

  // Método para obtener el nombre del fondo por su ID del backend
  obtenerNombreFondo(fondoId: string): string {
    return this.fondoService.obtenerNombreFondoPorIdBackend(fondoId);
  }

  cancelarSuscripcion(fondoId: string): void {
    if (!this.usuario) return;

    const nombreFondo = this.obtenerNombreFondo(fondoId);
    if (confirm(`¿Está seguro que desea cancelar el fondo ${nombreFondo}?`)) {
      this.usuarioService.cancelarSuscripcion(this.usuario.id.toString(), fondoId).subscribe({
        next: (response) => {
          // Actualizar la lista de fondos suscritos
          this.usuario!.fondosSuscritos = this.usuario!.fondosSuscritos.filter(id => id !== fondoId);
          alert('Fondo cancelado exitosamente');
        },
        error: (error) => {
          console.error('Error al cancelar fondo:', error);
          let mensajeError = error.error?.message || 'Error al cancelar el fondo. Intente nuevamente.';

          // Si el mensaje contiene un ID numérico de fondo, reemplazarlo con el nombre
          const regex = /fondo (\d+)/i;
          const match = mensajeError.match(regex);
          if (match) {
            const idBackend = match[1];
            const nombreFondo = this.fondoService.obtenerNombreFondoPorIdBackend(idBackend);
            mensajeError = mensajeError.replace(regex, `fondo ${nombreFondo}`);
          }

          alert(mensajeError);
        }
      });
    }
  }


}
