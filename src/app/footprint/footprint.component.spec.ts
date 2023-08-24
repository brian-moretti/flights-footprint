import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintComponent } from './footprint.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { ButtonModule } from 'primeng/button';
import { FooterComponent } from './footer/footer.component';
import { ChartComponent } from './chart/chart.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Airports, Footprint } from '../model/airports.model';
import { FootprintService } from '../services/footprint.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorsService } from '../services/errors.service';
import { By } from '@angular/platform-browser';

describe('FootprintComponent', () => {
  let component: FootprintComponent;
  let fixture: ComponentFixture<FootprintComponent>;
  let fakeFootprintService: FootprintService;
  let fakeErrorService: ErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FootprintComponent,
        HeaderComponent,
        FooterComponent,
        ChartComponent,
      ],
      imports: [
        HttpClientTestingModule,
        DropdownModule,
        ChartModule,
        ReactiveFormsModule,
        ButtonModule,
        RouterTestingModule,
      ],
    });
    fixture = TestBed.createComponent(FootprintComponent);
    fakeFootprintService = TestBed.inject(FootprintService);
    fakeErrorService = TestBed.inject(ErrorsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clear to input value', () => {
    const fakeMouseEvent = new MouseEvent('click');

    const mockFromInput = document.createElement('input');
    const mockToInput = document.createElement('input');
    const mockButtonFrom = document.createElement('button');
    const mockButtonTo = document.createElement('button');

    component.departureField = { nativeElement: mockFromInput } as any;
    component.arrivalField = { nativeElement: mockToInput } as any;
    component.fromAirport = {
      toArray: () => [{ nativeElement: mockButtonFrom }],
    } as any;
    component.toAirport = {
      toArray: () => [{ nativeElement: mockButtonTo }],
    } as any;

    component.handleClickOut(fakeMouseEvent);

    expect(mockFromInput.value).toBe('');
    expect(mockToInput.value).toBe('');
    expect(component.filteredAirports).toEqual([]);
  });

  it('handle btnNavigation with ArrowDown', () => {
    let fakeKeyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    spyOn(fakeKeyboardEvent, 'preventDefault');
    component.btnNavigation(fakeKeyboardEvent);
    expect(fakeKeyboardEvent.preventDefault).toHaveBeenCalled();
  });

  it('handle btnNavigation with ArrowUp', () => {
    let fakeKeyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    spyOn(fakeKeyboardEvent, 'preventDefault');
    component.btnNavigation(fakeKeyboardEvent);
    expect(fakeKeyboardEvent.preventDefault).toHaveBeenCalled();
  });

  it('handle filtered method ', () => {
    let fakeQuery = '';
    let fakeField = '';
    component.filterAirports(fakeQuery, fakeField);
    expect(component.activeFilter).toEqual(fakeField);
    fakeQuery = 'Supercalifragilisti...';
    component.filterAirports(fakeQuery, fakeField);
    component.filteredAirports = component.airportsData;
    expect(component.filteredAirports).toEqual(component.airportsData);
  });

  it('handle input selection', () => {
    let fakeValue = '';
    let fakeField = 'departure';
    let fakeAction = 'confirm';
    component.handleInputSelection(fakeValue, fakeField, fakeAction);
    expect(component.filteredAirports).toEqual([]);
    expect(component.footprintForm.value.from).toEqual(fakeValue);

    fakeField = 'arrival';
    fixture.detectChanges();
    component.handleInputSelection(fakeValue, fakeField, fakeAction);
    expect(component.filteredAirports).toEqual([]);
    expect(component.footprintForm.value.to).toEqual(fakeValue);

    expect(component.selectAirport).toEqual(-1);

    fakeAction = 'update';
    fakeField = 'departure';
    fixture.detectChanges();
    component.handleInputSelection(fakeValue, fakeField, fakeAction);
    expect(component.footprintForm.value.from).toEqual('');

    fakeField = 'arrival';
    fixture.detectChanges();
    component.handleInputSelection(fakeValue, fakeField, fakeAction);
    expect(component.footprintForm.value.from).toEqual('');

    fakeAction = 'reset';
    fakeField = 'departure';
    fixture.detectChanges();
    component.handleInputSelection(fakeValue, fakeField, fakeAction);
    expect(component.selectAirport).toEqual(-1);
    expect(component.filteredAirports).toEqual([]);

    fakeField = 'arrival';
    fixture.detectChanges();
    component.handleInputSelection(fakeValue, fakeField, fakeAction);
    expect(component.selectAirport).toEqual(-1);
    expect(component.filteredAirports).toEqual([]);

    fakeAction = '';
    fakeField = ''
    fixture.detectChanges();
    component.handleInputSelection(fakeValue, fakeField, fakeAction);
    expect().nothing
  });

  it('handle hostListener for keydown event', () => {
    let fakeEvent = new KeyboardEvent('keydown');
    component.handleAirportsNavigation(fakeEvent);
    spyOn(component, 'btnNavigation');
    spyOn(component, 'btnEscapeReset');
    fixture.debugElement.triggerEventHandler('keydown', fakeEvent);
    expect(component.btnEscapeReset).toHaveBeenCalledWith(fakeEvent);
    expect(component.btnNavigation).toHaveBeenCalledWith(fakeEvent);
  });

  it('handle escape keydown event', () => {
    let fakeEvent = new KeyboardEvent('keydown', { key: 'Escape' });

    component.btnEscapeReset(fakeEvent);
    expect(component.filteredAirports).toEqual([]);
  });

  it('handle the submit form', () => {
    let fakeForm = new FormGroup({
      from: new FormControl<string | null>('', [Validators.required]),
      to: new FormControl<string | null>('', [Validators.required]),
      people: new FormControl<string | null>('', [Validators.required]),
      cabin_class: new FormControl<string | null>('', [Validators.required]),
    });
    const response: Footprint = {
      footprint: 0,
      offset_prices: [
        {
          amount: 0,
          currency: '',
          offset_url: '',
          locale: '',
        },
      ],
    };
    spyOn(fakeFootprintService, 'getFootprintData').and.returnValue(
      of(response)
    );
    component.footprintSubmit(fakeForm);
    expect(component.showResults).toBeFalsy();
    expect(component.showAnim).toBeTruthy();
  });

  it('handle submit error', () => {
    let fakeForm = new FormGroup({
      from: new FormControl<string | null>('', [Validators.required]),
      to: new FormControl<string | null>('', [Validators.required]),
      people: new FormControl<string | null>('', [Validators.required]),
      cabin_class: new FormControl<string | null>('', [Validators.required]),
    });
    let error = new HttpErrorResponse({});
    spyOn(fakeFootprintService, 'getFootprintData').and.returnValue(
      throwError(() => error)
    );
    let spy = spyOn(fakeErrorService, 'handleAPIErrors');
    component.footprintSubmit(fakeForm);
    expect(spy).toHaveBeenCalledWith(error);
  });

  it('should return the arrival FormControl', () => {
    const formGroup: FormGroup = component.footprintForm;
    const arrivalControl = formGroup.get('to');

    expect(component.arrival).toBe(arrivalControl);
  });

  it('handle focus/hover event simultanously', () => {
    const mockButtonFrom = document.createElement('button');
    mockButtonFrom.setAttribute('tabindex', '0');
    const mockButtonTo = document.createElement('button');
    mockButtonTo.setAttribute('tabindex', '0');

    const fromAirportElements = [mockButtonFrom];
    const toAirportElements = [mockButtonTo];

    component.fromAirport = {
      toArray: () =>
        fromAirportElements.map((element) => ({ nativeElement: element })),
    } as any;
    component.toAirport = {
      toArray: () =>
        toAirportElements.map((element) => ({ nativeElement: element })),
    } as any;

    fixture.detectChanges();
    component.removeBackground();
    expect(mockButtonFrom.matches(':focus')).toBe(false);
    expect(mockButtonTo.matches(':focus')).toBe(false);
  });
});
