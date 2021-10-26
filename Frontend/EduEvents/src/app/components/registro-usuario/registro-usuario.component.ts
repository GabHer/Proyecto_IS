import { Component, OnInit } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import {FormControl, Validators} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})
export class RegistroUsuarioComponent implements OnInit {

  public archivos: any = [];
  public previsualizacion: "";
  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Este es un campo obligatorio';
    }

    return this.email.hasError('email') ? 'Correo no valido' : '';
  }
  constructor( private sanitizer: DomSanitizer ) { }

  ngOnInit(): void {
  }

  capturarFile(event:any):any{
    const archivoCapturado = event.target.files[0];
    this.extraerBase64(archivoCapturado).then( (imagen:any)  => {
      this.previsualizacion = imagen.base;
      console.log(imagen);
    })
    this.archivos.push(archivoCapturado);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({

          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          blob: $event,
          image,
          base: null
        });
      };

    } catch (e) {
      return null;
    }
  })


}
