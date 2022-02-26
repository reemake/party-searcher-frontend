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
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from './components/header/header.component';


const ROUTES: Routes = [
  {path: 'events/map', component: EventsIndexComponent},
  {path: '', component: EventsIndexComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LocationBtnComponent,
    EventsIndexComponent,
    EventSearchComponent,
    EventDescriptionComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export const BACKEND_URL: string = "http://localhost:8080";

