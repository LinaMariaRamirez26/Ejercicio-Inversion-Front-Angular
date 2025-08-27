import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Fondo } from '../../models/fondo.model';
import { FondoService } from '../../services/fondo.service';

@Component({
  selector: 'app-fondo-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fondo-list.component.html',
  styles: []
})
export class FondoListComponent implements OnInit {
  fondos: Fondo[] = [];
  cargando: boolean = true;
  error: string | null = null;

  constructor(private fondoService: FondoService) { }

  ngOnInit(): void {
    this.fondoService.obtenerFondos().subscribe({
      next: (data) => {
        this.fondos = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener fondos:', error);
        this.error = 'No se pudieron cargar los fondos. Verifica que el backend esté ejecutándose.';
        this.cargando = false;
      }
    });
  }
}