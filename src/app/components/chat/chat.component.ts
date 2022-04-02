import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {Message} from "../../entity/Message";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public messages: Array<Message> = [];
  private chatId: number = 0;

  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    route.paramMap.subscribe(params => {
      var id = Number(params.get('id'));
      this.chatId = id;
      this.chatService.subscribe(id).subscribe(message => this.messages.push(JSON.parse(message.body)));
      this.chatService.sendMessage({
        chatId: id,
        text: "kokkk",
        sendTime: new Date(),
        userId: "temkarus0070",
        messagesImagesUrl: []
      })
    });

  }

  ngOnInit(): void {

  }

}
