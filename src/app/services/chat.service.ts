import {Injectable} from '@angular/core';
import {IMessage, StompHeaders} from "@stomp/stompjs";
import {Observable, Subject} from "rxjs";
import {AuthenticationService} from "./auth/authentication.service";
import {BACKEND_URL} from "../app.module";
import {Message} from "../entity/Chat/Message";
import {RxStomp} from "@stomp/rx-stomp";
import {HttpClient} from "@angular/common/http";
import {Event} from "../entity/Event/Event";
import {Chat} from "../entity/Chat/Chat";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private rxStomp = new RxStomp();
  private url: string = "";

  constructor(private authService: AuthenticationService, private httpClient: HttpClient) {
    this.rxStomp.configure({
      brokerURL: this.url
    })
    this.url = BACKEND_URL;
    this.url = this.url.replace("http://", "ws://") + "/chatService";
    var stompHeaders: StompHeaders = new StompHeaders();
    stompHeaders["jwt"] = this.authService.getToken();
    this.rxStomp.configure({
      brokerURL: this.url,
      debug: console.log,
      connectHeaders: stompHeaders
    });
    this.rxStomp.activate();

  }

  public createChat(event: Event): Observable<number> {
    console.log(event);
    return this.httpClient.post<number>(BACKEND_URL + "/api/chat/createEventChat", event);
  }

  public getMessages(chatId: number): Observable<Array<Message>> {
    return this.httpClient.get<Array<Message>>(BACKEND_URL + "/api/chat/getMessages", {params: {chatId: chatId}});
  }

  public subscribe(chatId: number): Observable<IMessage> {
    var stompHeaders: StompHeaders = new StompHeaders();
    stompHeaders["chatId"] = chatId.toString();
    var observer: Subject<any> = new Subject<any>();

    return this.rxStomp.watch({destination: "/chat/messages/" + chatId, subHeaders: stompHeaders});
  }

  public sendMessage(message: Message): void {
    this.rxStomp.publish({
      destination: "/app/sendMessage/" + message.chatId,
      body: JSON.stringify(message)
    });
  }

  public get(id: number): Observable<Chat> {
    return this.httpClient.get<Chat>(BACKEND_URL + "/api/chat", {params: {chatId: id}});
  }

  public getCurrentChatsAndMessages(): Observable<Chat[]> {
    return this.httpClient.get<Chat[]>(BACKEND_URL + "/api/chat/getCurrentChats");
  }
}
