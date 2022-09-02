import { Component } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(private gameService: GameService) {}

  public disconnect(): void {
    this.gameService.endGame();
  }

}
