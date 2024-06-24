let geojson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                name: "Living Room",
                category: "room",
                area: 300,
                capacity: 10,
                entrances: [{ name: "Main Entrance", coordinates: [200, 50] }],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [0, 0],
                        [200, 0],
                        [200, 150],
                        [0, 150],
                        [0, 0],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Kitchen",
                category: "room",
                area: 150,
                capacity: 5,
                entrances: [
                    { name: "Kitchen Entrance", coordinates: [210, 70] },
                ],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [210, 0],
                        [310, 0],
                        [310, 100],
                        [210, 100],
                        [210, 0],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Bedroom 1",
                category: "room",
                area: 200,
                capacity: 8,
                entrances: [
                    { name: "Bedroom Entrance", coordinates: [50, 160] },
                ],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [0, 160],
                        [200, 160],
                        [200, 310],
                        [0, 310],
                        [0, 160],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Bedroom 2",
                category: "room",
                area: 180,
                capacity: 7,
                entrances: [
                    { name: "Bedroom Entrance", coordinates: [210, 140] },
                ],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [210, 110],
                        [380, 110],
                        [380, 250],
                        [210, 250],
                        [210, 110],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Bathroom",
                category: "room",
                area: 50,
                capacity: 2,
                entrances: [
                    { name: "Bathroom Entrance", coordinates: [210, 280] },
                ],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [210, 260],
                        [300, 260],
                        [300, 310],
                        [210, 310],
                        [210, 260],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Corridor A",
                category: "pathway",
                capacity: 2,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [200, 0],
                        [210, 0],
                        [210, 310],
                        [200, 310],
                        [200, 0],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Corridor B",
                category: "pathway",
                capacity: 2,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [0, 150],
                        [0, 160],
                        [200, 160],
                        [200, 150],
                        [0, 150],
                    ],
                ],
            },
        },
    ],
};
module.exports = geojson;
