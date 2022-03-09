import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MapComponent} from './components/map/map.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LocationBtnComponent} from './components/map/location-btn/location-btn.component';
import {EventsIndexComponent} from './components/pages/events/events-index/events-index.component';
import {EventSearchComponent} from './components/events/event-search/event-search.component';
import {EventDescriptionComponent} from './components/events/event-description/event-description.component';
import {RouterModule, Routes, Router } from "@angular/router";
import {CommonModule} from "@angular/common";
import {SurveyComponent} from './components/survey/survey.component';
import { SurveyTest } from './components/pages/survey.test/survey.test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypeComponent } from './components/type/type.component';


const ROUTES: Routes = [
  {path: '', component: EventsIndexComponent},
  {path: 'pages/survey.test', component: SurveyTest}
];


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LocationBtnComponent,
    EventsIndexComponent,
    EventSearchComponent,
    EventDescriptionComponent,
    SurveyComponent,
    SurveyTest,
    TypeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export const BACKEND_URL: string = "http://localhost:8080";

