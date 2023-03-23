class Area {
    static CITY = 0;
    static TOWN = 1;
    static HAMLET = 2;

    constructor(x, y, type, radius, density, libertyArea) {
        this.type = type;
        this.radius = radius;
        this.density = density;

        this.libertyArea = libertyArea;

        this.x = x;
        this.y = y;

        this.area = parseInt(Math.PI * radius * radius);

        this.nbPointMax = parseInt(this.area * density);
    }
}