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

        this.vertexRadius = 30;

        /*---------Draw settings----------*/
        this.FPS = 15;
        this.prevTick = 0;
        this.draw();
        /*--------------------------------*/
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
        let coord = MouseControl.getMousePos(this.canvas, e);

        // console.log(state + " : " + coord.x + " " + coord.y);

        if (state == 0) {
            this.vertexSource = this.selectVertex(coord.x, coord.y);
            if (this.vertexSource) this.vertexSource.selected = true;
        } else if (state == 1) {
            this.vertexTarget = this.selectVertex(coord.x, coord.y);

            if (!this.vertexSource && !this.vertexTarget) { //Drag and drop dans le vide
                let id = Object.keys(this.graph.vertexes).length + 1;
                this.graph.addLine(id);
                this.graph.vertexes[id].setCoords(coord.x, coord.y);
            } else if (this.vertexSource) {
                if (this.vertexTarget) { //New edge
                    this.graph.addLine(this.vertexSource.id, this.vertexTarget.id, this.dist(this.vertexSource.x, this.vertexSource.y, this.vertexTarget.x, this.vertexTarget.y), true);
                } else if (!this.vertexTarget) { //Move source
                    this.vertexSource.setCoords(coord.x, coord.y);

                    this.vertexSource.refreshPonderation(); //refresh ponderation
                    this.vertexSource.neighbours.forEach(edge => {
                        edge.target.refreshPonderation();
                    });
                }
                this.vertexSource.selected = false;
            }

            this.vertexSource = null; //reset
            this.vertexTarget = null;

            console.log("--------------------------");
            console.log(this.graph);
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
            this.graph.vertexes[idVertex].display(this.ctx, this.vertexRadius);
        }
    }
}