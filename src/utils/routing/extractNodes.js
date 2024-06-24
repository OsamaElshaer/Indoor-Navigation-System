function extractNodes(geojson) {
    const nodes = {};

    geojson.features.forEach((feature) => {
        const properties = feature.properties;
        if (properties.entrances) {
            properties.entrances.forEach((entrance) => {
                const nodeName = `${properties.name}_${entrance.name}`;
                nodes[nodeName] = {
                    coordinates: entrance.coordinates,
                };
            });
        }
    });

    return nodes;
}
module.exports = extractNodes;
