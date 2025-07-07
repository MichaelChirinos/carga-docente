import { Provider } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export function provideHttpInterceptor(interceptor: any): Provider[] {
  return [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: interceptor,
      multi: true
    }
  ];
}