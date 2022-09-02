import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, fromEvent, merge, Subject, concat, firstValueFrom } from 'rxjs';
import { first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MoveCommand, IGameState } from '../../../../models';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService implements OnDestroy {
  private socket?: Socket<any, any>;

  public messages: Subject<IMessage> = new Subject<IMessage>();

  constructor() {}

  public ngOnDestroy(): void {
    
  }

  public async connect(name: string): Promise<string> {
    const socketProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
    this.socket = io(`${socketProtocol}://${window.location.host}`, {
      reconnection: false,
    });
    
    const stateChange$ = fromEvent<IGameState>(this.socket, 'stateChanged').pipe(
      map((state) => {
        return {
          event: 'stateChanged',
          state,
        } as IMessage;
      }),
      tap((s) => console.debug({ stateChanged: s }))
    );

    const gameOver$ = fromEvent<string>(this.socket, 'gameOver').pipe(
      map((reason) => {
        return {
          event: 'gameOver',
          reason,
        } as IMessage;
      }),
      tap((s) => console.debug({ gameOver: s }))
    );

    const disconnect$ = fromEvent(this.socket, 'disconnect').pipe(
      tap(() => {
        console.log('socket disconnected');
        this.dispose();
      })
    );

    concat(stateChange$, gameOver$).pipe(
      takeUntil(disconnect$)
    ).subscribe(this.messages);

    this.socket.connect();
    
    await firstValueFrom(fromEvent(this.socket, 'connect').pipe(
      tap(() => this.socket?.emit('name', name)),
    ));

    console.log(`connected on socket ${this.socket.id} as ${name}`)

    return this.socket.id;
  }


  public sendCommand(command: MoveCommand): void {
    if (!this.socket) {
      console.debug(`Failed to send data: no connected socket`);
      return;
    }

    this.socket.emit('command', command);
  }

  public dispose() {
    this.socket?.disconnect();
    this.socket = undefined;
    this.messages.complete();
    this.messages = new Subject();
  }
}

interface IMessage {
  event: 'stateChanged' | 'gameOver';
  state?: IGameState;
  reason?: string;
}
