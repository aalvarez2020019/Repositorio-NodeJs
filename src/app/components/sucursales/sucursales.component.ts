import { Component, OnInit } from '@angular/core';
import { Sucursal } from 'src/app/models/sucursales.model';
import { SucursalesService } from 'src/app/services/sucursales.service';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss'],
  providers: [ SucursalesService ]
})
export class SucursalesComponent implements OnInit {

  public sucursalModelGet: Sucursal;

  constructor(private _sucursalesService: SucursalesService) {

   }

  ngOnInit(): void {
    this.getSucursales();
  }

  getSucursales(){
    this._sucursalesService.obtenerSucursales().subscribe(
      (response)=>{
        this.sucursalModelGet = response.sucursales;
        console.log(this.sucursalModelGet);
      },
      (error)=>{
        console.log(<any>error);
      }
    )
  }



}
