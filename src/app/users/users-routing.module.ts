import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from './services/users.service';


const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  providers: [
    UsersService
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
