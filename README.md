# Final Project - Master Front End by Brian Moretti

Welcome to my Final Project of the Front-End Master by Star2Impact University

## :technologist: Try now

Can't wait to try my application. Go here, [Flights Footprint](https://flights-footprint.web.app/footprint) , and have fun.

## Flights Footprint - Application

Flights Footprint app, is useful to calculate and have an estimation of the footprint of a flight from/to different airports setting the number of passengers and the cabin class. Is build using the API available at [Goclimate](https://api.goclimate.com/docs) and a cloned airports database [airports.json](https://gist.github.com/tdreyno/4278655)

### :computer: Main functionality

- **Form:** The application has a form with 2 Input boxes and 2 Dropdown boxes.

  - The Input boxes are used to select the departure airport and the landing airport.
    - As soon as you starting typing, below the boxes, will appear a window with a list of airports filtered by the keyword typed.
    - The user can navigate throught the list with the mouse or the keyboard arrow
  - The Dropdown boxes are used to select the number of passengers (1 to 10) and the cabin class of the flight (Economy, Premium, Business, First)

- **Result:** Once submitted the form will appear an animations of a lasts of 3sec. and then a results section will come into the view with the following data:
  - The code of the airports (departure / landing)
  - The amount of CO2e, express in tons, emitted, based on the flight setting, for a single passenger and for the total passengers of the flights.
    - Of course, if has been setting 1 as the n. of passengers the value will be the same
  - A chart with the CO2e emitted
- **Chart:** The chart give the user the possibility to compare up to 6 different flights footprint routes setted
  - The X axis shows the number of flights compared
  - The Y axis shows the amount of CO2e per single passenger
  - The Y1 axis shows the amount of CO2e per total passengers

### :hammer: How is build:

The applications is build using:

- Angular
- PrimeNG (Icon NG)
- SCSS
- Chart.JS
- CircleType.JS
- Firebase (Hosting)

The application has the following features:

- Test Code-Coverage greater than 80%
- 2 NGModules: 'Footprint' and 'App'. Footprint Module is configured to be Lazy-Load. You can see the process spying the Devs tools of your Browser.

## :gear: Config the application on locale

Copy the repository from my Github  
Run `npm install` to install all the modules needed to use the application  
Run `ng serve -o` or `ng serve open` to launch the app locally and open immediately `http://localhost:4200/`.  
Run `ng test` to execute the unit tests via Karma

## :incoming_envelope: Contact me

If you find some bugs to fix or simply you want to send me a message please write me at [brianmoretti2512@gmail.com](mailto:brianmoretti2512@gmail.com)
