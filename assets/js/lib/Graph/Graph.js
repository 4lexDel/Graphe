class Graph {

    constructor() {
        this.vertexes = {};

        this.openList = [];
        this.closeList = [];

        this.pathList = [];

        this.currentNode = null;
    }

    addLine(idSource, idTarget = null, ponderation = 0, bidirectional = false) {
        if (!idSource) return; //Null value

        if (!this.vertexes[idSource]) this.vertexes[idSource] = new Vertex(idSource); //Create vertex source

        if (idTarget) { //Create edge if not null
            if (!this.vertexes[idTarget]) this.vertexes[idTarget] = new Vertex(idTarget); //Create vertex target

            this.vertexes[idSource].addNeighbour(this.vertexes[idTarget], ponderation);

            if (bidirectional && idSource != idTarget) this.vertexes[idTarget].addNeighbour(this.vertexes[idSource], ponderation); //Two-way edge
        }

        this.resetAllNode();
    }

    calculatePath(sourceNode, targetNode) {
        this.openList = [];
        this.closeList = []; //reset
        this.pathList = [];

        this.resetAllNode();

        if (sourceNode == targetNode) return false; //already finish

        let finish = false;

        sourceNode.fCost = 0; //SANS LA FONCTION HEURISTIQUE
        this.openList.push(sourceNode);

        while (!finish) {
            let currentNode = this.getNodeWithLowestCost();

            if (!currentNode) return false;

            this.removeNodeFromOpenList(currentNode); //Remove to openlist
            this.closeList.push(currentNode); //add to closelist

            if (currentNode.id == targetNode.id) {
                this.pathList.push(currentNode);

                currentNode.selected = 3;
                while (currentNode.parent) {
                    currentNode = currentNode.parent;
                    currentNode.selected = 3;
                    this.pathList.unshift(currentNode);
                }
                console.log("PATH");
                console.log(this.pathList);

                return true; //GET THE PATH
            }

            currentNode.neighbours.forEach(neighbour => {
                if (!this.isInCloseList(neighbour.target)) {

                    if (neighbour.target.fCost < currentNode.fCost || !this.isInOpenList(neighbour.target)) {
                        //set fCost
                        neighbour.target.fCost = currentNode.fCost + neighbour.ponderation;
                        //set parent
                        neighbour.target.parent = currentNode;

                        if (!this.isInOpenList(neighbour.target)) this.openList.push(neighbour.target);
                    }
                }
            });
        }
    }

    resetAllNode() {
        for (let idVertex in this.vertexes) {
            const vertex = this.vertexes[idVertex];

            vertex.fCost = -1;
            vertex.parent = null;
            vertex.selected = 0;
        }
    }

    removeNodeFromOpenList(nodeToDelete) {
        this.openList = this.openList.filter((node) => node.id != nodeToDelete.id);
    }

    isInCloseList(nodeToFind) {
        return this.closeList.find((node) => node.id == nodeToFind.id) != undefined ? true : false;
    }

    isInOpenList(nodeToFind) {
        return this.openList.find((node) => node.id == nodeToFind.id) != undefined ? true : false;
    }

    getNodeWithLowestCost() { //use sort
        let resultNode = null;
        if (this.openList.length > 0) {
            let fCostMin = this.openList[0].fCost;
            resultNode = this.openList[0];

            this.openList.forEach(node => {
                if (node.fCost != -1 && node.fCost < fCostMin) {
                    resultNode = node;
                    fCostMin = node.fCost;
                }
            });
        }
        return resultNode;
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