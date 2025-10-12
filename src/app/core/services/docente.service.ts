import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Categoria, CategoriaRequest, Dedicacion, DedicacionRequest, DocenteListResponse, DocenteRequest, DocentesAsignacionesResponse } from '../models/docente.model';
import { catchError, map } from 'rxjs/operators';
import { CicloAcademicoListResponse, DisponibilidadApiResponse, DisponibilidadListResponse, DisponibilidadRequest, DisponibilidadResponse } from '../models/disponibilidad';
import { AsignaturaListResponse, PreferenciaListResponse, PreferenciaMultipleRequest, PreferenciaMultipleResponse, PreferenciaRequest, PreferenciaResponse } from '../models/preferencia.model';
import { PlanEstudioResponse } from '../models/plan-estudio';

@Injectable({ providedIn: 'root' })
export class DocenteService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  registrarDocente(docenteData: DocenteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/docente/insertar`, docenteData);
  }
 

// Eliminar preferencia
eliminarPreferencia(idPreferencia: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/preferencia/eliminar/${idPreferencia}`);
}

// Obtener preferencias de un docente

  registrarDocentesMultiples(docentes: DocenteRequest[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/docente/insertar-all`, docentes);
}
// Para obtener todas las preferencias
obtenerTodasLasPreferencias(): Observable<any> {
  return this.http.get(`${this.apiUrl}/preferencia/listar`);
}
getPreferenciasDocente(idDocente: number, idCicloAcademico: number): Observable<PreferenciaListResponse> {
  return this.http.get<PreferenciaListResponse>(
    `${this.apiUrl}/preferencia/listar/${idDocente}/${idCicloAcademico}`
  );
  
}
  eliminarDisponibilidad(idDisponibilidad: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/disponibilidad/eliminar/${idDisponibilidad}`);
  }
// En docente.service.ts

eliminarDocente(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/docente/eliminar/${id}`);
}
// Registrar múltiples dedicaciones
registrarDedicacionesMultiples(dedicaciones: DedicacionRequest[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/dedicacion/insertar-all`, dedicaciones);
}
getPreferenciasDocentes(idCicloAcademico: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/docente/preferencias/${idCicloAcademico}`);
}
getCiclosAcademicos(): Observable<any> {
  return this.http.get(`${this.apiUrl}/ciclo-academico/listar`);
}
getDisponibilidadesDocentes(idCicloAcademico: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/docente/disponibilidades/${idCicloAcademico}`);
}
// Actualizar dedicación
actualizarDedicacion(idDedicacion: number, datos: DedicacionRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/dedicacion/actualizar/${idDedicacion}`, datos);
}

// Obtener dedicación por ID
getDedicacionById(idDedicacion: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/dedicacion/buscar/${idDedicacion}`);
}
// Eliminar dedicación
eliminarDedicacion(idDedicacion: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/dedicacion/eliminar/${idDedicacion}`);
}
// Agregar dedicación individual
addDedicacion(dedicacion: DedicacionRequest): Observable<any> {
  return this.http.post(`${this.apiUrl}/dedicacion/insertar`, dedicacion);
}
getDedicaciones(): Observable<any> {
  return this.http.get(`${this.apiUrl}/dedicacion/listar`);
}

registrarCategoriasMultiples(categorias: CategoriaRequest[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/categoria/insertar-all`, categorias);
}

// Actualizar categoría individual
actualizarCategoria(idCategoria: number, datos: CategoriaRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/categoria/actualizar/${idCategoria}`, datos);
}

// Obtener categoría por ID (si no lo tienes)
getCategoriaById(idCategoria: number): Observable<Categoria> {
  return this.http.get<Categoria>(`${this.apiUrl}/categoria/buscar/${idCategoria}`);
}

// Agregar categoría individual (si no lo tienes)
addCategoria(categoria: CategoriaRequest): Observable<any> {
  return this.http.post(`${this.apiUrl}/categoria/insertar`, categoria);
}

 getCategorias(): Observable<Categoria[]> {
  return this.http.get<{ data: Categoria[] }>(`${this.apiUrl}/categoria/listar`).pipe(
    map(response => response.data)
  );
}
getDocenteById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/docente/buscar/${id}`);
}

