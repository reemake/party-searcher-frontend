import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Chat} from "../../entity/Chat/Chat";
import {UserService} from "../pages/friends/user.service";
import {Subscription} from "rxjs";
import {Message} from "../../entity/Chat/Message";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Relationship} from "../pages/friends/Relationship";

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
  private maxMessageLength = 80;
  public imagesMaps: Map<number, string> = new Map<number, string>();

  constructor(private chatService: ChatService, private userService: UserService, private router: Router) {
  }

  ngOnDestroy(): void {
    this.subscribes.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.inputCntrl.valueChanges.subscribe(val => this.searchChats(val));
    this.chatService.getCurrentChatsAndMessages().subscribe(chats => {
      this.chats = chats;
      console.log(chats)
      this.sortChats();
      this.chats.forEach(chat => {
        if (chat.private) {
          var otherUser = chat.chatUsers.filter(cu => cu.user.login !== localStorage.getItem("username"))[0];
          if (otherUser)
            this.imagesMaps = this.imagesMaps.set(chat.id, otherUser.user.pictureUrl);
        }

        this.chatsMap.set(chat.id, chat)
        if (chat.message?.text && chat.message.text.length > this.maxMessageLength) {
          chat.message.text = chat.message.text.substring(0, this.maxMessageLength) + '...';
        }
        this.subscribes.push(this.chatService.subscribe(chat.id).subscribe(message => this.addMessage(JSON.parse(message.body))));
      })
    });
  }

  public addMessage(message: Message): void {
    var chat = this.chatsMap.get(message.chatId);
    if (chat) {
      if (chat.message?.sendTime && chat.message?.sendTime < message.sendTime) {

        chat.message = message;
        if (chat.message?.text && chat.message.text.length > this.maxMessageLength) {
          chat.message.text = chat.message.text.substring(0, this.maxMessageLength) + '...';
        }

        var chat1 = this.chatsMap.get(message.chatId);
        if (chat1?.unReadCount) {
          chat1.unReadCount++;
        } else if (chat1)
          chat1.unReadCount = 1;
        this.sortChats();
      }
    }
  }


  public sortChats(): void {
    this.chats.sort((chat: Chat, chat2: Chat) => {
      if (chat.message?.sendTime && chat2.message?.sendTime)
        if (chat.message?.sendTime > chat2.message?.sendTime) {
          return -1;
        } else if (chat.message?.sendTime < chat2.message?.sendTime) {
          return 1;
        }
      return 0;
    });
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
        this.addFriendsWithoutChats(friends);


      });
    }
  }

  public addFriendsWithoutChats(friends: Relationship[]) {
    var privateChats = this.searchedChats.filter(chat => chat.private);
    friends.map(friend => {

      if (privateChats.filter(chat => chat.chatUsers.filter(user => user.user.login === friend.id.owner.login).length != 0).length == 0) {
        if (`${friend.id.owner.firstName} ${friend.id.owner.lastName}`.toLowerCase().startsWith(this.searchString.toLowerCase()))
          this.searchedChats.push({
            isNewFriendChat: true,
            private: true,
            name: `${friend.id.owner.firstName} ${friend.id.owner.lastName}`,
            id: -1,
            chatUsers:
              [{
                user: {
                  login: friend.id.owner.login,
                  commercialUser: false,
                  commercialUserCreated: false,
                  pictureUrl: friend.id.owner.pictureUrl,
                  firstName: friend.id.owner.firstName,
                  lastName: friend.id.owner.lastName,
                  email: '',
                  password: '',
                  phone: ''
                },
                chatUserType: ''
              }]
          });
      }
    });
  }

}
