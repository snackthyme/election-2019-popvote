import _ from 'lodash';
import { MAJOR_PARTIES } from '../constants';
import { xAccessor, widthAccessor } from '../util';

export default class PartyBar {
    constructor(container) {
        this.container = container
            .append('svg')
            .classed('bar-svg', true);
    }

    draw(data, total) {
        const rect = this.container.node().getBoundingClientRect();
        
        const sections = this.container.selectAll('rect')
            .data(data, ([party, _]) => party)
            .join('rect')
            .attr('x', d => xAccessor(d, total, rect, data))
            .attr('y', 0)
            .attr('width', d => widthAccessor(d, total, rect))
            .attr('height', rect.height)
            .attr('fill', ([p, v]) => (MAJOR_PARTIES[p] || MAJOR_PARTIES.Other).colour);
    }
}
