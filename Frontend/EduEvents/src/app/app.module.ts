import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { HeaderComponent } from './components/landing/header/header.component';
import { FooterComponent } from './components/landing/footer/footer.component';
import { BodyComponent } from './components/landing/body/body.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from '@angular/material/expansion';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { SubirArchivoComponent } from './components/subir-archivo/subir-archivo.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import {MatCardModule} from '@angular/material/card';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { NgwWowModule } from 'ngx-wow';
import { EventosComponent } from './components/eventos/eventos.component';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { NgxSpinnerModule } from "ngx-spinner";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { SidenavComponent } from './components/dashboard/sidenav/sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderDashboardComponent } from './components/dashboard/header-dashboard/header-dashboard.component';
import { MisEventosComponent } from './components/mis-eventos/mis-eventos.component'
import { MatDatepickerModule  } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BuscadorComponent } from './components/buscador/buscador.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { InscripcionesComponent } from './components/inscripciones/inscripciones.component';
import { BuscarEventoComponent } from './components/buscar-evento/buscar-evento.component';
import { CardEventoComponent } from './components/card-evento/card-evento.component'
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    RegistroUsuarioComponent,
    SubirArchivoComponent,
    InicioSesionComponent,
    AcercaDeComponent,
    EventosComponent,
    DashboardComponent,
    PerfilUsuarioComponent,
    SidenavComponent,
    HeaderDashboardComponent,
    MisEventosComponent,
    BuscadorComponent,
    InscripcionesComponent,
    BuscarEventoComponent,
    CardEventoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    NgwWowModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatSidenavModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule


  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
