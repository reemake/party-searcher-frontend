import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Message} from "../../entity/Message";
import {ActivatedRoute} from "@angular/router";
import {Chat} from "../../entity/Chat";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
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

  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      var id = Number(params.get('id'));
      this.chatId = id;
      this.message.chatId = id;
      this.chatService.get(id).subscribe(chat => this.chat = chat);
      this.chatService.subscribe(id).subscribe(message => this.onlineMessages.push(JSON.parse(message.body)));
      this.chatService.getMessages(id).subscribe(messages => {
        this.messages = messages;
        this.onlineMessages = this.onlineMessages.filter(onlinemessage => {
          this.messages.find((val, index, arr) => {
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

}
