import { Component } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {
  constructor(public gameService: GameService) {
  }

}
