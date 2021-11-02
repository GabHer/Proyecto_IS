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
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
