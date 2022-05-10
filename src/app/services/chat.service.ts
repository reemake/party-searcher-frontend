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
    stompHeaders["Authorization"] = this.authService.getToken();
    this.rxStomp.configure({
      brokerURL: this.url,
      debug: console.log,
      connectHeaders: stompHeaders
    });
    this.authService.updateJWT.subscribe(val => {
      var stompHeaders: StompHeaders = new StompHeaders();
      stompHeaders["Authorization"] = val;
      this.rxStomp.configure({
        brokerURL: this.url,
        debug: console.log,
        connectHeaders: stompHeaders
      });

    });
    this.rxStomp.activate();

  }

  public leaveChat(id:number):Observable<any>{
    return this.httpClient.delete(BACKEND_URL+"/api/chat/removeUserFromChat",{params:{chatId:id}});
  }

  public createChat(event: Event): Observable<number> {
    return this.httpClient.post<number>(BACKEND_URL + "/api/chat/createEventChat", event);
  }

  public createChatWithUser(username: string): Observable<number> {
    return this.httpClient.post<number>(BACKEND_URL + "/api/chat/createChatWithUser", {}, {params: {username: username}});
  }

  public findChatWithUser(user:string ){
    return this.httpClient.get<Chat>(BACKEND_URL + "/api/chat/getChatWithUser",{params: {username: user}});
  }

  public getMessages(chatId: number): Observable<Array<Message>> {
    return this.httpClient.get<Array<Message>>(BACKEND_URL + "/api/chat/getMessages", {params: {chatId: chatId}});
  }

  public subscribe(chatId: number): Observable<IMessage> {
    var stompHeaders: StompHeaders = new StompHeaders();
    stompHeaders["chatId"] = chatId.toString();
    new Subject<any>();
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

  public setMessageAsRead(chatId: number, messageId: number): Observable<any> {
    return this.httpClient.patch(BACKEND_URL + "/api/chat/updateLastReadMessage", {}, {
      params: {
        messageId: messageId,
        chatId: chatId
      }
    });
  }

  public getMessageBefore(chatId: number, id: number): Observable<Message> {
    return this.httpClient.get<Message>(BACKEND_URL + '/api/chat/getMessageBefore', {params: {chatId: chatId, id: id}});
  }
}
