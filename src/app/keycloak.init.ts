import {environment} from '../environments/environment';
import {KeycloakService} from 'keycloak-angular';

export function initializer(keycloakservice: KeycloakService): () => Promise<any> {
 return (): Promise<any> => {
   return new Promise(async (resolve, reject) => {
     try {
       await keycloakservice.init({
         config: environment.keycloak,
         initOptions: {
           onLoad: 'login-required',
           checkLoginIframe: false
         },
         enableBearerInterceptor: true,
         bearerPrefix: 'Bearer',
         bearerExcludedUrls: [
           'main.js',
         ]
       });
       resolve();
     } catch (error) {
       reject(error);
     }
   });
 };
}