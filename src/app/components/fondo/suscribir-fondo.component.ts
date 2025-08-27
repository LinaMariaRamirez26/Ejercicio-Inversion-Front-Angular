import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FondoService } from '../../services/fondo.service';
import { UsuarioService } from '../../services/usuario.service';
import { Fondo } from '../../models/fondo.model';

@Component({
  selector: 'app-suscribir-fondo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './suscribir-fondo.component.html',
  styles: []
})
export class SuscribirFondoComponent implements OnInit {
  fondoId: string = '';
  fondo: Fondo | null = null;
  monto: number = 50000;
  mensaje: string = '';
  error: boolean = false;
  
  // Preferencias de notificación
  preferenciaNotificacion: string = 'Email'; // 'Email' o 'SMS'
  mensajeNotificacion: string = '';
  
  // ID fijo del usuario único
  private readonly USUARIO_ID = '1';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fondoService: FondoService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.fondoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.fondoId) {
      this.fondoService.obtenerFondo(this.fondoId).subscribe(
        (data) => {
          this.fondo = data;
          this.generarMensajeNotificacion();
        },
        (error) => {
          console.error('Error al obtener fondo:', error);
          this.mensaje = 'Error al cargar la información del fondo.';
          this.error = true;
        }
      );
    }
  }

  onPreferenciaChange(): void {
    this.generarMensajeNotificacion();
  }

  generarMensajeNotificacion(): void {
    if (!this.fondo) return;
    
    const nombreUsuario = 'Usuario'; // En un caso real, obtendríamos esto del servicio
    const nombreFondo = this.fondo.nombre;
    
    if (this.preferenciaNotificacion === 'Email') {
      this.mensajeNotificacion = `Hola ${nombreUsuario}, te has suscrito al fondo ${nombreFondo} con un monto de ${this.monto} COP.`;
    } else if (this.preferenciaNotificacion === 'SMS') {
      this.mensajeNotificacion = `Hola ${nombreUsuario}, te suscribiste al fondo ${nombreFondo} con ${this.monto} COP.`;
    }
  }

  suscribir(): void {
    if (!this.monto || !this.fondoId) {
      this.mensaje = 'Por favor complete el monto de inversión.';
      this.error = true;
      return;
    }

    // Actualizar el mensaje de notificación con el monto actual
    this.generarMensajeNotificacion();

    // Primero actualizar las preferencias de notificación
    const emailPref = this.preferenciaNotificacion === 'Email';
    const smsPref = this.preferenciaNotificacion === 'SMS';
    
    this.usuarioService.actualizarPreferenciasNotificacion(this.USUARIO_ID, emailPref, smsPref).subscribe({
      next: () => {
        // Luego proceder con la suscripción
        this.usuarioService.suscribirAFondo(this.USUARIO_ID, this.fondoId, this.monto).subscribe({
          next: (response) => {
            this.mensaje = `Suscripción exitosa al fondo. ${this.mensajeNotificacion}`;
            this.error = false;
            setTimeout(() => {
              this.router.navigate(['/usuario', this.USUARIO_ID]);
            }, 3000);
          },
          error: (error) => {
            this.manejarErrorSuscripcion(error);
          }
        });
      },
      error: (error) => {
        console.error('Error al actualizar preferencias:', error);
        // Continuar con la suscripción aunque falle la actualización de preferencias
         this.usuarioService.suscribirAFondo(this.USUARIO_ID, this.fondoId, this.monto).subscribe({
           next: (response) => {
             this.mensaje = `Suscripción exitosa al fondo. ${this.mensajeNotificacion}`;
             this.error = false;
             setTimeout(() => {
               this.router.navigate(['/usuario', this.USUARIO_ID]);
             }, 3000);
           },
           error: (error) => {
             this.manejarErrorSuscripcion(error);
           }
         });
       }
     });
   }

   manejarErrorSuscripcion(error: any): void {
     console.error('Error al suscribir:', error);
     
     // Verificar si es un error de saldo insuficiente
     if (error.status === 400 && error.error?.message?.includes('saldo')) {
       const nombreFondo = this.fondo?.nombre || 'el fondo seleccionado';
       this.mensaje = `No tiene saldo disponible para vincularse al fondo ${nombreFondo}`;
     } else {
       let mensajeError = error.error?.message || 'Error al procesar la suscripción. Verifique los datos e intente nuevamente.';
       
       // Si el mensaje contiene un ID numérico de fondo, reemplazarlo con el nombre
       const regex = /fondo (\d+)/i;
       const match = mensajeError.match(regex);
       if (match) {
         const idBackend = match[1];
         const nombreFondo = this.fondoService.obtenerNombreFondoPorIdBackend(idBackend);
         mensajeError = mensajeError.replace(regex, `fondo ${nombreFondo}`);
       }
       
       this.mensaje = mensajeError;
     }
     this.error = true;
   }
 }