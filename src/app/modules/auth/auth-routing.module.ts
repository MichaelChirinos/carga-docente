import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // redirección por defecto
  { path: 'login', component: LoginComponent }           // ruta para login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
