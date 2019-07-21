import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type('number')
  _wordCount = 0;

  @type('number')
  _score = 0;

  get score(): number {
    return this._score;
  }

  get wordCount(): number {
    return this._wordCount;
  }

  set score(value: number) {
    this._score = value;
  }

  set wordCount(value: number) {
    this._wordCount += value;
  }
}

export default Player;