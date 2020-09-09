import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class OnboardService {
    constructor(
       public http: HttpClient
    ) {

    }
    public getProfileData() {
        return this.http.get(environment.apiUrl+'/kendra/api/v1/user-extension/getProfile');
    }

    public getState() {
        return this.http.get(environment.apiUrl+'/kendra/api/v1/entities/listByEntityType/state');
    }
    public getRole(data){
        return this.http.get(environment.apiUrl+'/kendra/api/v1/user-roles/listByEntityType/'+data);
    }
}