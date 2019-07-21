import Player from './Player';
import { Schema, MapSchema, type } from '@colyseus/schema';

class State extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type('boolean')
  winner = null

  @type('boolean')
  draw = false

  @type('number')
  round = 1

  @type('boolean')
  inProgress = false

  @type('string')
  letters = ''

  createPlayer(id: number) {
    this.players[id] = new Player();
  }

  updatePlayer(id: string, player: any) {
    Object.assign(this.players[id], {
      ...player
    });
  }

  removePlayer(id: number) {
    delete this.players[id];
  }

  startGame(letters: string) {
    this.letters = letters;
    this.inProgress = true;
  }

  setNewRound(letters: string) {
    if (this.round === 3) return;

    this.round += 1;
    this.letters = letters;
  }
}

export default State;