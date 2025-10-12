import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PreMatriculaRequest, PreMatriculaApiResponse, PreMatriculaListResponse } from '../../../core/models/pre-matricula.model';

@Injectable({
  providedIn: 'root'
})
export class PreMatriculaService {
  private apiUrl = `${environment.apiUrl}/pre-matricula`;

  constructor(private http: HttpClient) {}

  // Registrar una pre-matrícula
  registrarPreMatricula(preMatricula: PreMatriculaRequest): Observable<PreMatriculaApiResponse> {
    return this.http.post<PreMatriculaApiResponse>(`${this.apiUrl}/insertar`, preMatricula);
  }

  // Obtener todas las pre-matrículas
  obtenerPreMatriculas(): Observable<PreMatriculaListResponse> {
    return this.http.get<PreMatriculaListResponse>(`${this.apiUrl}/listar`);
  }

  // Obtener ciclos académicos (necesitarás este endpoint)
  obtenerCiclosAcademicos(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/ciclo-academico/listar`);
  }

  // Obtener asignaturas (necesitarás este endpoint)
  obtenerAsignaturas(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/asignatura/listar`);
  }
  // En pre-matricula.service.ts
obtenerPreMatriculaPorId(idPreMatricula: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/buscar/${idPreMatricula}`);
}

actualizarPreMatricula(idPreMatricula: number, datos: PreMatriculaRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/actualizar/${idPreMatricula}`, datos);
}

eliminarPreMatricula(idPreMatricula: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/eliminar/${idPreMatricula}`);
}

obtenerPreMatriculasPorCiclo(idCicloAcademico: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/listar/${idCicloAcademico}`);
}
}