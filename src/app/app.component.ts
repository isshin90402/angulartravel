import { Component, OnInit } from '@angular/core';
import { SabreService } from './shared/sabre.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
	token = '';

	constructor(private sabreService: SabreService) {}

	ngOnInit() {
		this.token = this.sabreService.getLocalStorageToken();

		if (this.token === '') {
			this.sabreService.setAuthToken();
		}

		this._getCities;
	}

	private _getCities = setInterval(() => {
		let tokenNow = this.sabreService.getLocalStorageToken();

		if (tokenNow === '') {
			return;
		}

		this.sabreService.getCities(this.sabreService.baseUrl, '', tokenNow).subscribe((response) => {
			this.sabreService.cities = response.Cities;
			localStorage.setItem('cities', JSON.stringify({ cities: this.sabreService.cities }));
			clearInterval(this._getCities);
		});
	}, 2000);
}
