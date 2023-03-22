const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Définir les points pour la construction du diagramme de Voronoi
const points = [];
// for (let i = 0; i < 100; i++) {
//     const x = Math.floor(Math.random() * canvas.width);
//     const y = Math.floor(Math.random() * canvas.height);
//     points.push({ x, y });
// }

canvas.onmousedown = (e) => {
    let coord = MouseControl.getMousePos(canvas, e);

    let x = coord.x;
    let y = coord.y;

    points.push({ x, y });

    createDiagram();
};


function createDiagram() {
    // Utiliser la bibliothèque Voronoi.js pour construire le diagramme
    const voronoi = new Voronoi();
    const bbox = { xl: 0, xr: canvas.width, yt: 0, yb: canvas.height };
    const diagram = voronoi.compute(points, bbox);

    // Dessiner les cellules du diagramme
    for (let cell of diagram.cells) { //Each cell !
        context.beginPath();
        context.moveTo(cell.halfedges[0].getStartpoint().x, cell.halfedges[0].getStartpoint().y);

        // let randomVal = Math.random() * 255;
        // context.fillStyle = `rgb(${randomVal}, ${randomVal}, ${randomVal})`;
        context.fillStyle = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;

        for (let i = 0; i < cell.halfedges.length; i++) {
            const edge = cell.halfedges[i];
            console.log(`x : ${parseInt(edge.getEndpoint().x)} | y : ${parseInt(edge.getEndpoint().y)}`);
            context.lineTo(parseInt(edge.getEndpoint().x), parseInt(edge.getEndpoint().y)); //Each vertex !!
        }
        context.closePath();
        context.stroke();
        context.fill();
    }

    context.fillStyle = "black";
    // Dessiner les points du diagramme
    for (let point of points) {
        context.beginPath();
        context.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        context.fill();
    }
}