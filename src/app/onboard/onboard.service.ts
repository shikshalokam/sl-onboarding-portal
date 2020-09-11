import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class OnboardService {
    constructor(
        public http: HttpClient
    ) {

    }
    public getProfileData() {
        return this.http.get(environment.apiUrl + '/kendra/api/v2/user-extension/getProfile');
    }

    public getState() {
        return this.http.get(environment.apiUrl + '/kendra/api/v2/entities/listByEntityType/state');
    }
    public getRole(data) {
        return this.http.get(environment.apiUrl + '/kendra/api/v1/entities/subEntitiesRoles/' + data);
    }

    public getSubEntityForm(url) {
        return this.http.get(environment.apiUrl + '/kendra/api/v1/users/entitiesMappingForm/' + url)
    }

    public getSubEntityList(params) {
        return this.http.get(environment.apiUrl + '/kendra/api/v1/entities/subEntityList/' + params)
    }

    public profileUpdate( payload) {
        return this.http.post(environment.apiUrl + '/kendra/api/v1/user-extension/updateProfileRoles', payload)
    }
}