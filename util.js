export const xAccessor = (d, total, rect, data) => {
    if (!d) { return 0; }
    const partyIndex = data.findIndex(([p, _]) => p === d[0]);
    const prevData = data.slice(0, partyIndex);
    const prevOffset = prevData.reduce((acc, [_, val]) => acc + val, 0);
    return rect.width * prevOffset / total;
};

export const widthAccessor = (d, total, rect) => {
    if (!d) { return 0; }
    return rect.width * d[1] / total;
};
