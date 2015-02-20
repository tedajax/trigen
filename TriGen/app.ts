class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    distance(other: Point) {
        return Math.sqrt(((other.x - this.x) * (other.x - this.x)) + ((other.y - this.y) * (other.y - this.y)));
    }

    render(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, 4, 0, 2 * Math.PI, false);
        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.stroke();
    }
}

class Edge {
    index1: number;
    index2: number;

    constructor(i1, i2) {
        this.index1 = i1;
        this.index2 = i2;
    }

    render(points: Array<Point>, context: CanvasRenderingContext2D) {
        var p1 = points[this.index1];
        var p2 = points[this.index2];

        context.lineWidth = 1;
        context.strokeStyle = "black";
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.stroke();
    }
}

class World {
    width: number;
    height: number;
    points: Array<Point>;
    edges: Array<Edge>;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.points = [];
        this.edges = [];
    }

    clearPoints() {
        this.clearEdges();
        this.points.length = 0;
    }

    clearEdges() {
        this.edges.length = 0;
    }

    addPoint(p: Point) {
        this.points.push(p);
    }

    addEdge(i1: number, i2: number) {
        this.edges.push(new Edge(i1, i2));
    }

    connect(i1: number, i2: number) {
        this.edges.push(new Edge(i1, i2));
    }

    triangulate() {
        var seed: Point = this.points[0];
        this.points.sort((a, b) => {
            return a.distance(seed) - b.distance(seed);
        });
        for (var i = 0, len = this.points.length; i < len - 1; ++i) {
            this.addEdge(i, i + 1);
        }
    }

    render(context: CanvasRenderingContext2D) {
        this.points.forEach(p => {
            p.render(context);
        });

        this.edges.forEach(e => {
            e.render(this.points, context);
        });
    }
}

class App {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    world: World;

    constructor() { }
}

var app: App = new App();

window.onload = () => {
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    var context = canvas.getContext("2d");

    app.canvas = canvas;
    app.context = context;
    app.world = new World(canvas.width, canvas.height);

    for (var i = 0; i < 10; ++i) {
        var x = Math.floor(Math.random() * app.world.width);
        var y = Math.floor(Math.random() * app.world.height);
        app.world.addPoint(new Point(x, y));
    }

    app.world.triangulate();
    
    app.world.render(app.context);
};