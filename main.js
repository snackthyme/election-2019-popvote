import * as d3 from 'd3';
import VoteDisplay from './components/VoteDisplay';
import './main.scss';

const loadData = async () => {
    const results = {};
    const popularVote = {};
    const seats = {};

    const tsv = await d3.tsv('./data/EventResultsValidated.txt');
    tsv.forEach(row => {
        if (!results[row.Province]) {
            results[row.Province] = {};
            popularVote[row.Province] = { total: 0 };
            seats[row.Province] = { total: 0 };
        }
        const province = results[row.Province];
        if (!province[row['Electoral district name']]) { province[row['Electoral district name']] = {}; }
        const riding = province[row['Electoral district name']];
        const votes = Number(row['Votes obtained']);
        riding[row['Political affiliation']] = votes;
        if (!popularVote[row.Province][row['Political affiliation']]) {
            popularVote[row.Province][row['Political affiliation']] = votes;
        } else {
            popularVote[row.Province][row['Political affiliation']] += votes;
        }
        popularVote[row.Province].total += votes;
    });

    Object.keys(results).forEach(province => {
        Object.keys(results[province]).forEach(ridingName => {
            const riding = results[province][ridingName];
            const voteTotals = Object.values(riding).map(Number);
            const winner = Object.keys(riding).find(party => Number(riding[party]) === Math.max(...voteTotals));
            if (!seats[province][winner]) {
                seats[province][winner] = 1;
            } else {
                seats[province][winner] += 1;
            }
            seats[province].total += 1;
        });
    });

    return { results, popularVote, seats };
};

(async () => {
    const { results, popularVote, seats } = await loadData();
    const province = 'Alberta';
    const party = 'Liberal';

    const display = new VoteDisplay('#viz');
    display.draw(popularVote, seats, province);
    display.drawLines(popularVote, seats, province, party);

    window.addEventListener('resize', () => {
        display.draw(popularVote, seats, province);
        display.drawLines(popularVote, seats, province, party);
    });
})();
