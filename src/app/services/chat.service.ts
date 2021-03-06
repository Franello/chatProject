import { Injectable } from '@angular/core';
import { AngularFireDatabase,  } from 'angularfire2/database';
import {FirebaseListObservable} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { ChatMessage } from '../models/chat-message.model';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
     user:any; 
    chatMessages:FirebaseListObservable<ChatMessage[]>;
    chatMessage:ChatMessage;
    userName: Observable<string>;

  constructor(private db :AngularFireDatabase, private afAuth:AngularFireAuth) { 
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null){
        this.user = auth;
      }
    })
  }


  sendMessage(msg:string){
      const timestamp = this.getTimeStamp();
      const email = this.user.email; 
      this.chatMessages = this.getMessages(); 
      this.chatMessages.push({
            message: msg,
            timeSent: timestamp,
            userName: this.userName, 
            email: email
      });
      console.log('called sendMessage()!');
      
  }
  getMessages() : FirebaseListObservable<ChatMessage[]>{
      return this.db.list('messages', {
        query: {
                limitToLast:25,
                orderByKey: true
        }
      });
  }
  getTimeStamp(){
     const now = new Date();
     const date = now.getUTCFullYear() + '/' + (now.getUTCMonth()+ 1 ) + '/' + now.getUTCDate();
      const time = now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();
        return (date + ' ' + time );


  }
}
