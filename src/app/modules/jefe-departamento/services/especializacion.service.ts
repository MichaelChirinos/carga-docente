import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EspecializacionRequest, EspecializacionApiResponse, EspecializacionListResponse } from '../../../core/models/especializacion.model';
import { DocenteListResponse } from '../../../core/models/docente.model';

@Injectable({
  providedIn: 'root'
})
export class EspecializacionService {
  private apiUrl = `${environment.apiUrl}/especializacion`;

  constructor(private http: HttpClient) {}

  // Registrar una especialización
  registrarEspecializacion(especializacion: EspecializacionRequest): Observable<EspecializacionApiResponse> {
    return this.http.post<EspecializacionApiResponse>(`${this.apiUrl}/insertar`, especializacion);
  }

  // Obtener todas las especializaciones
  obtenerEspecializaciones(): Observable<EspecializacionListResponse> {
    return this.http.get<EspecializacionListResponse>(`${environment.apiUrl}/docente/listar-con-especializaciones`);
  }

  // Obtener docentes - usando tu modelo existente
  obtenerDocentes(): Observable<DocenteListResponse> {
    return this.http.get<DocenteListResponse>(`${environment.apiUrl}/docente/listar`);
  }

  // Obtener asignaturas
  obtenerAsignaturas(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/asignatura/listar`);
  }
obtenerEspecializacionesPorDocente(idDocente: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/listar-por-docente/${idDocente}`);
}
// Obtener especialización por ID
obtenerEspecializacionPorId(idEspecializacion: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/buscar/${idEspecializacion}`);
}

// Actualizar especialización
actualizarEspecializacion(idEspecializacion: number, datos: EspecializacionRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/actualizar/${idEspecializacion}`, datos);
}

// Eliminar especialización
eliminarEspecializacion(idEspecializacion: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/eliminar/${idEspecializacion}`);
}

}