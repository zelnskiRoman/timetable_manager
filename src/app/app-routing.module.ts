import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {ConstructorPageComponent} from './constructor-page/constructor-page.component';


const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'constructor', component: ConstructorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
