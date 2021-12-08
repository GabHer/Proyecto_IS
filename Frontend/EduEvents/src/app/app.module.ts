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
import {MatCardModule} from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule  } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { SubirArchivoComponent } from './components/subir-archivo/subir-archivo.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { NgwWowModule } from 'ngx-wow';
import { EventosComponent } from './components/eventos/eventos.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { SidenavComponent } from './components/dashboard/sidenav/sidenav.component';
import { HeaderDashboardComponent } from './components/dashboard/header-dashboard/header-dashboard.component';
import { MisEventosComponent } from './components/mis-eventos/mis-eventos.component'

import { BuscadorComponent } from './components/buscador/buscador.component';
import { InscripcionesComponent } from './components/inscripciones/inscripciones.component';
import { BuscarEventoComponent } from './components/buscar-evento/buscar-evento.component';
import { CardEventoComponent } from './components/card-evento/card-evento.component';
import { FormularioCrearEventoComponent } from './components/mis-eventos/formulario-crear-evento/formulario-crear-evento.component'

import { CardEventoOrganizadorComponent } from './components/card-evento-organizador/card-evento-organizador.component';
import { CrearConferenciaComponent } from './components/crear-conferencia/crear-conferencia.component';
import { FormularioRegistroUsuarioComponent } from './components/formulario-registro-usuario/formulario-registro-usuario.component';
import { DetallesEventoComponent } from './components/detalles-evento/detalles-evento.component';
import {MatTabsModule} from '@angular/material/tabs';
import { VistaConferenciaTalleresComponent } from './components/vista-conferencia-talleres/vista-conferencia-talleres.component';
import { CardConferenciaComponent } from './components/card-conferencia/card-conferencia.component';
import { ListaAsistenciaComponent } from './components/lista-asistencia/lista-asistencia.component';
import { CardConferenciaOrganizadorComponent } from './components/card-conferencia-organizador/card-conferencia-organizador.component';
import { CardConferecniaEncargadoComponent } from './components/card-conferecnia-encargado/card-conferecnia-encargado.component';
import { VistaParticipantesEncargadoComponent } from './components/vista-participantes-encargado/vista-participantes-encargado.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FirmaEncargadoComponent } from './components/firma-encargado/firma-encargado.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { BarChartComponent } from './components/estadisticas/bar-chart/bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from './components/estadisticas/pie-chart/pie-chart.component'

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
    FormularioCrearEventoComponent,
    CardEventoOrganizadorComponent,
    CrearConferenciaComponent,
    FormularioRegistroUsuarioComponent,
    DetallesEventoComponent,
    VistaConferenciaTalleresComponent,
    CardConferenciaComponent,
    ListaAsistenciaComponent,
    CardConferenciaOrganizadorComponent,
    CardConferecniaEncargadoComponent,
    VistaParticipantesEncargadoComponent,
    InicioComponent,
    FirmaEncargadoComponent,
    EstadisticasComponent,
    BarChartComponent,
    PieChartComponent,


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
    MatTooltipModule,
    MatRadioModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatListModule,
    NgxChartsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
