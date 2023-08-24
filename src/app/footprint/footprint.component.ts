import airportsDB from '../database/airports.json';

import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FootprintService } from '../services/footprint.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Airports, Footprint } from '../model/airports.model';
import { HttpErrorResponse } from '@angular/common/http';
import { delay, filter, fromEvent, take } from 'rxjs';
import { ErrorsService } from '../services/errors.service';
import { ChartService } from '../services/chart.service';

@Component({
  selector: 'app-footprint',
  templateUrl: './footprint.component.html',
  styleUrls: ['./footprint.component.scss'],
})
export class FootprintComponent implements OnInit {
  constructor(
    private footprint: FootprintService,
    private handleError: ErrorsService,
    private chartService: ChartService
  ) {}

  @ViewChildren('departureAir') fromAirport!: QueryList<ElementRef>;
  @ViewChildren('arrivalAir') toAirport!: QueryList<ElementRef>;
  @ViewChild('departureField') departureField!: ElementRef<HTMLInputElement>;
  @ViewChild('arrivalField') arrivalField!: ElementRef<HTMLInputElement>;

  footprintForm!: FormGroup;

  airportsData: Airports[] = airportsDB;
  filteredAirports: Airports[] = [];

  originCode: string = '';
  destinationCode: string = '';

  airplanesData = [
    { passengers: 1 },
    { passengers: 2 },
    { passengers: 3 },
    { passengers: 4 },
    { passengers: 5 },
    { passengers: 6 },
    { passengers: 7 },
    { passengers: 8 },
    { passengers: 9 },
    { passengers: 10 },
  ];

  cabinClasses = [
    { cabin: 'Economy', code: 'economy' },
    { cabin: 'Premium Economy', code: 'premium_economy' },
    { cabin: 'Business', code: 'business' },
    { cabin: 'First', code: 'first' },
  ];

  footprintOnePassenger: number = 0;
  footprintTotalPassengers: number = 0;
  showResults: boolean = false;
  showAnim: boolean = false;

  errorMessage: string = '';
  errorFounded: boolean = false;

  ngOnInit(): void {
    this.footprintForm = new FormGroup({
      from: new FormControl<string | null>('', [Validators.required]),
      to: new FormControl<string | null>('', [Validators.required]),
      people: new FormControl<string | null>('', [Validators.required]),
      cabin_class: new FormControl<string | null>('', [Validators.required]),
    });
    this.playVideo();
  }

  playVideo() {
    let video = document.getElementById('clouds-video') as HTMLVideoElement;
    video.oncanplaythrough = () => {
      video.muted = true;
      video.play();
      video.pause();
      video.play();
    };
  }

  get departure() {
    return this.footprintForm.get('from');
  }
  get arrival() {
    return this.footprintForm.get('to');
  }

  footprintSubmit(form: FormGroup) {
    let departure = form.value.from.split(' ')[0];
    let arrival = form.value.to.split(' ')[0];
    let passengers = form.value.people.passengers;
    let cabinClass = form.value.cabin_class.code;

    this.footprint.getFootprintData(departure, arrival, cabinClass).subscribe({
      next: (footprintData: Footprint) => {
        this.showAnim = true;
        this.errorFounded = false;
        fromEvent(document, 'animationend')
          .pipe(take(1)) //ascolta 1 obs alla volta. Utile per risolvere multipli richiami dei metodi
          .subscribe({
            next: () => {
              this.showAnim = false;
              this.showResults = true;
              this.footprintOnePassenger = footprintData.footprint / 1000;
              this.footprintTotalPassengers =
                (footprintData.footprint * passengers) / 1000;
              this.originCode = departure;
              this.destinationCode = arrival;

              this.chartService.updateData({
                singlePassenger: this.footprintOnePassenger,
                totalPassengers: this.footprintTotalPassengers,
              }); //! Aggiorna la proprietà del chartService con i dati ottenuti dall'API
            },
          });
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.handleError.handleAPIErrors(error);
        this.errorFounded = true;
      },
    });
  }

  activeFilter: string = '';

  filterAirports(query: string, field: string) {
    this.activeFilter = field;
    let search = query.toLowerCase().trim();

    if (search.length >= 2) {
      this.filteredAirports = this.airportsData;
      this.filteredAirports = this.airportsData.filter((key) => {
        return (
          //! FIX FILTER
          key.city.toLowerCase().includes(search) ||
          key.code.toLowerCase().startsWith(search)
        );
      });
    }
    if (!query) {
      this.filteredAirports = [];
      this.selectAirport = -1;
    }
  }

