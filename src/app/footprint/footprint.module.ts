import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FootprintRoutingModule } from './footprint-routing.module';

import { FootprintComponent } from './footprint.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  declarations: [FootprintComponent, FooterComponent, HeaderComponent, ChartComponent],
  imports: [
    CommonModule,
    InputTextModule,
    DropdownModule,
    KeyFilterModule,
    ChartModule,
    ButtonModule,
    ReactiveFormsModule,
    FootprintRoutingModule,
  ],
})
export class FootprintModule {}
