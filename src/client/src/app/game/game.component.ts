import { AfterViewInit, Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, filter, throttleTime } from 'rxjs/operators';
import * as KEY_BINDINGS from '../../assets/keybindings.json';
import { MoveCommand, IGameState, IPlayer } from '../../../../models';
import { GameService } from './game.service';

const MAX_ALLOWABLE_MOVE_COMMANDS_PER_SECOND = 15;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements AfterViewInit {
  private keyBindings = KEY_BINDINGS as Record<string, MoveCommand>;

  constructor(
    private gameService: GameService
  ) {}

  public ngAfterViewInit(): void {
    this.initKeyBindings();
    this.gameService.startGame();
  }

  private initKeyBindings() {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        // Get the key from the event
        map((e) => e.key),
        // ignore unmapped keys
        filter((k) => Object.keys(this.keyBindings).includes(k)),
        // map the key to the command
        map((k) => this.keyBindings[k]),
        // only allow 25 commands per second
        throttleTime(1000 / MAX_ALLOWABLE_MOVE_COMMANDS_PER_SECOND)
      )
      .subscribe((direction) => {
        this.gameService.move(direction);
      });
  }
}
