import { Component } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-ciclos-academicos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-ciclos-academicos.component.html'
})
export class ListarCiclosAcademicosComponent {
  ciclos: any[] = [];
  loading = true;
  error = '';

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCiclos();
  }

  cargarCiclos(): void {
    this.loading = true;
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        this.ciclos = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar ciclos académicos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editarCiclo(id: number): void {
    this.router.navigate(['/director/editar-ciclo-academico', id]);
  }

  // Añade este método para formatear fechas
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
}