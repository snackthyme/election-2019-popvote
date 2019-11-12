import * as d3 from 'd3';
import _ from 'lodash';
import { MAJOR_PARTIES, PARTY_ORDER } from '../constants';

export default class PartyBar {
    constructor(container) {
        this.container = container
            .append('svg')
            .classed('bar-svg', true);
    }

    static sortedData(data) {
        const groups = [];
        let otherTotal = 0;
        Object.entries(data).forEach(pair => {
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

    xAccessor(d, total, rect, data) {
        const prevData = data.slice(0, data.findIndex(([p, _]) => p === d[0]));
        const prevOffset = prevData.reduce((acc, [_, val]) => acc + val, 0);
        return rect.width * prevOffset / total;
    }

    widthAccessor(d, total, rect) {
        return rect.width * d[1] / total;
    }

    draw(data, province) {
        console.log(data, province);
        const sortedData = PartyBar.sortedData(data[province]);
        const total = data[province].total;
        const rect = this.container.node().getBoundingClientRect();
        
        const sections = this.container.selectAll('rect')
            .data(sortedData, ([party, _]) => party)
            .join('rect')
            .attr('x', d => this.xAccessor(d, total, rect, sortedData))
            .attr('y', 0)
            .attr('width', d => this.widthAccessor(d, total, rect))
            .attr('height', rect.height)
            .attr('fill', ([p, v]) => (MAJOR_PARTIES[p] || MAJOR_PARTIES.Other).colour);
    }
}
