import { Component } from '@angular/core';
import { SabreService } from './shared/sabre.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  token: string = '';

  constructor(private sabreService: SabreService) { }
  
  ngOnInit() {
    this.token = this.sabreService.getLocalStorageToken();
    if (this.token === '') {
      this.sabreService.setToken();
    }
  }
}
