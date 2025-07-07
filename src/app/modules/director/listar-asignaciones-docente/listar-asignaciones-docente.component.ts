import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { DocentesAsignacionesResponse, DocenteAsignaciones } from '../../../core/models/docente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-asignaciones-docente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-asignaciones-docente.component.html',
  styleUrls: ['./listar-asignaciones-docente.component.scss']
})
export class ListarAsignacionesDocenteComponent implements OnInit {
    @ViewChild('pdfContent') pdfContent!: ElementRef;

  docentesConAsignaciones: DocenteAsignaciones[] = [];
  loading = true;
  error = false;
  idCargaElectiva = 1; // Puedes obtener esto de la ruta o un servicio

  constructor(private docenteService: DocenteService ) { 
    
  }

  ngOnInit(): void {
    this.getDocentesConAsignaciones(this.idCargaElectiva);
  }


  getDocentesConAsignaciones(idCargaElectiva: number): void {
    this.loading = true;
    this.error = false;
    
    this.docenteService.getDocentesConAsignaciones(idCargaElectiva).subscribe({
      next: (response) => {
        this.docentesConAsignaciones = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener docentes con asignaciones:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}