import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MapComponent} from './components/map/map.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LocationBtnComponent} from './components/map/location-btn/location-btn.component';
import {EventsIndexComponent} from './components/pages/events/events-index/events-index.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LocationBtnComponent,
    EventsIndexComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export const BACKEND_URL = "http://localhost:8080"
