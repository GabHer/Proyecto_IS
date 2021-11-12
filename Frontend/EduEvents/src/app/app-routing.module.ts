import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { LandingComponent } from './components/landing/landing.component';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'registrate', component: RegistroUsuarioComponent },
  { path: 'inicioSesion', component: InicioSesionComponent },
  { path: 'acercaDe', component: AcercaDeComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
