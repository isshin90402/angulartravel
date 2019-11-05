import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class SabreService {
	clientId = 'V1:7hk1rnll757sy7sx:DEVCENTER:EXT';
	clientSecret = 'gKO8L9pp';
	baseUrl = 'https://api-crt.cert.havail.sabre.com/';
	apiPath = 'v2/auth/token';
	token = '';
	cities: any[];

	constructor(private http: HttpClient) {}

	private _getAuthToken() {
		return fetch(`${this.baseUrl}${this.apiPath}?grant_type=client_credentials`, {
			method: 'POST',
			headers: {
				Accept: '*/*',
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic ' + window.btoa(window.btoa(this.clientId) + ':' + window.btoa(this.clientSecret))
			}
		})
			.then((response) => response.json())
			.then((response) => {
				if (response) {
					return Promise.resolve(response);
				} else {
					console.error('SabreAPI authenticate Error - no response');
					return Promise.reject(response);
				}
			})
			.catch((error) => {
				console.error('SabreAPI authenticate Error: ' + error);
				return Promise.reject(error);
			});
	}

	public setAuthToken() {
		this._getAuthToken()
			.then((response) => {
				localStorage.setItem('access_token', JSON.stringify({ access_token: response.access_token }));
				localStorage.setItem('expires_in', JSON.stringify({ expires_in: response.expires_in }));
				localStorage.setItem('token_type', JSON.stringify({ token_type: response.token_type }));
				localStorage.setItem(
					'expiration_datestamp',
					JSON.stringify({
						expiration_datestamp: new Date(new Date().getTime() + 1000 * response.expires_in)
					})
				);
			})
			.catch((error) => {
				return Promise.reject(error);
			});
	}

	private _handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			console.error('An error occurred:', error.error.message);
		} else {
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
		}
		return throwError('Something bad happened; please try again later.');
	}

	getAirports(baseUrl: string, cityCode: string, auth_token: string): Observable<any> {
		const header = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + auth_token
		});
		return this.http.get(baseUrl + 'v1/lists/supported/cities/' + cityCode + '/airports', { headers: header });
	}

	getCities(baseUrl: string, countryCode: string, auth_token: string): Observable<any> {
		const header = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + auth_token
		});
		return this.http.get(baseUrl + 'v1/lists/supported/cities?Country=' + countryCode, { headers: header });
	}

	getLocalStorageToken(): string {
		const localStorageItem = JSON.parse(localStorage.getItem('access_token'));
		return localStorageItem == null ? '' : localStorageItem.access_token;
	}

	getLocalStorageCities(): any[] {
		const localStorageItem = JSON.parse(localStorage.getItem('cities'));
		return localStorageItem == null ? '' : localStorageItem.cities;
	}

	/* 	setToken() {
		this.getToken().subscribe({
			next(response) {
				if (response instanceof HttpErrorResponse) {
					this._handleError(response);
				}

				localStorage.setItem('access_token', JSON.stringify({ access_token: response.access_token }));
				localStorage.setItem('expires_in', JSON.stringify({ expires_in: response.expires_in }));
				localStorage.setItem('token_type', JSON.stringify({ token_type: response.token_type }));
				localStorage.setItem(
					'expiration_datestamp',
					JSON.stringify({ expiration_datestamp: response.expiration_datestamp })
				);
			},
			complete() {}
		});
	}

	getToken(): Observable<any> {
		return this.http.post(`${this.baseUrl}${this.apiPath}`, 'grant_type=client_credentials', {
			headers: new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic ' + window.btoa(window.btoa(this.clientId) + ':' + window.btoa(this.clientSecret))
			})
		});
	} */
}