  handleInputSelection(value: string, field: string, action: string) {
    switch (action) {
      case 'confirm':
        if (field === 'departure') {
          this.footprintForm.patchValue({ from: value });
          this.filteredAirports = [];
        } else if (field === 'arrival') {
          this.footprintForm.patchValue({ to: value });
          this.filteredAirports = [];
        }
        this.selectAirport = -1;
        break;
      case 'update':
        if (field === 'departure') {
          this.footprintForm.patchValue({ from: value });
        } else if (field === 'arrival') {
          this.footprintForm.patchValue({ to: value });
        }
        break;
      case 'reset':
        switch (field) {
          case 'departure':
            this.footprintForm.patchValue({ from: '' });
            this.selectAirport = -1;
            this.filteredAirports = [];
            break;
          case 'arrival':
            this.footprintForm.patchValue({ to: '' });
            this.selectAirport = -1;
            this.filteredAirports = [];
            break;
        }
        break;
      default:
        break;
    }
  }

  selectAirport: number = -1;

  //? Crea un Lista di elementi di tipo "Riferimento Elemento". Si compone di tali elementi quando si creano i vari button. Viene trasformato in un array e poi con la proprietà intrinseca "nativeElement" + [square bracket notation] si accede alle proprietà del singolo elemento

  @HostListener('keydown', ['$event'])
  handleAirportsNavigation(event: KeyboardEvent) {
    this.btnNavigation(event);
    this.btnEscapeReset(event);
  }

  btnEscapeReset(event: KeyboardEvent) {
    let target = event.target;

    if (event.key === 'Escape') {
      this.filteredAirports = [];

      if (target === this.departureField.nativeElement) {
        this.departureField.nativeElement.value = '';
      } else if (target === this.arrivalField.nativeElement) {
        this.arrivalField.nativeElement.value = '';
      }
    }
  }

  btnNavigation(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();

      const step = event.key === 'ArrowUp' ? -1 : 1;
      const maxIndex = this.filteredAirports.length - 1;
      let nextTab = this.selectAirport + step;

      if (nextTab < 0) {
        nextTab = maxIndex;
      } else if (nextTab > maxIndex) {
        nextTab = 0;
      }

      this.selectAirport = nextTab;
      let btnAirports: QueryList<ElementRef>;

      fromEvent(document, 'keydown')
        .pipe(
          filter(() => this.filteredAirports.length > 0),
          delay(100)
        )
        .subscribe({
          next: () => {
            if (this.activeFilter === 'departure') {
              btnAirports = this.fromAirport;
            } else if (this.activeFilter === 'arrival') {
              btnAirports = this.toAirport;
            }

            if (btnAirports) {
              const btnArray = btnAirports.toArray();
              if (btnArray.length > 0) {
                const btnFocused = btnArray[this.selectAirport]
                  .nativeElement as HTMLButtonElement;
                btnFocused.focus();
              }
            }
          },
        });
    }
  }

  @HostListener('click', ['$event'])
  handleClickOut(event: MouseEvent) {
    const fromInput = this.departureField.nativeElement;
    const toInput = this.arrivalField.nativeElement;

    this.fromAirport.toArray().forEach((button) => {
      if (event.target !== fromInput && event.target !== button.nativeElement) {
        this.filteredAirports = [];
        fromInput.value = '';
      }
    });

    this.toAirport.toArray().forEach((button) => {
      if (event.target !== toInput && event.target !== button.nativeElement) {
        this.filteredAirports = [];
        toInput.value = '';
      }
    });
  }

  @HostListener('mouseover', ['$event'])
  removeBackground() {
    this.fromAirport.toArray().forEach((from) => {
      let buttonFocused = from.nativeElement as HTMLButtonElement;
      if (buttonFocused.getAttribute('tabindex') === '0') {
        buttonFocused.blur();
      }
    });

    this.toAirport.toArray().forEach((to) => {
      let buttonFocused = to.nativeElement as HTMLButtonElement;
      if (buttonFocused.getAttribute('tabindex') === '0') {
        buttonFocused.blur();
      }
    });
  }
}
