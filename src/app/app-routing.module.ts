import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddUserComponent } from './views/add-user/add-user.component';
import { UsersListComponent } from './views/users-list/users-list.component';

const routes: Routes = [
  { path: 'add-person', component: AddUserComponent },
  { path: 'persons', component: UsersListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
