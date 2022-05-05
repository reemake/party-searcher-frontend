import {Component, Input, NgZone, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {User} from 'src/app/entity/User';
import {AuthenticationService} from 'src/app/services/auth/authentication.service';
import {UserService} from 'src/app/services/user.service';


import {FileUploader, FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload';
import {Cloudinary} from '@cloudinary/angular-5.x';
import {HttpClient} from '@angular/common/http';
import {Role} from "../../../entity/Role";
import {PhoneConfirmService} from "../../../services/phone-confirm.service";
import {PhoneToken} from "../../../entity/PhoneToken";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})

export class DataComponent implements OnInit {

  @Input()
  responses: Array<any>;

  public phoneCode: string = "";

  hasBaseDropZoneOver: boolean = false;
  uploader: FileUploader;
  title: string;
  isPhotoUploading: boolean = false;
  photoUrl: string = '';


  public remainsTime = 0;
  userLogin: string = localStorage.getItem("username") || '';
  user = new User();
  userEdited = new User();
  msg = "";
  currentPassword: string = "";
  isPasswordMatches: boolean = false;
  public incorrectCode: boolean = false;
  public timerHandler: any = undefined;

  constructor(
    private userService: UserService,
    public authService: AuthenticationService,
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient,
    private phoneConfirmService: PhoneConfirmService) {
    this.responses = [];
    this.title = '';
  }

