import { xAccessor, widthAccessor } from '../util';

export default class Tracer {
    constructor(container) {
        this.container = container.append('svg');

        this.leftLine = this.container.append('line');
        this.rightLine = this.container.append('line');
    }

    draw(popVote, popTotal, seats, seatsTotal, party) {
        const rect = this.container.node().getBoundingClientRect();
        console.log(popVote, seats);
        // first line goes from topX to bottomX
        // second line goes from topX + topWidth to bottomX + bottomWidth
        // ignore Other
        const partyVote = popVote.find(([p, _]) => p === party);
        const partySeats = seats.find(([p, _]) => p === party);

        const topX = xAccessor(partyVote, popTotal, rect, popVote);
        const bottomX = xAccessor(partySeats, seatsTotal, rect, seats);
        const topWidth = widthAccessor(partyVote, popTotal, rect);
        const bottomWidth = widthAccessor(partySeats, seatsTotal, rect);

        this.leftLine
            .attr('x1', topX)
            .attr('y1', 0)
            .attr('x2', bottomX)
            .attr('y2', rect.height)
            .style('stroke', 'black');

        this.rightLine
            .attr('x1', topX + topWidth)
            .attr('y1', 0)
            .attr('x2', bottomX + bottomWidth)
            .attr('y2', rect.height)
            .style('stroke', 'black');
    }
}
