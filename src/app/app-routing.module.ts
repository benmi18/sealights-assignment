import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddUserComponent } from './views/add-user/add-user.component';

const routes: Routes = [
  { path: 'add-user', component: AddUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
