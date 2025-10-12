import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AulaRequest, AulaApiResponse } from '../../../core/models/aula.model';

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  private apiUrl = `${environment.apiUrl}/aula`;

  constructor(private http: HttpClient) {}

  // Registrar un aula individual - VERSIÓN OPTIMIZADA
  registrarAula(aula: AulaRequest): Observable<AulaApiResponse> {
    // El backend ya maneja la lógica de numeroEquipos, así que enviamos el objeto directamente
    return this.http.post<AulaApiResponse>(`${this.apiUrl}/insertar`, aula);
  }

  // Obtener todas las aulas
  obtenerAulas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar`);
  }
  // En aula.service.ts
obtenerAulaPorId(idAula: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/buscar/${idAula}`);
}

actualizarAula(idAula: number, datos: AulaRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/actualizar/${idAula}`, datos);
}

eliminarAula(idAula: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/eliminar/${idAula}`);
}
}