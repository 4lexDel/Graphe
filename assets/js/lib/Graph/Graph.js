class Graph {

    constructor() {
        this.vertexes = {};
    }

    addLine(idSource, idTarget = null, ponderation = 0, bidirectional = false) {
        if (!idSource) return; //Null value

        if (!this.vertexes[idSource]) this.vertexes[idSource] = new Vertex(idSource); //Create vertex source

        if (idTarget) { //Create edge if not null
            if (!this.vertexes[idTarget]) this.vertexes[idTarget] = new Vertex(idTarget); //Create vertex target

            this.vertexes[idSource].addNeighbour(this.vertexes[idTarget], ponderation);

            if (bidirectional && idSource != idTarget) this.vertexes[idTarget].addNeighbour(this.vertexes[idSource], ponderation); //Two-way edge
        }
    }

    calculatePath(source, target) {

    }
}


//Graph expectation
/*

VOC : 
- Vertex
- Line
_ Neighbour
 
INIT

let graph = new Graph();        //Mode ? => ponderation | oriented

graph.addLine("a", "b", 40, true);         //id source [string] | id target [string] (default = null) | ponderation [int] (default = 0) | two-way [boolean] (default = true)


graph.calculatePath()       //Mode [int]   
*/