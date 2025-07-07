import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { from, Observable } from 'rxjs';
import { DirectorRequest, DirectorResponse } from '../../../core/models/director'; // Usando tus interfaces
import { FacultadRequest, FacultadResponse } from '../../../core/models/facultad'; // Asegúrate de tener estas interfaces
import { EscuelaRequest, EscuelaResponse } from '../../../core/models/escuela';
import { PlanEstudioRequest, PlanEstudioResponse } from '../../../core/models/plan-estudio';
import { CicloAcademicoRequest, CicloAcademicoResponse } from '../../../core/models/ciclo-academico';
import { AsignaturaRequest, AsignaturaResponse } from '../../../core/models/asignatura';
import { CursoIndividualRequest, CursoRequest, CursoResponse } from '../../../core/models/curso';
import { Categoria } from '../../../core/models/docente.model';
@Injectable({ providedIn: 'root' })
export class DirectorService {
  private apiUrl = `${environment.apiUrl}`; // Ej: http://localhost:8080/director

  constructor(private http: HttpClient) {}

  registrarDirector(directorData: DirectorRequest): Observable<DirectorResponse> {
    return this.http.post<DirectorResponse>(
      `${this.apiUrl}/director/insertar`, 
      directorData
    );
  }
   crearFacultad(facultadData: FacultadRequest): Observable<FacultadResponse> {
    return this.http.post<FacultadResponse>(
      `${this.apiUrl}/facultad/insertar`, 
      facultadData
    );
  }
    obtenerFacultades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/facultad/listar`);
  }
  registrarEscuela(escuelaData: EscuelaRequest): Observable<EscuelaResponse> {
    return this.http.post<EscuelaResponse>(
      `${this.apiUrl}/escuela/insertar`, 
      escuelaData
    );
  }
   registrarPlanEstudio(planData: PlanEstudioRequest): Observable<PlanEstudioResponse> {
    return this.http.post<PlanEstudioResponse>(
      `${this.apiUrl}/plan_de_estudio/insertar`, 
      planData
    );
  }
  registrarPlanesMultiples(planesData: PlanEstudioRequest[]): Observable<PlanEstudioResponse> {
  return this.http.post<PlanEstudioResponse>(
    `${this.apiUrl}/plan_de_estudio/insertar-all`, 
    planesData
  );
}
registrarEscuelasMultiples(escuelasData: EscuelaRequest[]): Observable<EscuelaResponse> {
  return this.http.post<EscuelaResponse>(
    `${this.apiUrl}/escuela/insertar-all`, 
    escuelasData
  );
}
  registrarCicloAcademico(cicloData: CicloAcademicoRequest): Observable<CicloAcademicoResponse> {
    return this.http.post<CicloAcademicoResponse>(
      `${this.apiUrl}/ciclo_academico/insertar`, 
      cicloData
    );
  }
   registrarAsignatura(asignaturaData: AsignaturaRequest): Observable<AsignaturaResponse> {
    return this.http.post<AsignaturaResponse>(
      `${this.apiUrl}/asignatura/insertar`, 
      asignaturaData
    );
  }
   registrarAsignaturas(asignaturasData: AsignaturaRequest[]): Observable<AsignaturaResponse> {
    return this.http.post<AsignaturaResponse>(
      `${this.apiUrl}/asignatura/insertar-all`, 
      asignaturasData
    );
  }

   obtenerAsignaturas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/asignatura/listar`);
  }
obtenerPlanesEstudio(): Observable<{status: number, message: string, data: any[]}> {
  return this.http.get<{status: number, message: string, data: any[]}>(
    `${this.apiUrl}/plan_de_estudio/listar`
  );
}
obtenerCicloAcademicoById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/ciclo_academico/buscar/${id}`);
}

actualizarCicloAcademico(id: number, data: CicloAcademicoRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/ciclo_academico/actualizar/${id}`, data);
}
obtenerAsignaturaById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/asignatura/buscar/${id}`);
}

actualizarAsignatura(id: number, data: AsignaturaRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/asignatura/actualizar/${id}`, data);
}
  getCategoriaById(id: number): Observable<Categoria> {
  return this.http.get<Categoria>(`${this.apiUrl}/categoria/buscar/${id}`);
}

actualizarCategoria(id: number, categoriaData: Partial<Categoria>): Observable<Categoria> {
  return this.http.put<Categoria>(`${this.apiUrl}/categoria/actualizar/${id}`, categoriaData);
}
obtenerCursos(): Observable<any> {
  return this.http.get(`${this.apiUrl}/curso/listar`);
}

obtenerCursosPorCiclo(idCiclo: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/curso/listar/${idCiclo}`);
}

obtenerCursoById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/curso/buscar/${id}`);
}


  obtenerEscuelas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/escuela/listar`);
  }

  obtenerCiclosAcademicos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ciclo_academico/listar`);
  }
  listarDirectores(): Observable<{status: number, message: string, data: DirectorResponse[]}> {
    return this.http.get<{status: number, message: string, data: DirectorResponse[]}>(`${this.apiUrl}/director/listar`);
  }

  obtenerDirectorPorId(id: number): Observable<DirectorResponse> {
    return this.http.get<DirectorResponse>(`${this.apiUrl}/director/buscar/${id}`);
  }

  actualizarDirector(id: number, directorData: DirectorRequest): Observable<DirectorResponse> {
    return this.http.put<DirectorResponse>(`${this.apiUrl}/director/actualizar/${id}`, directorData);
  }
obtenerFacultadById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/facultad/buscar/${id}`);
}

actualizarFacultad(id: number, data: FacultadRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/facultad/actualizar/${id}`, data);
}
obtenerEscuelaById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/escuela/buscar/${id}`);
}

actualizarEscuela(id: number, data: EscuelaRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/escuela/actualizar/${id}`, data);
}
registrarCurso(cursoData: CursoIndividualRequest): Observable<CursoResponse> {
  return this.http.post<CursoResponse>(
    `${this.apiUrl}/curso/insertar`, 
    cursoData
  );
}

registrarCursosMultiples(cursosData: CursoRequest[]): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/curso/insertar-all`, 
    cursosData
  );
}
// En el DirectorService
actualizarCurso(id: number, data: CursoIndividualRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/curso/actualizar/${id}`, data);
}
}