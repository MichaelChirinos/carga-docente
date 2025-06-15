import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms'; // 👈 AÑADE ESTA LÍNEA

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule // 👈 AÑADE ESTA LÍNEA TAMBIÉN
  ]
})
export class AuthModule {}
