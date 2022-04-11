import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Message} from "../../entity/Chat/Message";
import {ActivatedRoute} from "@angular/router";
import {Chat} from "../../entity/Chat/Chat";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
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

  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      var id = Number(params.get('id'));
      this.chatId = id;
      this.message.chatId = id;
      this.chatService.get(id).subscribe(chat => this.chat = chat);
      this.messagesSubscribes = this.chatService.subscribe(id).subscribe(message => {
        console.log(message);
        return this.onlineMessages.push(JSON.parse(message.body))
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

  public sendMessage(): void {
    this.message.sendTime = new Date();
    this.chatService.sendMessage(this.message);
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.messagesSubscribes.unsubscribe();
  }


}
