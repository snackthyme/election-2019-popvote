import * as d3 from 'd3';
import PartyBar from './PartyBar';
import Tracer from './Tracer';

export default class VoteDisplay {
    constructor(container) {
        this.barPortion = 0.3;
        this.middlePortion = Math.max(0, 1 - (this.barPortion * 2));

        this.container = d3.select(container);

        this.popVoteBar = new PartyBar(this.container);
        this.middle = new Tracer(this.container);
        this.seatsBar = new PartyBar(this.container);
    }

    draw(popVote, seats, province) {
        this.popVoteBar.draw(popVote, province);
        this.middle.draw(popVote, seats);
        this.seatsBar.draw(seats, province);
    }
}
