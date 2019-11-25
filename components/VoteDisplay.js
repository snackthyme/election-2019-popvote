import * as d3 from 'd3';
import PartyBar from './PartyBar/PartyBar';
import Tracer from './Tracer/Tracer';
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

    text(popVote, seats, province, party) {
        if (party === 'Other') {
            return {
                top: '',
                bottom: ''
            };
        }

        const votePercent = popVote[province][party] / popVote[province].total;
        const expectedSeats = votePercent * seats[province].total;
        const actualSeats = seats[province][party] || 0;
        const diff = expectedSeats - actualSeats; // -ve = extra, +ve = owes
        let lowNumber = Math.floor(Math.abs(diff));
        let numberText = lowNumber;
        if (Math.abs(diff) !== lowNumber) {
            numberText = `${lowNumber}-${lowNumber + 1}`;
        }
        const votePercentText = (votePercent * 100).toPrecision(3);
        const seatPercentText = ((actualSeats / seats[province].total) * 100).toPrecision(3);
        const bottomText = `${votePercentText}% of votes vs ${seatPercentText}% of seats (${actualSeats}/${seats[province].total})`;

        if (seats[province].total < 5) {
            return {
                top: '¯\\_(ツ)_/¯',
                bottom: bottomText
            };
        }

        if (Math.abs(diff) < 0.5) {
            return {
                top: 'First-past-the-post was proportional :o',
                bottom: bottomText
            };
        }
        if (diff < 0) {
            return {
                top: `First-past-the-post won your party an extra ${numberText} seats.`,
                bottom: bottomText
            };
        }
        return {
            top: `First-past-the-post owes your party ${numberText} seats.`,
            bottom: bottomText
        };
    }

    draw(popVote, seats, province) {
        const onMouseMove = d => {
            this.drawLines(popVote, seats, province, d);
        };

        const onMouseOut = d => {
            this.middle.setText('');
            this.middle.hide();
        };

        const sortedPop = VoteDisplay.sortedData(popVote, province);
        const sortedSeats = VoteDisplay.sortedData(seats, province);
        this.popVoteBar.draw(sortedPop, popVote[province].total, onMouseMove, onMouseOut);
        this.seatsBar.draw(sortedSeats, seats[province].total, onMouseMove, onMouseOut);
    }
    
    drawLines(popVote, seats, province, party) {
        const sortedPop = VoteDisplay.sortedData(popVote, province);
        const sortedSeats = VoteDisplay.sortedData(seats, province);
        this.middle.draw(sortedPop, popVote[province].total, sortedSeats, seats[province].total, party);
        this.middle.setText(this.text(popVote, seats, province, party));
    }
}
