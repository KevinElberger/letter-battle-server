import State from './State';
import Player from './Player';
import { Room, Client } from 'colyseus';

const utils = require('./utils');

const SIXTY_SECONDS = 60 * 1000;

export class BattleRoom extends Room {

  onInit(options: any) {
    this.setState(new State());
  }

  requestJoin(options: any, isNew: boolean) {
    // Prevent the client from joining the same room from another browser tab
    return this.clients.filter(c => c.id === options.clientId).length === 0;
  }

  onJoin(client: Client, options: any) {
    if (this.locked) return;

    if (!this.state.players[client.sessionId] && Object.keys(this.state.players).length < 2) {
      console.log('client joined:\n', client.id);
      this.state.createPlayer(client.id);
    }

    if (Object.keys(this.state.players).length === 2) {
      this.lock();
      const letters = utils.stringGen(8);
      this.state.startGame(letters);
      this.broadcast({ update: { started: true, letters } });
      this.clock.setTimeout(this.update.bind(this), SIXTY_SECONDS);
    }
  }

  onMessage(client: Client, data: any) {
    if (this.state.winner || this.state.draw) {
      return;
    }

    this.state.updatePlayer(client.id, data.player);
  }

  // TODO: Separate set and get functionality
  setWinner() {
    let winner = null;
    let highScore = 0;
    let lowScore = 0;
    let players = <any>[];

    Object.keys(this.state.players).forEach(key => {
      players.push(this.state.players[key]);
    });

    if (players[0].score > players[1].score) {
      winner = players[0];
    } else if (players[1].score > players[0].score) {
      winner = players[1];
    } else {
      this.state.draw = true;
    }

    this.state.inProgress = false;

    return winner;
  }

  update() {
    if (this.state.round !== 3) {
      const letters = utils.stringGen(8);
      this.state.setNewRound(letters);
      this.clock.setTimeout(this.update.bind(this), SIXTY_SECONDS);
    } else {
      this.clock.stop();
      const winner = this.setWinner();
      const update = winner ? { winner } : { draw: true };
      this.broadcast({ update });
    }
  }

  onLeave(client: Client, consented: boolean) {
    delete this.state.players[client.sessionId];

    const remainingPlayerIds = Object.keys(this.state.players);

    if (remainingPlayerIds.length) {
      this.clock.stop();
      this.state.winner = remainingPlayerIds[0];
      this.broadcast({ update: { winner: this.state.winner } });
    }
  }

  onDispose() {

  }
}
