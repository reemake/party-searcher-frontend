import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Message} from "../../entity/Message";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public messages: Array<Message> = [];

  constructor(private chatService: ChatService) {
    this.chatService.subscribe(1).subscribe(message => this.messages.push(JSON.parse(message.body)));
    this.chatService.sendMessage({
      chatId: 1,
      text: "kokkk",
      sendTime: new Date(),
      userId: "temkarus0070",
      messagesImagesUrl: []
    })
  }

  ngOnInit(): void {

  }

}
