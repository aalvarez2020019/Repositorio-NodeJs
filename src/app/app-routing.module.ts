import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DashboardComponent} from './components/dashboard/dashboard.component';
import { SucursalesComponent } from './components/sucursales/sucursales.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'registrar', component: RegistrarComponent},
  { path: 'inicio', component: InicioComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'sucursales', component: SucursalesComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
