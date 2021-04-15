import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ConstructorPageComponent } from './constructor-page/constructor-page.component';
import { WorkspaceComponent } from './constructor-page/workspace/workspace.component';
import { ConstructorComponent } from './constructor-page/constructor/constructor.component';
import { DayComponentComponent } from './constructor-page/workspace/day-component/day-component.component';
import { AddEditComponent } from './constructor-page/add-edit/add-edit.component';
import {UniversityItemComponent} from './constructor-page/add-edit/university-item.component';
import {LessonItemComponent} from './constructor-page/add-edit/lesson-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ConstructorPageComponent,
    WorkspaceComponent,
    ConstructorComponent,
    DayComponentComponent,
    AddEditComponent,
    UniversityItemComponent,
    LessonItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
