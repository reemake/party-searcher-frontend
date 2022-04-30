import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MapComponent} from './components/events/map/map.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LocationBtnComponent} from './components/events/map/location-btn/location-btn.component';
import {EventsIndexComponent} from './components/events/events-index/events-index.component';
import {EventSearchComponent} from './components/events/event-search/event-search.component';
import {EventDescriptionComponent} from './components/events/event-description/event-description.component';
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from './components/header/header.component';
import {EventCreateComponent} from './components/events/event-create/event-create.component';
import {LoginComponent} from "./components/profile/login/login.component";
import {RegistrationComponent} from "./components/profile/registration/registration.component";
import {AuthInterceptor} from "./services/auth/auth.interceptor";
import {SurveyComponent} from './components/profile/survey/survey.component';
import {SurveyTest} from './components/profile/survey.test/survey.test.component';
import {TypeComponent} from './components/type/type.component';
import {AccountsComponent} from './components/profile/accounts/accounts.component';
import {DataComponent} from './components/profile/data/data.component';
import {AuthGuardService} from './services/auth/auth-guard.service';
import {ListComponent} from "./components/events/list/list.component";
import {ChatComponent} from "./components/chats/chat/chat.component";
import {FriendsComponent} from "./components/profile/friends/friends.component";
import {MessagesComponent} from './components/chats/messages/messages.component';
import {FileUploadModule} from "ng2-file-upload";
import * as cloudinary from 'cloudinary-core';
import cloudinaryConfiguration from './cloudinary_cfg';
import {NotificationsComponent} from './components/notifications/notifications.component';
import {CreateComplaintComponent} from "./components/events/complaints/create/create-complaint.component";
import {InViewportModule} from "ng-in-viewport";
import {OauthComponent} from './components/profile/login/oauth/oauth.component';
import {EditComponent} from './components/events/edit/edit.component';
import {CloudinaryModule} from '@cloudinary/angular-5.x';
import {CommercialRegisterComponent} from './components/profile/commercial-register/commercial-register.component';
import {MyEventsComponent} from './components/profile/my-events/my-events.component';
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {ReviewDialogComponent} from './components/events/review-dialog/review-dialog.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {SuccessDialogComponent} from './components/success-dialog/success-dialog.component';
import {OauthLoginDialogComponent} from './components/profile/oauth-login-dialog/oauth-login-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {NgImageFullscreenViewModule} from "ng-image-fullscreen-view";
import { ReviewsComponent } from './components/events/reviews/reviews.component';
import { AdminPageComponent } from './components/profile/admin-page/admin-page.component';
import {NgSelectModule} from "@ng-select/ng-select";
import {AdminGuard} from "./services/auth/admin.guard";

//export const BACKEND_URL: string = "https://event-teammates-backend.herokuapp.com";
export const BACKEND_URL: string = "http://localhost:8080";

const ROUTES: Routes = [
  {path: 'events/map', component: EventsIndexComponent},
  {path: "events/add", component: EventCreateComponent, canActivate: [AuthGuardService]},
  {path: '', component: EventsIndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'pages/survey.test', component: SurveyTest, canActivate: [AuthGuardService]},
  {path: 'profile/accounts', component: AccountsComponent, canActivate: [AuthGuardService]},
  {path: 'profile/me', component: DataComponent, canActivate: [AuthGuardService]},
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuardService]},
  {path: 'friends', component: FriendsComponent, canActivate: [AuthGuardService]},
  {path: 'messages', component: MessagesComponent, canActivate: [AuthGuardService]},
  {path: "login/oauth2", component: OauthComponent},
  {path: "events/edit", component: EditComponent, canActivate: [AuthGuardService]},
  {path: 'profile/commercialRegister', component: CommercialRegisterComponent, canActivate: [AuthGuardService]},
  {path: 'profile/events', component: MyEventsComponent, canActivate: [AuthGuardService]},
  {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardService]},
  {path:'reviews',component:ReviewsComponent},
  {path:'events/description',component:EventDescriptionComponent},
  {path:'events/complaints/create',component:CreateComplaintComponent},
  {path:'profile/admin',component:AdminPageComponent,canActivate:[AdminGuard]}

];

@NgModule({
  declarations: [
    CreateComplaintComponent,
    AppComponent,
    MapComponent,
    LocationBtnComponent,
    EventsIndexComponent,
    EventSearchComponent,
    EventDescriptionComponent,
    HeaderComponent,
    EventCreateComponent,
    RegistrationComponent,
    LoginComponent,
    SurveyComponent,
    SurveyTest,
    TypeComponent,
    AccountsComponent,
    DataComponent,
    ListComponent,
    ChatComponent,
    FriendsComponent,
    MessagesComponent,
    OauthComponent,
    EditComponent,
    CommercialRegisterComponent,
    MyEventsComponent,
    ReviewDialogComponent,
    SuccessDialogComponent,
    OauthLoginDialogComponent,
    NotificationsComponent,
    ReviewsComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    ReactiveFormsModule,
    FileUploadModule,
    CloudinaryModule.forRoot(cloudinary, cloudinaryConfiguration)
    , InViewportModule,
    MatInputModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCardModule, MatMenuModule,
    NgImageFullscreenViewModule,
  NgSelectModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

