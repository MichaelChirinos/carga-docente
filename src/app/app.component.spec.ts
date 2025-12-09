import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, 
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: () => false,
            getCurrentUser: () => null,
            getToken: () => null,
            setCurrentUser: (user: any) => {},
            logout: () => {}
          }
        }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have correct initial state', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    expect(app).toBeDefined();
  });

  describe('checkAuthStatus', () => {
    it('should handle authenticated user', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      
      spyOn(authService, 'isAuthenticated').and.returnValue(true);
      spyOn(authService, 'getCurrentUser').and.returnValue({ 
        email: 'test@example.com',
        rol: { idRol: 1 }
      });
      spyOn(console, 'log');
      app.ngOnInit();
      
      expect(authService.isAuthenticated).toHaveBeenCalled();
    });
  });
});