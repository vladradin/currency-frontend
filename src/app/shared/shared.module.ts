import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsAnonymousGuard } from './isAnonymousGuard';
import { IsAuthenticatedGuard } from '../authentication/services';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        IsAnonymousGuard,
        IsAuthenticatedGuard
      ]
    };
  }
}
