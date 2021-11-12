import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from './autenticacion.service';
@Injectable({
  providedIn: 'root'
})
export class AutenticacionGuard implements CanActivate {

  constructor( private router:Router, private auth:AutenticacionService ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if( this.auth.leerToken() ) {
        return true;
      }else {
        this.auth.cerrarSesion();
        this.router.navigate(["inicioSesion"])
        return false;
      }

  }

}
