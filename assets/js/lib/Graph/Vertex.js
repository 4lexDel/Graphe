class Vertex {

    constructor(id, x = -1, y = -1) {
        this.id = id;

        this.neighbours = [];

        this.x = x;
        this.y = y;

        this.fCost = -1;

        this.parent = null;

        this.selected = false;
    }

    addNeighbour(target, ponderation) {
        this.neighbours.push(new EdgeInfo(target, ponderation));
    }

    refreshPonderation() {
        if (this.x != -1 && this.y != -1) {
            this.neighbours.forEach(edge => {
                let target = edge.target;

                if (target.x != -1 && target.y != -1) edge.ponderation = this.dist(this.x, this.y, target.x, target.y);
            });
        }
    }

    dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }

    /**------------Display part------------**/

    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }

    display(ctx, radius) {
        if (this.selected == 0) ctx.fillStyle = "white";
        else if (this.selected == 1) ctx.fillStyle = "#67D446";
        else if (this.selected == 2) ctx.fillStyle = "#F84738";
        else if (this.selected == 3) ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, radius, radius, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.font = radius + "px serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillText(this.id, this.x, this.y);
    }

    displayEdge(ctx, radius) {
        if (this.x != -1 && this.y != -1) {
            this.neighbours.forEach(edge => {
                let target = edge.target;

                if (target.x != -1 && target.y != -1) {
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(target.x, target.y);
                    ctx.stroke();

                    ctx.font = radius / 1.5 + "px serif";
                    ctx.fillStyle = "red";
                    ctx.textAlign = "center";
                    ctx.textBaseline = 'middle';
                    ctx.fillText(parseInt(edge.ponderation), this.x - ((this.x - target.x) / 2), this.y - ((this.y - target.y) / 2));
                }
            });
        }
    }
}