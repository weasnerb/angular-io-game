import { Component, Input, OnInit } from '@angular/core';
import { IGameState, IPlayer } from '../../../../models';

@Component({
  selector: 'app-css-field',
  templateUrl: './css-field.component.html',
  styleUrls: ['./css-field.component.scss']
})
export class CssFieldComponent implements OnInit {

  @Input()
  state?: IGameState;

  @Input()
  currentPlayer?: IPlayer;

  constructor() { }

  ngOnInit(): void {
  }

}
