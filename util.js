export const xAccessor = (d, total, rect, data) => {
    const prevData = data.slice(0, data.findIndex(([p, _]) => p === d[0]));
    const prevOffset = prevData.reduce((acc, [_, val]) => acc + val, 0);
    return rect.width * prevOffset / total;
};

export const widthAccessor = (d, total, rect) => {
    return rect.width * d[1] / total;
};
