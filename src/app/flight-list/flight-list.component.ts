import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-flight-list",
  templateUrl: "./flight-list.component.html",
  styleUrls: ["./flight-list.component.css"]
})
export class FlightListComponent implements OnInit {
  constructor() {}
  clientId = "V1:7hk1rnll757sy7sx:DEVCENTER:EXT";
  clientSecret = "gKO8L9pp";

  authenticate(
    clientId,
    clientSecret,
    baseURL = "https://api-crt.cert.havail.sabre.com/",
    apiPath = "v2/auth/token"
  ) {
    const authToken = {};

    return fetch(`${baseURL}${apiPath}?grant_type=client_credentials`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          window.btoa(window.btoa(clientId) + ":" + window.btoa(clientSecret))
      }
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          return Promise.resolve(response);
        } else {
          console.error("SabreAPI authenticate Error - no response");
          return Promise.reject(response);
        }
      })
      .catch(error => {
        console.error("SabreAPI authenticate Error: " + error);
        return Promise.reject(error);
      });
  }

  ngOnInit() {
    this.authenticate("myId", "mySecret")
      .then(response => {
        let authToken: any;
        authToken.access_token = response.access_token;
        authToken.expires_in = response.expires_in;
        authToken.token_type = response.token_type;
        authToken.expiration_datestamp = new Date(
          new Date().getTime() + 1000 * response.expires_in
        );
      })
      .catch(error => {
        //
      });
  }
}
