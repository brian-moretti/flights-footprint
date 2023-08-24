import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'footprint', pathMatch: 'full' },
  {
    path: 'footprint',
    loadChildren: () =>
      import('./footprint/footprint.module').then((m) => m.FootprintModule),
  },
];
const routesOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routesOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
