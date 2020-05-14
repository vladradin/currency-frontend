import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './authentication/components/login/login.component';
import { LogoutComponent } from './authentication/components/logout/logout.component';
import { RegistrationComponent } from './users/components/registration/registration.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { IsAuthenticatedGuard } from './authentication/services';
import { IsAnonymousGuard } from './shared/isAnonymousGuard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [IsAnonymousGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [IsAuthenticatedGuard] },
  { path: 'registration', component: RegistrationComponent, canActivate: [IsAnonymousGuard] },
  {
    path: 'currency',
    loadChildren: () => import('src/app/currency/currency.module').then(module => module.CurrencyModule),
    canLoad: [IsAuthenticatedGuard]
  }
];

@NgModule({
  imports: [
    AuthenticationModule,
    UsersModule,
    RouterModule.forRoot(routes)
  ],
  providers:[
    IsAnonymousGuard
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
