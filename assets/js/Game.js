class Game extends GameBase { //A renommer ?
    constructor(canvas, fullscreen = true) {
        super(canvas, fullscreen)

        this.init();
    }

    init() {
        this.resize();

        this.initEvent();

        this.mousePressed = false;

        this.vertexSource = null;
        this.vertexTarget = null;

        this.mouseCount = 0;

        /*--------------------------------*/

        this.graph = new Graph();

        this.vertexRadius = 10;

        /*---------Draw settings----------*/
        this.FPS = 15;
        this.prevTick = 0;
        this.draw();
        /*--------------------------------*/

        this.generateGraph(); //Init map
    }

    initEvent() {
        this.canvas.onmousedown = (e) => {
            // this.mousePressed = true;
            this.mouseAction(e, this.mouseCount);
            this.mouseCount++;
            if (this.mouseCount > 1) this.mouseCount = 0;
        };

        // this.canvas.onmouseup = (e) => {
        //     this.mousePressed = false;
        //     this.mouseAction(e, 1);
        // };

        // this.canvas.onmousemove = (e) => {
        //     let coord = MouseControl.getMousePos(this.canvas, e);

        //     if (this.vertexSource) this.displayConstructEdge(this.vertexSource, coord.x, coord.y);
        // };


        window.onresize = (e) => {
            this.resize();
        };
    }

    mouseAction(e, state) {
        // console.log(e.which);
        let coord = MouseControl.getMousePos(this.canvas, e);

        // console.log(state + " : " + coord.x + " " + coord.y);

        if (e.which == 1) {
            if (state == 0) {
                this.vertexSource = this.selectVertex(coord.x, coord.y);
                if (this.vertexSource) this.vertexSource.selected = 1;
                else {
                    let id = Object.keys(this.graph.vertexes).length + 1;
                    this.graph.addLine(id);
                    this.graph.vertexes[id].setCoords(coord.x, coord.y);
                    this.mouseCount = -1;
                }
            } else if (state == 1) {
                this.vertexTarget = this.selectVertex(coord.x, coord.y);

                if (this.vertexSource) {
                    if (this.vertexTarget) { //New edge
                        this.graph.addLine(this.vertexSource.id, this.vertexTarget.id, this.dist(this.vertexSource.x, this.vertexSource.y, this.vertexTarget.x, this.vertexTarget.y), true);
                    } else if (!this.vertexTarget) { //Move source
                        this.vertexSource.setCoords(coord.x, coord.y);

                        this.vertexSource.refreshPonderation(); //refresh ponderation
                        this.vertexSource.neighbours.forEach(edge => {
                            edge.target.refreshPonderation();
                        });
                    }
                    this.vertexSource.selected = 0;
                }

                this.vertexSource = null; //reset
                this.vertexTarget = null;

                // console.log("--------------------------");
                // console.log(this.graph);
            }
        } else if (e.which == 3) {
            if (state == 0) {
                console.log(1);
                this.vertexSource = this.selectVertex(coord.x, coord.y);
                if (!this.vertexSource) {
                    this.mouseCount = 0;
                } else {
                    this.vertexSource.selected = 2;
                }
            } else if (state == 1) {
                this.vertexTarget = this.selectVertex(coord.x, coord.y);
                console.log(2);
                console.log("Source");
                console.log(this.vertexSource);
                console.log("Target");
                console.log(this.vertexTarget);

                if (this.vertexSource && this.vertexTarget) {
                    this.vertexSource.selected = 0;
                    this.graph.calculatePath(this.vertexSource, this.vertexTarget);
                }

                this.vertexSource = null; //reset
                this.vertexTarget = null;
            }
        }
    }

    selectVertex(x, y) {
        for (let idVertex in this.graph.vertexes) {
            let vertex = this.graph.vertexes[idVertex];

            if (vertex.x != -1 && vertex.y != -1 && this.checkVertexCollision(x, y, vertex)) {
                return vertex;
            }
        }
        return null;
    }

    checkVertexCollision(x, y, vertex) {
        return this.dist(x, y, vertex.x, vertex.y) <= this.vertexRadius ? true : false;
    }

    dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    generateGraph() {
        let points = [];

        // Utiliser la bibliothèque Voronoi.js pour construire le diagramme
        for (let i = 0; i < 200; i++) {
            const x = parseInt(this.getRandomInt(-0.5 * this.canvas.width, 1.5 * this.canvas.width));
            const y = parseInt(this.getRandomInt(-0.5 * this.canvas.height, 1.5 * this.canvas.height));
            points.push({ x, y });
        }

        const voronoi = new Voronoi();
        const bbox = { xl: -0.5 * this.canvas.width, xr: 1.5 * this.canvas.width, yt: -0.5 * this.canvas.height, yb: 1.5 * this.canvas.height };
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

    getRandomInt(min, max) {
        return min + Math.random() * (max - min);
    }

    draw() {
        /*------------------------------FPS-----------------------------*/
        window.requestAnimationFrame(() => this.draw());

        let now = Math.round(this.FPS * Date.now() / 1000);
        if (now == this.prevTick) return;
        this.prevTick = now;
        /*--------------------------------------------------------------*/

        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.width);
        this.ctx.fillStyle = "rgb(240,240,240)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.displayEdges();
        this.displayVertexes();
    }

    displayConstructEdge(vertexSource, x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(vertexSource.x, vertexSource.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    displayEdges() {
        for (let idVertex in this.graph.vertexes) {
            this.graph.vertexes[idVertex].displayEdge(this.ctx, this.vertexRadius);
        }
    }

    displayVertexes() {
        for (let idVertex in this.graph.vertexes) {
            this.graph.vertexes[idVertex].display(this.ctx, this.vertexRadius, false);
        }
    }
}