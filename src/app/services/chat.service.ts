import {Injectable} from '@angular/core';
import {IMessage, StompHeaders, StompSubscription} from "@stomp/stompjs";
import {Observable, Subject} from "rxjs";
import {AuthenticationService} from "./auth/authentication.service";
import {BACKEND_URL} from "../app.module";
import {Message} from "../entity/Message";
import {RxStomp} from "@stomp/rx-stomp";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private rxStomp = new RxStomp();
  private chatsSubscribers: Map<number, StompSubscription> = new Map<number, StompSubscription>();
  private url: string = "";

  constructor(private authService: AuthenticationService) {
    this.rxStomp.configure({
      brokerURL: this.url
    })
    this.url = BACKEND_URL;
    this.url = this.url.replace("http://", "ws://") + "/chatService";
    this.rxStomp.configure({
      brokerURL: this.url,
      debug: console.log
    });

  }

  public subscribe(chatId: number): Observable<IMessage> {
    if (!this.rxStomp.active)
      this.rxStomp.activate();
    var stompHeaders: StompHeaders = new StompHeaders();
    stompHeaders["jwt"] = this.authService.getToken();
    var observer: Subject<any> = new Subject<any>();

    return this.rxStomp.watch({destination: "/chat/messages/" + chatId});
  }

  public sendMessage(message: Message): void {
    if (!this.rxStomp.active)
      this.rxStomp.activate();
    var stompHeaders: StompHeaders = new StompHeaders();
    stompHeaders["jwt"] = this.authService.getToken();
    this.rxStomp.publish({
      destination: "/app/sendMessage/" + message.chatId,
      body: JSON.stringify(message),
      headers: stompHeaders
    });
  }


  public unsubscribe(chatId: number) {
    if (!this.rxStomp.active)
      this.rxStomp.activate();
    var stompHeaders: StompHeaders = new StompHeaders();
    stompHeaders["jwt"] = this.authService.getToken();
    this.chatsSubscribers.get(chatId)?.unsubscribe(stompHeaders);
  }
}
