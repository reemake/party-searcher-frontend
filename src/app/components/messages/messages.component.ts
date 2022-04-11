import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Chat} from "../../entity/Chat/Chat";
import {UserService} from "../pages/friends/user.service";
import {Subscription} from "rxjs";
import {Message} from "../../entity/Chat/Message";

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  public searchString: string = "";
  public chats: Chat[] = [];
  public searchedChats: Chat[] = [];
  public isChatsSearched = false;
  public subscribes: Subscription[] = []
  private chatsMap: Map<number, Chat> = new Map<number, Chat>();

  constructor(private chatService: ChatService, private userService: UserService) {
  }

  ngOnDestroy(): void {
    this.subscribes.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
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

  public searchChats(): void {
    if (this.searchString === "") {
      this.searchedChats = [];
      this.isChatsSearched = false;
    } else {
      this.isChatsSearched = true;
      this.searchedChats = this.chats.filter(chat => chat.name.toLowerCase().startsWith(this.searchString.toLowerCase()));
      this.userService.getFriends().subscribe(friends => {
        friends.map(friend => {
          if (this.searchedChats.filter(filterChats => filterChats.name === `${friend.id.friend.firstName} ${friend.id.friend.lastName}` && filterChats.isPrivate &&
            filterChats.users.filter(u => u.login === friend.id.friend.login).length == 0).length == 0) {
            this.searchedChats.push({
              isNewFriendChat: true,
              isPrivate: true,
              name: `${friend.id.friend.firstName} ${friend.id.friend.lastName}`,
              id: -1,
              users:
                [{
                  login: friend.id.friend.login,
                  commercialUser: false,
                  commercialUserCreated: false,
                  pictureUrl: friend.id.friend.pictureUrl,
                  firstName: friend.id.friend.firstName,
                  lastName: friend.id.friend.lastName,
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
