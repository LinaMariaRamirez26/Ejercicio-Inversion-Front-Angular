import { Routes } from '@angular/router';
import { FondoListComponent } from './components/fondo/fondo-list.component';
import { SuscribirFondoComponent } from './components/fondo/suscribir-fondo.component';
import { UsuarioDetailComponent } from './components/usuario/usuario-detail.component';
import { TransaccionListComponent } from './components/transaccion/transaccion-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/fondos', pathMatch: 'full' },
  { path: 'fondos', component: FondoListComponent },
  { path: 'suscribir/:id', component: SuscribirFondoComponent },
  { path: 'usuario/:id', component: UsuarioDetailComponent },
  { path: 'usuario/:id/transacciones', component: TransaccionListComponent },
  { path: '**', redirectTo: '/fondos' }
];
