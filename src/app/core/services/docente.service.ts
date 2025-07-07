import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Categoria, CategoriaRequest, Dedicacion, DocenteListResponse, DocenteRequest, DocentesAsignacionesResponse } from '../models/docente.model';
import { catchError, map } from 'rxjs/operators';
import { DisponibilidadRequest, DisponibilidadResponse, PlanEstudioListResponse } from '../models/disponibilidad';
import { AsignaturaListResponse, CargaElectivaListResponse, Preferencia, PreferenciaListResponse, PreferenciaMultipleRequest, PreferenciaMultipleResponse, PreferenciaRequest, PreferenciaResponse, SinglePreferenciaResponse } from '../models/preferencia.model';

@Injectable({ providedIn: 'root' })
export class DocenteService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  registrarDocente(docenteData: DocenteRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/docente/insertar`, docenteData);
  }
  registrarDocentesMultiples(docentes: DocenteRequest[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/docente/insertar-all`, docentes);
}

getDedicaciones(): Observable<Dedicacion[]> {
  return this.http.get<{ data: Dedicacion[] }>(`${this.apiUrl}/dedicacion/listar`).pipe(
    map(response => response.data)
  );
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
getPreferenciasDocente(idDocente: number, idCargaElectiva: number): Observable<Preferencia[]> {
  return this.http.get<PreferenciaListResponse>(
    `${this.apiUrl}/preferencia/listar/${idDocente}/${idCargaElectiva}`
  ).pipe(
    map(response => response.data) // Extrae directamente el array de preferencias
  );
}
  addDedicacion(dedicacion: Omit<Dedicacion, 'idDedicacion'>): Observable<Dedicacion> {
    return this.http.post<Dedicacion>(`${this.apiUrl}/dedicacion/insertar`, dedicacion);
  }
  registrarDedicacionesMultiples(dedicacionesData: Omit<Dedicacion, 'idDedicacion' | 'enabled'>[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/dedicacion/insertar-all`, dedicacionesData);
}

 // docente.service.ts
addCategoria(categoria: Omit<Categoria, 'idCategoria'>): Observable<Categoria> {
  return this.http.post<Categoria>(
    `${this.apiUrl}/categoria/insertar`,
    categoria
  );
}
registrarCategoriasMultiples(categorias: CategoriaRequest[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/categoria/insertar-all`, categorias);
}
getCategoriaById(id: number): Observable<Categoria> {
  return this.http.get<{status: number, message: string, data: Categoria}>(
    `${this.apiUrl}/categoria/buscar/${id}`
  ).pipe(
    map(response => response.data), // Extraemos directamente el objeto data
    catchError(error => {
      console.error('Error al obtener categoría:', error);
      return throwError(() => new Error('No se pudo cargar la categoría'));
    })
  );
}
getDedicacionById(id: number): Observable<Dedicacion> {
  return this.http.get<{status: number, message: string, data: Dedicacion}>(
    `${this.apiUrl}/dedicacion/buscar/${id}`
  ).pipe(
    map(response => response.data),
    catchError(error => {
      console.error('Error al obtener dedicación:', error);
      return throwError(() => new Error('No se pudo cargar la dedicación'));
    })
  );
}

actualizarDedicacion(id: number, dedicacionData: Partial<Dedicacion>): Observable<Dedicacion> {
  return this.http.put<{status: number, message: string, data: Dedicacion}>(
    `${this.apiUrl}/dedicacion/actualizar/${id}`, 
    dedicacionData
  ).pipe(
    map(response => response.data) // Extraemos directamente el objeto data
  );
}

actualizarCategoria(id: number, categoriaData: Partial<Categoria>): Observable<Categoria> {
  return this.http.put<{status: number, message: string, data: Categoria}>(
    `${this.apiUrl}/categoria/actualizar/${id}`, 
    categoriaData
  ).pipe(
    map(response => response.data) // Extraemos directamente el objeto data
  );
}
getDisponibilidades(idDocente: number, idCargaElectiva: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/disponibilidad/listar/${idDocente}/${idCargaElectiva}`);
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
getDisponibilidadById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/disponibilidad/buscar/${id}`);
}

registrarDisponibilidad(disponibilidadData: DisponibilidadRequest): Observable<DisponibilidadResponse> {
    return this.http.post<DisponibilidadResponse>(
      `${this.apiUrl}/disponibilidad/insertar`, 
      disponibilidadData
    );
  }
    registrarDisponibilidadesMultiples(disponibilidades: DisponibilidadRequest[]): Observable<DisponibilidadResponse> {
    return this.http.post<DisponibilidadResponse>(
      `${this.apiUrl}/disponibilidad/insertar-all`,
      disponibilidades
    );
  }

  obtenerPlanesEstudio(): Observable<PlanEstudioListResponse> {
    return this.http.get<PlanEstudioListResponse>(`${this.apiUrl}/plan_de_estudio/listar`);
  }
obtenerAsignaturas(): Observable<AsignaturaListResponse> {
    return this.http.get<AsignaturaListResponse>(`${this.apiUrl}/asignatura/listar`);
  }

  obtenerCargasElectivas(idPlan: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/carga_electiva/listar?plan=${idPlan}`);
  }
  obtenerTodasCargasElectivas(): Observable<CargaElectivaListResponse> {
  return this.http.get<CargaElectivaListResponse>(`${this.apiUrl}/carga_electiva/listar`);
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
   registrarPreferencia(preferenciaData: PreferenciaRequest): Observable<PreferenciaResponse> {
    return this.http.post<PreferenciaResponse>(`${this.apiUrl}/preferencia/insertar`, preferenciaData);
  }
  actualizarDisponibilidad(id: number, data: DisponibilidadRequest): Observable<DisponibilidadResponse> {
  return this.http.put<DisponibilidadResponse>(
    `${this.apiUrl}/disponibilidad/actualizar/${id}`, 
    data
  );
}
ejecutarAlgoritmoAsignacion(idCargaElectiva: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/asignacion/algoritmo/${idCargaElectiva}`,
    null // No enviamos body
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