actualizarDocente(id: number, docenteData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/docente/actualizar/${id}`, docenteData);
}


obtenerAsignaturas(): Observable<AsignaturaListResponse> {
  return this.http.get<AsignaturaListResponse>(`${this.apiUrl}/asignatura/listar`);
}

actualizarDisponibilidad(id: number, disponibilidad: DisponibilidadRequest): Observable<DisponibilidadApiResponse> {
  return this.http.put<DisponibilidadApiResponse>(
    `${this.apiUrl}/disponibilidad/actualizar/${id}`,
    disponibilidad
  );
}

getDisponibilidades(idDocente: number, idCicloAcademico: number): Observable<DisponibilidadListResponse> {
  return this.http.get<DisponibilidadListResponse>(
    `${this.apiUrl}/disponibilidad/listar/${idDocente}/${idCicloAcademico}`
  );
}

registrarPreferencia(preferencia: PreferenciaRequest): Observable<any> {
  return this.http.post(`${this.apiUrl}/preferencia/insertar`, preferencia);
}
actualizarPreferencia(idPreferencia: number, data: PreferenciaRequest): Observable<PreferenciaResponse> {
  return this.http.put<PreferenciaResponse>(
    `${this.apiUrl}/preferencia/actualizar/${idPreferencia}`,
    data
  );
}
getPreferenciaById(id: number): Observable<any> { // Usamos any temporalmente
  return this.http.get<any>(
    `${this.apiUrl}/preferencia/buscar/${id}`
  );
}
getDisponibilidadById(id: number): Observable<DisponibilidadApiResponse> {
  return this.http.get<DisponibilidadApiResponse>(`${this.apiUrl}/disponibilidad/buscar/${id}`);
}

registrarDisponibilidad(disponibilidad: DisponibilidadRequest): Observable<DisponibilidadApiResponse> {
  return this.http.post<DisponibilidadApiResponse>(
    `${this.apiUrl}/disponibilidad/insertar`,
    disponibilidad
  );
}

    registrarDisponibilidadesMultiples(disponibilidades: DisponibilidadRequest[]): Observable<DisponibilidadResponse> {
    return this.http.post<DisponibilidadResponse>(
      `${this.apiUrl}/disponibilidad/insertar-all`,
      disponibilidades
    );
  }

  obtenerPlanesEstudio(): Observable<PlanEstudioResponse> {
    return this.http.get<PlanEstudioResponse>(`${this.apiUrl}/plan-de-estudio/listar`);
  }
  obtenerCargasElectivas(idPlan: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/carga-electiva/listar?plan=${idPlan}`);
  }
obtenerCiclosAcademicos(): Observable<CicloAcademicoListResponse> {
  return this.http.get<CicloAcademicoListResponse>(`${this.apiUrl}/ciclo-academico/listar`);
}
registrarPreferenciasMultiples(preferenciasData: PreferenciaMultipleRequest): Observable<PreferenciaMultipleResponse> {
  return this.http.post<PreferenciaMultipleResponse>(
    `${this.apiUrl}/preferencia/insertar-all`,
    preferenciasData.preferencias // Enviamos directamente el array
  );
}

  getDocenteByUsuario(idUsuario: number): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/docente/usuario/buscar/${idUsuario}`
  ).pipe(
    map(response => response.data)
  );
}

ejecutarAlgoritmoAsignacion(idCicloAcademico: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/asignacion/algoritmo/${idCicloAcademico}`,
    null 
  );
}
getDocentesConAsignaciones(idCargaElectiva: number): Observable<DocentesAsignacionesResponse> {
  return this.http.get<DocentesAsignacionesResponse>(
    `${this.apiUrl}/docente/asignaciones/${idCargaElectiva}`
  );
}
getDocentes(): Observable<DocenteListResponse> {
  return this.http.get<DocenteListResponse>(`${this.apiUrl}/docente/listar`);
};

}