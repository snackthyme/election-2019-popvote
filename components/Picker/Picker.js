import * as d3 from 'd3';
import { PROVINCES } from '../../constants';
import './Picker.scss';

export default class Picker {
    constructor(container, callback) {
        const picker = this;

        this.container = d3.select(container)
            .append('div')
            .classed('picker', true);

        this.container
            .selectAll('div.picker-choice')
            .data(Object.keys(PROVINCES))
            .join('div')
            .text(d => d)
            .classed('picker-choice', true)
            .on('click', function(d) {
                picker.container
                    .selectAll('div.picker-choice')
                    .classed('selected', false);

                d3.select(this)
                    .classed('selected', true);

                callback(PROVINCES[d]);
            });

        this.container
            .select('div.picker-choice')
            .classed('selected', true);
    }
}
