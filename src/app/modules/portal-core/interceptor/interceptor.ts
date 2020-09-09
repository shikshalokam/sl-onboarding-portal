import { Injectable } from '@angular/core';

import {
    HttpRequest, HttpHandler, HttpEvent,
    HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { KeycloakService } from 'keycloak-angular';




@Injectable()
export class Interceptor implements HttpInterceptor {
    token;
    constructor(private router: Router,
        public dialog: MatDialog,
        private Keycloak: KeycloakService
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(this.Keycloak.getKeycloakInstance())
        this.token = this.Keycloak.getKeycloakInstance().token;

        if (this.token) {
            request = request.clone({
                setHeaders: {
                    'x-auth-token': this.token,
                    'x-authenticated-user-token': this.token,
                    'Authorization': 'Bearer' + this.token
                }
            });
        }

        request = request.clone({
            headers: request.headers.set('Accept', 'application/json')
        });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    if (error.error.success === false) {
                        // this.openDialog();
                    } else {
                        this.Keycloak.logout();
                    }
                }
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                return throwError(error);
            }));
    }

}
