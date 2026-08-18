import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AUTH_TOKEN_KEY } from '../constants/datasets';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Token ${token}` }
      });
    }
    return next.handle(req);
  }
}
