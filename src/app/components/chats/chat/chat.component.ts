import {Component, DoCheck, ElementRef, Input, NgZone, OnDestroy} from '@angular/core';
import {ChatService} from "../../../services/chat.service";
import {Message} from "../../../entity/Chat/Message";
import {ActivatedRoute} from "@angular/router";
import {Chat} from "../../../entity/Chat/Chat";
import {debounceTime, Subscription} from "rxjs";
import {UserService} from "../../../services/user.service";
import {ViewportScroller} from "@angular/common";
import {Cloudinary} from "@cloudinary/angular-5.x";
import {HttpClient} from "@angular/common/http";
import {FileUploader, FileUploaderOptions, ParsedResponseHeaders} from "ng2-file-upload";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnDestroy, DoCheck {
  public message: Message = {
    text: "",
    chatId: 0,
    userId: "",
    messageImagesUrls: [],
    sendTime: new Date()
  };
  public messages: Array<Message> = [];
  public onlineMessages: Array<Message> = [];
  private chatId: number = 0;
  public chat: Chat;
  private messagesSubscribes: Subscription = new Subscription();
  public usersImages: Map<string, string> = new Map<string, string>();
  public maxReadedMessageId: number = 0;
  private lastMessageIdSCROLL = 0;
  public isAdmin = false;
  public username = localStorage.getItem("username") || '';
  private messageContainer: HTMLElement | null;
  public imagesFullScreens:Map<string,number>=new Map<string, number>();
  public imageObj:any=[];

  public currentMessage: Message;

  uploader: FileUploader;
  title: string;
  isPhotoUploading: boolean = false;
  public isShowFullImage = false;
  public imageIndex: number = -1;
  @Input()
  responses: Array<any> = [];

  constructor(private chatService: ChatService, private route: ActivatedRoute, private userService: UserService,
              private scroller: ViewportScroller, private cloudinary: Cloudinary,
              private zone: NgZone, private http: HttpClient) {
    var elementsByClassName = document.getElementsByClassName("lightbox-image");
    if(elementsByClassName && elementsByClassName[0]){
      elementsByClassName[0].addEventListener('touchstart', ()=>{

      }, {passive: true})
    }

    this.initChat();
    this.initImageCloud();
  }

  public initImageCloud() {
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
      return {fileItem, form};
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

  public initChat() {
    this.route.paramMap.subscribe(params => {
      var id = Number(params.get('id'));
      this.chatId = id;
      this.message.chatId = id;
      this.chatService.get(id).subscribe(chat => {
        this.chat = chat;
        this.maxReadedMessageId = chat.lastReadMessage || 0;
        var chatUser = this.chat.chatUsers.filter(e => e.user.login === localStorage.getItem("username") || '')[0];
        if (chatUser.chatUserType === 'MAIN_ADMIN' || chatUser.chatUserType === 'ADMIN') {
          this.isAdmin = true;
        }
        if (chat.private) {
          var user = chat.chatUsers.filter(cu => cu.user.login !== localStorage.getItem('username'))[0];
          chat.name = `${user.user.firstName} ${user.user.lastName}`;
        }
        this.fillUsersImagesMap();


      });
      this.messagesSubscribes = this.chatService.subscribe(id).subscribe(message => {
        var messageParsed = JSON.parse(message.body);
        if (messageParsed.removed) {
          this.messages = this.messages.filter(e => e.id !== messageParsed.id);
          this.onlineMessages = this.onlineMessages.filter(e => e.id !== messageParsed.id);
        } else
          this.onlineMessages.push(messageParsed);
        if (this.usersImages.get(messageParsed.userId) !== undefined) {
          this.userService.getUser(messageParsed.userId).subscribe(u => {
            this.usersImages.set(u.login, u.pictureUrl);
          })
        }

      });
      this.chatService.getMessages(id).subscribe(messages => {
        this.messages = messages;
        this.onlineMessages = this.onlineMessages.filter(onlinemessage => {
          return this.messages.find((val, index, arr) => {
            return onlinemessage.id == val.id
          }) === undefined
        })
      });
    });
  }


  photoSubmitOff(responseData: any[]) {
    this.isPhotoUploading = false;
    responseData.forEach((data, index) => {
      var url = data.data.url;
      this.message.messageImagesUrls.push(url);
      this.imagesFullScreens = this.imagesFullScreens.set(url, index);
    })
    this.responses = [];
  }

  closeEventHandler() {
    this.isShowFullImage = false;
    this.imageIndex=-1;
    this.imageObj=[];
  }

  removeImage(url: string) {
    this.message.messageImagesUrls = this.message.messageImagesUrls.filter(e => e !== url);
  }

  showFullImage(message:Message,url: string) {
    this.currentMessage=message;
    this.imagesFullScreens=new Map<string, number>();
    for (let [index,image] of this.currentMessage.messageImagesUrls.entries()) {
      this.imagesFullScreens=  this.imagesFullScreens.set(image,index);
      this.imageObj.push({image: image, alt: 'message image'});
    }
    this.imageIndex = (this.imagesFullScreens.get(url) || 0);
    console.log(this.imageIndex)
    this.isShowFullImage = true;
  }

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }
    return Object.keys(fileProperties)
      .map((key) => ({'key': key, 'value': fileProperties[key]}));
  }

  photoSubmitOn() {
    this.isPhotoUploading = true;
  }

  deleteImage(data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'});
    const options = {headers: headers};
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.toString}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };

  removeMessage(message: Message): void {
    message.removed = true;
    this.chatService.sendMessage(message);
  }

  ngDoCheck(): void {
    if (this.lastMessageIdSCROLL !== this.maxReadedMessageId && this.messages.length > 0 && document.getElementById("message" + this.maxReadedMessageId)) {
      this.scroller.scrollToAnchor("message" + this.maxReadedMessageId);
      this.lastMessageIdSCROLL = this.maxReadedMessageId;
    }
  }


  public fillUsersImagesMap(): void {
    this.chat.chatUsers.forEach(cu => {
      this.usersImages.set(cu.user.login, cu.user.pictureUrl);
    })

  }

  public setMessageAsRead(message: Message) {
    if (message.id && message.id > this.maxReadedMessageId) {
      this.maxReadedMessageId = message.id || 0;
      this.chatService.setMessageAsRead(this.chat.id, this.maxReadedMessageId).pipe(
        debounceTime(2000)
      )
        .subscribe(val => {

        }, error => console.log(error));
    }
  }

  public sendMessage(): void {
    this.message.sendTime = new Date();
    this.chatService.sendMessage(this.message);
    this.message.text = "";
    this.message.messageImagesUrls = [];
    (document.getElementById("messageArea") as HTMLInputElement).value = '';
  }


  ngOnDestroy() {
    this.messagesSubscribes.unsubscribe();
  }


}
