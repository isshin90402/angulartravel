import { Component, OnInit } from '@angular/core';
import { SabreService } from '../shared/sabre.service';

@Component({
	selector: 'app-flight-list',
	templateUrl: './flight-list.component.html',
	styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent implements OnInit {
	token: string;

	constructor(private sabreService: SabreService) { }

	ngOnInit() {
		this.token = this.sabreService.getLocalStorageToken();

		/* this.sabreService.getAirports(this.baseUrl, 'BJS', this.token).subscribe((response) => {
			console.log(response);
		}); */
	}
}
