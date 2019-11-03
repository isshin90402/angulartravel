import { Component, OnInit } from '@angular/core';
import { SabreService } from './shared/sabre.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  token = '';

  constructor(private sabreService: SabreService) {}

  ngOnInit() {
    this.token = this.sabreService.getLocalStorageToken();
    if (this.token === '') {
      this.sabreService.setToken();
    }

    this.sabreService
      .getCities(this.sabreService.baseUrl, '', this.token)
      .subscribe(response => {
        this.sabreService.cities = response;
        console.log('get cities: ', this.sabreService.cities);
      });
  }
}
