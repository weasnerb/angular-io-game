import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { filter, Subject, takeUntil, ReplaySubject } from 'rxjs';
import { IGameState, IPlayer, MoveCommand } from '../../../../models';
import { ConnectionService } from '../connection/connection.service';
import { StateService } from '../state/state.service';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {

  public state = new ReplaySubject<IGameState|null>(1);
  
  public player = new ReplaySubject<IPlayer|null>(1);
  private playerId?: string;

  private unsubscribe = new Subject<void>();

  constructor(
    private connectionService: ConnectionService,
    private stateService: StateService,
    private router: Router
  ) {

    this.state.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe((gameState) => {
      if (gameState) {
        const currentPlayer = gameState.players.find((p) => p.id === this.playerId) ?? null;
        this.player.next(currentPlayer);
      } else {
        this.connectionService.dispose();
        this.player.next(null);
        this.router.navigate(['/']);
      }
    });
  }


  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public async startGame() {
    const playerName = this.stateService.playerName;
    if (!playerName) {
      this.router.navigate(['/']);
      return;
    }

    this.playerId = await this.connectionService.connect(playerName);

    this.connectionService.messages.pipe(
      takeUntil(this.state.pipe(filter((gameState) => gameState === null)))
    ).subscribe((data) => {
      switch (data.event) {
        case 'stateChanged':
          this.state.next(data.state ?? null);
          break;
        case 'gameOver':
          this.gameOver(data.reason!);
          break;
      }
    });
  }

  private gameOver(reason: string) {
    this.endGame();
    alert(`Game Over: ${reason}`);
  }

  /**
   * End the game for the current user.
   */
  public endGame(): void {
    this.state.next(null);
  }

  /**
   * Move the current player
   * @param direction direction to move the user
   */
  public move(direction: MoveCommand): void {
    this.connectionService.sendCommand(direction);
  }
}
