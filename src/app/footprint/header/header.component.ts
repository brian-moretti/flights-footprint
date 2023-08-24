import { Component, OnInit } from '@angular/core';
import * as Circletype from 'circletype';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  ngOnInit(): void {
    const circleUpperTitle = new Circletype.default(
      document.getElementById('upperTitle')
    );
    const circleLowerTitle = new Circletype.default(
      document.getElementById('lowerTitle')
    );
    circleUpperTitle.radius(150);
    circleLowerTitle.radius(150).dir(-1);
  }

  title: string = 'Flights Footprint';
}
