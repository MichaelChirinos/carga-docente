import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private isBrowser: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.authService.ensureUserLoaded();
      
      if (this.authService.isAuthenticated()) {
        const user = this.authService.getCurrentUser();
        
        if ((window.location.pathname === '/' || window.location.pathname === '/login') && user?.rol?.idRol) {
          this.redirectByRole(user);
        }
      }
    }
  }

  private redirectByRole(user: any): void {
    if (!user?.rol?.idRol) return;
    
    const rolePath = this.authService.getRolePath(user.rol.idRol);
    
    setTimeout(() => {
      this.router.navigate([rolePath]);
    }, 100);
  }
}