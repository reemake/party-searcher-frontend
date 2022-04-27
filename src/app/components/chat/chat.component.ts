import {Component, DoCheck, OnDestroy} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Message} from "../../entity/Chat/Message";
import {ActivatedRoute} from "@angular/router";
import {Chat} from "../../entity/Chat/Chat";
import {debounceTime, Subscription} from "rxjs";
import {UserService} from "../../services/user.service";
import {ViewportScroller} from "@angular/common";

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
    messagesImagesUrl: [],
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

  constructor(private chatService: ChatService, private route: ActivatedRoute, private userService: UserService,
              private scroller: ViewportScroller) {
    route.paramMap.subscribe(params => {
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
    (document.getElementById("messageArea") as HTMLInputElement).value = '';
  }


  ngOnDestroy() {
    this.messagesSubscribes.unsubscribe();
  }


}
