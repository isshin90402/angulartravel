import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup
} from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { MatRadioChange } from "@angular/material/radio";
import * as moment from "moment";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { LocationService } from "../shared/location.service";
import { SabreService } from "../shared/sabre.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  @ViewChild("oneWayReturn", { static: false })
  oneWayReturn: any;

  locations: any[];
  locationsRefined: any[];
  filteredLocationsFr: Observable<string[]>;
  filteredLocationsTo: Observable<string[]>;

  returnDatePlaceholder = "Choose return date";

  constructor(
    private locationService: LocationService,
    private sabreService: SabreService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  frLocationControl: FormControl = new FormControl();
  toLocationControl: FormControl = new FormControl();

  airportGroup: FormGroup = this.formBuilder.group(
    {
      fromAirport: this.frLocationControl,
      toAirport: this.toLocationControl
    },
    { validators: this._validateSameAirports }
  );

  departDateControl: FormControl = new FormControl();
  returnDateControl: FormControl = new FormControl();

  dateGroup: FormGroup = this.formBuilder.group(
    {
      departDate: this.departDateControl,
      returnDate: this.returnDateControl
    },
    { validators: this._validateDepartEarlierThanReturnDate }
  );

  form = this.formBuilder.group({
    airportGroup: this.airportGroup,
    dateGroup: this.dateGroup,
    isOneWay: ["", Validators.required]
  });

  ngOnInit() {
    // this.locations = this.locationService.getLocations();
    this.locations = this.sabreService.getLocalStorageCities();

    this.locationsRefined = this.locations.map(
      x => x.name + " (" + x.code + ")" + ", " + x.countryName
    );

    this.frLocationControl.setValidators(this._validateAirport.bind(this));
    this.toLocationControl.setValidators(this._validateAirport.bind(this));

    this.filteredLocationsFr = this.frLocationControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );

    this.filteredLocationsTo = this.toLocationControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
  }

  private _validateAirport(control: FormControl) {
    return this.locationsRefined.includes(control.value)
      ? null
      : { validateAirport: { valid: false } };
  }

  private _validateDepartEarlierThanReturnDate(formGroup: FormGroup) {
    const departDate = formGroup.get("departDate").value;
    const returnDate = formGroup.get("returnDate").value;

    if (departDate === null || returnDate === null) {
      return null;
    } else if (departDate <= returnDate) {
      return null;
    } else {
      return { departEarlierThanReturn: { valid: false } };
    }
  }

  private _validateSameAirports(formGroup: FormGroup) {
    const fromAirport = formGroup.get("fromAirport").value;
    const toAirport = formGroup.get("toAirport").value;

    if (fromAirport === null || toAirport === null) {
      return null;
    } else if (fromAirport === toAirport) {
      return { airportsCannotBeTheSame: { valid: false } };
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.locationsRefined.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  // Need to improve
  private _oneWayReturnHandler(event: MatRadioChange) {
    if (event.value === "oneWay") {
      this.returnDatePlaceholder = "One way";
      this.returnDateControl.disable();
    } else if (event.value === "return") {
      this.returnDatePlaceholder = "Choose return date";
      this.returnDateControl.enable();
    }
  }

  // Not working
  private _validateDate(control: FormControl) {
    if (moment(control.value, "DD-MM-YYYY", true).isValid()) {
      return null;
    } else {
      return { dateIsValid: { valid: false } };
    }
  }

  public searchClicked(event: Event) {
    this.router.navigate(["/flights"]);
  }
}
