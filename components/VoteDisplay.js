import * as d3 from 'd3';
import PartyBar from './PartyBar';
import Tracer from './Tracer';
import { MAJOR_PARTIES, PARTY_ORDER } from '../constants';

export default class VoteDisplay {
    constructor(container) {
        this.barPortion = 0.3;
        this.middlePortion = Math.max(0, 1 - (this.barPortion * 2));

        this.container = d3.select(container);

        this.popVoteBar = new PartyBar(this.container);
        this.middle = new Tracer(this.container);
        this.seatsBar = new PartyBar(this.container);
    }

    static sortedData(data, province) {
        const groups = [];
        let otherTotal = 0;
        Object.entries(data[province]).forEach(pair => {
            if(pair[0] === 'total') { return; }
            if (MAJOR_PARTIES.hasOwnProperty(pair[0])) {
                groups.push(pair);
            } else {
                otherTotal += pair[1];
            }
        });
        groups.push(['Other', otherTotal]);

        return _.sortBy(groups, ([party, _]) => PARTY_ORDER.indexOf(party));
    }

    draw(popVote, seats, province) {
        const sortedPop = VoteDisplay.sortedData(popVote, province);
        const sortedSeats = VoteDisplay.sortedData(seats, province);
        this.popVoteBar.draw(sortedPop, popVote[province].total);
        this.seatsBar.draw(sortedSeats, seats[province].total);
    }
    
    drawLines(popVote, seats, province, party) {
        const sortedPop = VoteDisplay.sortedData(popVote, province);
        const sortedSeats = VoteDisplay.sortedData(seats, province);
        this.middle.draw(sortedPop, popVote[province].total, sortedSeats, seats[province].total, party);
    }
}
