import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Chat} from "../../entity/Chat/Chat";
import {UserService} from "../pages/friends/user.service";
import {Subscription} from "rxjs";
import {Message} from "../../entity/Chat/Message";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  public inputCntrl: FormControl = new FormControl("");
  public searchString: string = "";
  public chats: Chat[] = [];
  public searchedChats: Chat[] = [];
  public isChatsSearched = false;
  public subscribes: Subscription[] = []
  private chatsMap: Map<number, Chat> = new Map<number, Chat>();

  constructor(private chatService: ChatService, private userService: UserService, private router: Router) {
  }

  ngOnDestroy(): void {
    this.subscribes.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.inputCntrl.valueChanges.subscribe(val => this.searchChats(val));
    this.chatService.getCurrentChatsAndMessages().subscribe(chats => {
      this.chats = chats;
      this.chats.forEach(chat => {
        this.chatsMap.set(chat.id, chat);
        this.subscribes.push(this.chatService.subscribe(chat.id).subscribe(message => this.addMessage(JSON.parse(message.body))));
      })
    });
  }

  public addMessage(message: Message): void {
    var chat = this.chatsMap.get(message.chatId);
    if (chat) {
      if (chat.message?.sendTime && chat.message?.sendTime < message.sendTime) {
        chat.message = message;
      }
    }
  }

  public createChatWithFriend(username: string): void {
    this.chatService.createChatWithUser(username).subscribe(chatId => {
      this.router.navigate(['/chat', {id: chatId}]);
    });
  }

  public searchChats(str: string): void {
    this.searchString = str;
    if (this.searchString === "" || !this.searchString) {
      this.searchedChats = [];
      this.isChatsSearched = false;
    } else {
      this.isChatsSearched = true;
      this.searchedChats = this.chats.filter(chat => chat.name.toLowerCase().startsWith(this.searchString.toLowerCase()));
      this.userService.getFriends().subscribe(friends => {
        friends.map(friend => {
          console.log(friend)
          if (this.searchedChats.filter(filterChats => filterChats.name === `${friend.id.owner.firstName} ${friend.id.owner.lastName}` && filterChats.isPrivate &&
              filterChats.users.filter(u => u.login === friend.id.owner.login).length == 0).length == 0 &&
            `${friend.id.owner.firstName} ${friend.id.owner.lastName}`.toLowerCase().startsWith(this.searchString)) {
            this.searchedChats.push({
              isNewFriendChat: true,
              isPrivate: true,
              name: `${friend.id.owner.firstName} ${friend.id.owner.lastName}`,
              id: -1,
              users:
                [{
                  login: friend.id.owner.login,
                  commercialUser: false,
                  commercialUserCreated: false,
                  pictureUrl: friend.id.owner.pictureUrl,
                  firstName: friend.id.owner.firstName,
                  lastName: friend.id.owner.lastName,
                  email: '',
                  password: '',
                  phone: ''
                }]
            });
          }
        });

      });
    }
  }

}
