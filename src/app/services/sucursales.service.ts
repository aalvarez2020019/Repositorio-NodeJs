import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {
  public url: String = 'http://localhost:3000/api';
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');


  constructor(public _http: HttpClient) { }

  obtenerSucursales(): Observable<any>{

    return this._http.get(this.url + '/obtenerSucursales', { headers: this.headersVariable })
  }
}
