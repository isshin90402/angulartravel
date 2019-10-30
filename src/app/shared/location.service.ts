import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LocationService {
  constructor() {}

  getLocations() {
    return [
      "Las Vegas",
      "Tokyo",
      "Sydney",
      "New York",
      "Los Angeles",
      "Milano",
      "London",
      "Barcelona",
      "Madrid",
      "Rome",
      "Lisbon",
      "San Diego",
      "San Francisco",
      "Miami",
      "Vancouver",
      "Monte Carlo",
      "Seattle",
      "Osaka",
      "Toronto",
      "Santiago"
    ];
  }
}
