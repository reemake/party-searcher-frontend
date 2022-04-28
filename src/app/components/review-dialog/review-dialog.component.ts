import {Component, Inject, Input, NgZone, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Event} from "../../entity/Event/Event";
import {EventLengthMark, Review} from "../../entity/Event/Review";
import {NgForm} from "@angular/forms";
import {FileUploader, FileUploaderOptions, ParsedResponseHeaders} from "ng2-file-upload";
import {Cloudinary} from "@cloudinary/angular-5.x";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnInit {
  public lengthsMarks = new Map<string, string>();
  public lengthsKeys: string[] = [];
  public lenMarkModel = "";
  public deepReview: boolean = false;
  public numbers = [1, 2, 3, 4, 5];
  public review: Review | undefined;
  public imagesUrls:string[]=[];
  public imagesFullScreens:Map<string,number>=new Map<string, number>();

  private lenMarks = Object.values(EventLengthMark);
  uploader: FileUploader;
  title: string;
  isPhotoUploading: boolean = false;
  public isShowFullImage=false;
  public imageIndex:number=0;
  @Input()
  responses: Array<any>=[];
  public imageObj:any=[];
  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Event,private cloudinary: Cloudinary,
    private zone: NgZone,private http:HttpClient) {
  }

  isValidDEEPrEVIEW() {
    return !this.deepReview || (this.review && this.review.eventOrganizationMark > 0 && this.review.eventOrganizationMark <= 5 && this.review.recommendToOthersMark > 0 && this.review.recommendToOthersMark <= 5 && this.review.eventMark > 0 && this.review.eventMark <= 5 && this.lenMarkModel && this.lenMarkModel !== ';' && this.review.text && this.review.text !== '');
  }

  ngOnInit(): void {

    this.lengthsMarks = this.lengthsMarks.set("Очень короткое", this.lenMarks[0]);
    this.lengthsMarks = this.lengthsMarks.set("Очень длинное", this.lenMarks[1]);
    this.lengthsMarks = this.lengthsMarks.set("То что надо", this.lenMarks[2]);
    for (let val of this.lengthsMarks.keys()) {
      this.lengthsKeys.push(val);
    }

    this.onChange(5);

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

  onChange(mark: number) {
    if (!this.review && this.data.id && localStorage.getItem("username") !== null) {
      var name: string = localStorage.getItem("username") || "";
      this.review = {
        id: {
          userId: name,
          eventId: this.data.id
        },
        eventMark: mark,
        reviewWeight: 0.8,
        recommendToOthersMark: 1,
        eventOrganizationMark: 1
        , eventLengthMark: undefined
      }
      this.deepReview=true;
    } else if (this.review) {
      this.review.eventMark = mark;
    }
  }

  photoSubmitOff(responseData: any[]) {
    this.isPhotoUploading = false;
    responseData.forEach((data,index)=>{
      var url = data.data.url;
        this.imagesUrls.push(url);
        this.imagesFullScreens=this.imagesFullScreens.set(url,index);
    })
    this.responses=[];
  }

  closeEventHandler(){
    this.isShowFullImage=false;
  }

  removeImage(url:string){
    this.imagesUrls=this.imagesUrls.filter(e=>e!==url);
   this.imagesFullScreens.delete(url);
  }

  showFullImage(url:string){
this.imageIndex=this.imagesFullScreens.get(url)||0;
this.imageObj=[];
    for(let image of this.imagesUrls){
      this.imageObj.push({image:image,alt:'review image'});
    }
    this.isShowFullImage=true;

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
    console.log(this.imagesUrls[this.imagesUrls.length-1]);
  }

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


  goReview(): Review {
    if (this.review) {
      if (!this.review.notReady) {
        if (this.deepReview) {
          this.review.reviewWeight = 1;
          this.review.eventLengthMark = this.lengthsMarks.get(this.lenMarkModel);
          this.review.reviewImagesUrls=this.imagesUrls;
        } else {
          this.review.reviewWeight = 0.85;
          this.review.eventLengthMark = undefined;
          this.review.eventOrganizationMark = 0;
          this.review.recommendToOthersMark = 0;
        }
      }
      return this.review;
    } else throw new Error("review is undefined");

  }

  onCancel(): void {
    if (this.data.id && localStorage.getItem("username") !== null) {
      var name: string = localStorage.getItem("username") || "";
      this.review = {
        id: {
          userId: name,
          eventId: this.data.id
        },
        eventMark: 0,
        reviewWeight: 0,
        recommendToOthersMark: 0,
        eventOrganizationMark: 0
        , eventLengthMark: undefined,
        notReady: true
      }
    }
    this.dialogRef.close(this.review);
  }


}
