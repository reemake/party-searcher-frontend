import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MapComponent} from './components/map/map.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LocationBtnComponent} from './components/map/location-btn/location-btn.component';
import {EventsIndexComponent} from './components/pages/events/events-index/events-index.component';
import {EventSearchComponent} from './components/events/event-search/event-search.component';
import {EventDescriptionComponent} from './components/events/event-description/event-description.component';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from './components/header/header.component';
import {EventCreateComponent} from './components/events/event-create/event-create.component';
import {LoginComponent} from "./components/login/login.component";
import {RegistrationComponent} from "./components/registration/registration.component";
import {AuthInterceptor} from "./services/auth/auth.interceptor";


const ROUTES: Routes = [
  {path: 'events/map', component: EventsIndexComponent},
  {path: "events/add", component: EventCreateComponent},
  {path: '', component: EventsIndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LocationBtnComponent,
    EventsIndexComponent,
    EventSearchComponent,
    EventDescriptionComponent,
    HeaderComponent,
    EventCreateComponent,
    RegistrationComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export const BACKEND_URL: string = "http://localhost:8080";

