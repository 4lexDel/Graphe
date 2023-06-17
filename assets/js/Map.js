class Map {

    constructor(width, height) {
        this.areas = [];
        this.points = [];

        this.width = width;
        this.height = height;

        this.graph = new Graph();
    }

    generate() {
        this.generateAreas();

        this.generateGraph();

        return this.graph;
    }

    generateAreas() {
        let initAttempt = 10;

        let attempt = initAttempt;

        while (attempt >= 0) {
            let rx = parseInt(this.getRandomNumber(-0.5 * this.width, 1.5 * this.width));
            let ry = parseInt(this.getRandomNumber(-0.5 * this.height, 1.5 * this.height));
            let newCity = new Area(rx, ry, Area.CITY, 180, 0.0007, 120);
            if (this.isNewAreaAllowed(newCity)) this.areas.push(newCity);
            else attempt--;
        }

        attempt = initAttempt;
        while (attempt >= 0) {
            let rx = parseInt(this.getRandomNumber(-0.5 * this.width, 1.5 * this.width));
            let ry = parseInt(this.getRandomNumber(-0.5 * this.height, 1.5 * this.height));
            let newTown = new Area(rx, ry, Area.TOWN, 60, 0.0009, 80);
            if (this.isNewAreaAllowed(newTown)) this.areas.push(newTown);
            else attempt--;
        }
        attempt = initAttempt;
        while (attempt >= 0) {
            let rx = parseInt(this.getRandomNumber(-0.5 * this.width, 1.5 * this.width));
            let ry = parseInt(this.getRandomNumber(-0.5 * this.height, 1.5 * this.height));
            let newHamlet = new Area(rx, ry, Area.HAMLET, 10, 0.0008, 50);
            if (this.isNewAreaAllowed(newHamlet)) this.areas.push(newHamlet);
            else attempt--;
        }
    }

    isNewAreaAllowed(newArea) {
        let result = true;
        this.areas.forEach(area => {
            if (this.dist(area.x, area.y, newArea.x, newArea.y) <= newArea.radius + area.radius + newArea.libertyArea) {
                result = false;
                return;
            }
        });
        return result;
    }

    dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    generateGraph() {
        let points = [];

        this.areas.forEach(area => {
            for (let i = 0; i < area.nbPointMax; i++) {
                let r = parseInt(this.getRandomNumber(0, area.radius));
                let alpha = this.getRandomNumber(0, 2 * Math.PI);
                let x = parseInt(area.x + r * Math.cos(alpha));
                let y = parseInt(area.y + r * Math.sin(alpha));
                points.push({ x, y });
            }
        });

        // for (let i = 0; i < 200; i++) {
        //     const x = parseInt(this.getRandomNumber(-0.5 * this.width, 1.5 * this.width));
        //     const y = parseInt(this.getRandomNumber(-0.5 * this.height, 1.5 * this.height));
        //     points.push({ x, y });
        // }

        // console.log(points);

        const voronoi = new Voronoi();
        const bbox = { xl: -1.5 * this.width, xr: 2.5 * this.width, yt: -1.5 * this.height, yb: 2.5 * this.height };
        const diagram = voronoi.compute(points, bbox);

        // Dessiner les cellules du diagramme
        for (let cell of diagram.cells) { //Each cell !
            let firstNode = { x: parseInt(cell.halfedges[0].getStartpoint().x), y: parseInt(cell.halfedges[0].getStartpoint().y) };
            let firstNodeId = `${firstNode.x}-${firstNode.y}`;

            this.graph.addLine(firstNodeId);

            let firstVertex = this.graph.vertexes[firstNodeId];

            if (firstVertex.x == -1 && firstVertex.y == -1) {
                this.graph.vertexes[firstNodeId].setCoords(firstNode.x, firstNode.y);
            }

            for (let i = 0; i < cell.halfedges.length - 1; i++) {
                const currentEdge = cell.halfedges[i];
                const nextEdge = cell.halfedges[i + 1];

                let currentNode = { x: parseInt(currentEdge.getEndpoint().x), y: parseInt(currentEdge.getEndpoint().y) };
                let currentNodeId = `${currentNode.x}-${currentNode.y}`;

                let nextNode = { x: parseInt(nextEdge.getEndpoint().x), y: parseInt(nextEdge.getEndpoint().y) };
                let nextNodeId = `${nextNode.x}-${nextNode.y}`;

                this.graph.addLine(currentNodeId, nextNodeId, this.dist(currentNode.x, currentNode.y, nextNode.x, nextNode.y), true);

                let currentVertex = this.graph.vertexes[currentNodeId];

                if (currentVertex.x == -1 && currentVertex.y == -1) {
                    this.graph.vertexes[currentNodeId].setCoords(currentNode.x, currentNode.y);
                }

                let nextVertex = this.graph.vertexes[nextNodeId];

                if (nextVertex.x == -1 && nextVertex.y == -1) {
                    this.graph.vertexes[nextNodeId].setCoords(nextNode.x, nextNode.y);
                }
            }

            const lastEdge = cell.halfedges[cell.halfedges.length - 1];
            let lastNode = { x: parseInt(lastEdge.getEndpoint().x), y: parseInt(lastEdge.getEndpoint().y) };
            let lastNodeId = `${lastNode.x}-${lastNode.y}`;

            this.graph.addLine(firstNodeId, lastNodeId, this.dist(firstNode.x, firstNode.y, lastNode.x, lastNode.y), true);
        }
    }

    getRandomNumber(min, max) {
        return min + Math.random() * (max - min);
    }
}