  ngOnInit(): void {
    this.getUserInfo();

    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = 'myphotoalbum';
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `myphotoalbum,${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      form.append('folder', 'angular_sample');
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    // Insert or update an entry in the responses array
    const upsertResponse = (fileItem: { file: any; status?: number; data?: any; progress?: any; }) => {

      // Run the update in a custom zone since for some reason change detection isn't performed
      // as part of the XHR request to upload the files.
      // Running in a custom zone forces change detection
      this.zone.run(() => {
        // Update an existing entry if it's upload hasn't completed yet

        // Find the id of an existing item
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          // Update existing item with new data
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
        } else {
          // Create new response
          this.responses.push(fileItem);
        }
      });
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) =>
      upsertResponse(
        {
          file: item.file,
          status,
          data: JSON.parse(response)
        }
      );

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );
  }

  isAdmin():boolean{
    return this.user.authorities!==undefined&&this.user.authorities.filter(e=>e===Role.ADMIN).length>0;
  }

  updateUser(dataChangeForm: NgForm) {

    console.log("CURRENT PASSWORD = " + this.currentPassword);

    console.log(this.user.login);
    console.log(this.currentPassword);
    this.userService.approvePassword(this.user.login, this.currentPassword).subscribe(
      result => {
        console.log("RESULT = " + result);
        this.isPasswordMatches = result;
        console.log("IS PASS MATCHES = " + this.isPasswordMatches);
        if (!this.isPasswordMatches) {
          this.msg = "Неверный пароль!"
        }
        else {
          this.msg = "";
          this.userEdited.login = this.user.login;
          if (this.userEdited.email == null)
            this.userEdited.email = this.user.email;
          if (this.userEdited.password == null) {
            this.userEdited.password = this.currentPassword;
            console.log(this.userEdited.password);
          }
          if (this.userEdited.firstName == null)
            this.userEdited.firstName = this.user.firstName;
          if (this.userEdited.lastName == null)
            this.userEdited.lastName = this.user.lastName;
          if (this.userEdited.phone == null)
            this.userEdited.phone = this.user.phone;
          if (this.userEdited.pictureUrl == null)
            this.userEdited.pictureUrl = this.user.pictureUrl;
          if (this.userEdited.organizationName == null)
            this.userEdited.organizationName = this.user.organizationName;
          if (this.userEdited.description == null)
            this.userEdited.description = this.user.description;
          if (this.userEdited.commercialUser == null)
            this.userEdited.commercialUser = this.user.commercialUser;
          if (this.userEdited.commercialUserCreated == null)
            this.userEdited.commercialUserCreated = this.user.commercialUserCreated;

          console.log(this.userEdited);
          this.userService.updateUser(this.userEdited).subscribe(
            result => {
                console.log("user successfully updated");
                dataChangeForm.reset();
                this.getUserInfo();
            },
            error => {
                console.log(error);
            }
          )
        }
      },
      error => {
        console.log(error);
      }
    )


  }

  public sendCode() {
    console.log(this.user)
    this.phoneConfirmService.sendCode(this.userEdited.phone).subscribe(e => {
      this.incorrectCode = false;
      var token: PhoneToken = {
        id: {
          userId: this.user.login,
          dateTimeSend: new Date()
        },
        phone: this.userEdited.phone
      }
      this.user.tokens?.push(token);
    }, error => alert("Произошла ошибка " + error.message && error.message !== '' ? error.message : JSON.stringify(error.error)))
  }

  public checkCode() {
    this.phoneConfirmService.checkCode(this.userEdited.phone, this.phoneCode).subscribe(status => {
      if (status) {
        this.user.isPhoneConfirmed = true;
        this.incorrectCode = false;
      } else {
        this.incorrectCode = true;
      }
    }, error => alert("Произошла ошибка " + error.message && error.message !== '' ? error.message : JSON.stringify(error.error)));
  }

  checkIfHasUnexpiredSmsTokens(): boolean {
    if (this.user.tokens && this.user.tokens.length > 0) {
      for (let token of this.user.tokens) {
        var date = new Date(token.id.dateTimeSend.toString());

        if (date.setDate(date.getMilliseconds() + 10 * 60000) > Date.now()) {
          console.log(date)
          if (this.timerHandler === undefined)
            this.timerHandler = setInterval(() => {
              if (this.getSecondsToSendNewSmsCode() > 0)
                this.remainsTime = this.getSecondsToSendNewSmsCode();
              else clearTimeout(this.timerHandler);
            }, 1000);
          return true;
        }
      }
      return false;
    } else return false;
  }

  public getSecondsToSendNewSmsCode(): number {
    var array = this.user.tokens?.sort((a: PhoneToken, b: PhoneToken) => {

      if (a.id.dateTimeSend > b.id.dateTimeSend) {
        return 1;
      } else if (a.id.dateTimeSend === b.id.dateTimeSend) {
        return 0;
      } else return -1;

    });
    if (array) {
      var arrayElement = array[array.length - 1];
      console.log(arrayElement)
      var date = new Date(arrayElement.id.dateTimeSend);
      return (date.getMilliseconds() + (10 * 60000) - Date.now()) / 1000;
    } else return 0;
  }

  getUserInfo() {
    this.userService.getUser(this.userLogin).subscribe(
      result => {
        this.user = result;
        console.log(this.user);
        console.log(this.authService.isAuth());
      },
      error => {
        console.log(error);
      }
    )
  }

  logOut() {
    this.authService.logOut();
  }


  // PHOTO UPLOADING

  updateTitle(value: string) {
    this.title = value;
  }

  // Delete an uploaded image
  // Requires setting "Return delete token" to "Yes" in your upload preset configuration
  // See also https://support.cloudinary.com/hc/en-us/articles/202521132-How-to-delete-an-image-from-the-client-side-
  deleteImage(data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.toString}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties)
      .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  }

  photoSubmitOn() {
    console.log(this.isPhotoUploading);
    this.isPhotoUploading = true;
    console.log(this.isPhotoUploading);
    console.log(this.photoUrl);
  }

  updateUserWithPhoto(dataChangeForm: NgForm) {
    this.user.pictureUrl = this.photoUrl;
    console.log(this.user);
    console.log(this.photoUrl);
    this.userEdited.login = this.user.login;
    if (this.userEdited.email == null)
      this.userEdited.email = this.user.email;
    if (this.userEdited.firstName == null)
      this.userEdited.firstName = this.user.firstName;
    if (this.userEdited.lastName == null)
      this.userEdited.lastName = this.user.lastName;
    if (this.userEdited.phone == null)
      this.userEdited.phone = this.user.phone;
    if (this.userEdited.pictureUrl == null)
      this.userEdited.pictureUrl = this.user.pictureUrl;
    if (this.userEdited.organizationName == null)
      this.userEdited.organizationName = this.user.organizationName;
    if (this.userEdited.description == null)
      this.userEdited.description = this.user.description;
    if (this.userEdited.commercialUser == null)
      this.userEdited.commercialUser = this.user.commercialUser;
    if (this.userEdited.commercialUserCreated == null)
      this.userEdited.commercialUserCreated = this.user.commercialUserCreated;

    console.log(this.userEdited);
    this.userService.updateUserPhoto(this.userEdited).subscribe(
      result => {
          console.log("user successfully updated with photo");
          dataChangeForm.reset();
          window.location.reload();
          this.getUserInfo();
      },
      error => {
          console.log(error);
      }
    )
  }

  photoSubmitOff(responseData: any, dataChangeForm: NgForm) {
    console.log(this.isPhotoUploading);
    this.isPhotoUploading = false;
    console.log(this.isPhotoUploading);

    console.log(responseData);
    var properties = this.getFileProperties(responseData);
    console.log(properties);
    if (properties) {

      this.photoUrl = properties[15].value;
      this.updateUserWithPhoto(dataChangeForm);

    }
  }

  deletePhoto(dataChangeForm: NgForm) {
    this.userEdited.login = this.user.login;
    if (this.userEdited.email == null)
      this.userEdited.email = this.user.email;
    if (this.userEdited.firstName == null)
      this.userEdited.firstName = this.user.firstName;
    if (this.userEdited.lastName == null)
      this.userEdited.lastName = this.user.lastName;
    if (this.userEdited.phone == null)
      this.userEdited.phone = this.user.phone;
    if (this.userEdited.pictureUrl == null)
      this.userEdited.pictureUrl = this.user.pictureUrl;
    if (this.userEdited.organizationName == null)
      this.userEdited.organizationName = this.user.organizationName;
    if (this.userEdited.description == null)
      this.userEdited.description = this.user.description;
    if (this.userEdited.commercialUser == null)
      this.userEdited.commercialUser = this.user.commercialUser;
    if (this.userEdited.commercialUserCreated == null)
      this.userEdited.commercialUserCreated = this.user.commercialUserCreated;
    console.log(this.userEdited);
    this.userService.deleteUserPhoto(this.userEdited).subscribe(
      result => {
          console.log("user photo successfully deleted");
          dataChangeForm.reset();
          this.photoUrl = '';
          this.user.pictureUrl = '';
          window.location.reload();
          this.getUserInfo();
      },
      error => {
        console.log(error);
      }
    )
  }

}
