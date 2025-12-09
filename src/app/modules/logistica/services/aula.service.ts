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

  registrarAula(aula: AulaRequest): Observable<AulaApiResponse> {
    return this.http.post<AulaApiResponse>(`${this.apiUrl}/insertar`, aula);
  }

  obtenerAulas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/listar`);
  }
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