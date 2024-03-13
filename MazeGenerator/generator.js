    "use strict";

window.addEventListener("load", start);

import View from "./testView.js";

function start(){
    const gen = new Generator();
    const view = new View();
    gen.initMaze();
    view.displayBoard(gen.model);
    view.displayStart(gen.start);
    view.displayGoal(gen.goal);
    document.querySelector("#generate").addEventListener("click", () => {
        document.querySelector("#board").innerHTML = "";
        let height = document.querySelector("#rows").value;
        let width = document.querySelector("#cols").value;
        gen.initMaze2(height, width);

        view.setSize(height, width);
        view.displayBoard(gen.model);
        view.displayStart(gen.start);
        view.displayGoal(gen.goal);
    })
}



export default class Generator {
    constructor(){

    }

    initMaze(){
        this.createModel();
        this.createMazeDepthFirst();
        this.simpleGoal();
        this.simpleStart();
    }

    initMaze2(height, width){
        this.height = height;
        this.width = width;
        this.createModel();
        this.createMazeKruskal();
        this.simpleGoal();
        this.simpleStart();
    }

    initMaze3(height, width){
        this.height = height;
        this.width = width;
        this.createModel();
        this.createMazePrim();
        this.simpleGoal();
        this.simpleStart();
    }

    height = 4;
    width = 4;

    start = {"row": 0, "col": 0};
    goal = {"row": 2, "col": 3};

    maze = []
    model = []

    createModel(){
        this.model.splice(0, this.model.length);
        for(let row = 0; row < this.height; row++){
            for(let col = 0; col < this.width; col++){
                const cell = {
                    "row": row,
                    "col": col,
                    "north": true,
                    "east": true,
                    "west": true,
                    "south": true
                }
                this.model.push(cell);
            }
        }
    }

    getCell(row, col){
        return this.model[row * this.width + col];
    }

    getCellIndex(row, col){
        return row * this.width + col;
    }

    generateMazeDepthFirst(current){
        current.visited = true;

        //console.log(current);

        let x = current.row;
        let y = current.col;

        let neighbours = this.getNeighbors(current).filter(neighbour => !neighbour.visited);
        while(neighbours.length > 0){
            const neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];

            if(neighbour.row < x){
                current.north = false;
                neighbour.south = false;
            } else if (neighbour.row > x){
                current.south = false;
                neighbour.north = false;
            } else if (neighbour.col < y){
                current.west = false;
                neighbour.east = false;
            } else if (neighbour.col > y){
                current.east = false;
                neighbour.west = false;
            }

            this.generateMazeDepthFirst(neighbour);

            neighbours = neighbours.filter(node => !node.visited);
        }
    }

    createMazeDepthFirst(){
        console.log("Creating Maze Depth First")
        this.generateMazeDepthFirst(this.model[0]);
    }

    createMazeKruskal(){
        console.log("Creating Maze Kruskal")
        let edges = [];
        let sets = [];

        for(let i = 0; i < this.model.length; i++){
            sets.push([i]);
        }

        for(let i = 0; i < this.model.length; i++){
            const cell = this.model[i];
            if(cell.col > 0){
                edges.push([i, i - 1]);
            }
            if(cell.row > 0){
                edges.push([i, i - this.width]);
            }
        }

        while(sets.length > 1){
            const edge = edges[Math.floor(Math.random() * edges.length)];
            const set1 = sets.find(set => set.includes(edge[0]));
            const set2 = sets.find(set => set.includes(edge[1]));

            if(set1 !== set2){
                sets = sets.filter(set => set !== set1 && set !== set2);
                sets.push(set1.concat(set2));
                edges = edges.filter(e => e !== edge);
                const cell1 = this.model[edge[0]];
                const cell2 = this.model[edge[1]];

                if(cell1.col < cell2.col){
                    cell1.east = false;
                    cell2.west = false;
                } else if (cell1.col > cell2.col){
                    cell1.west = false;
                    cell2.east = false;
                } else if (cell1.row < cell2.row){
                    cell1.south = false;
                    cell2.north = false;
                } else if (cell1.row > cell2.row){
                    cell1.north = false;
                    cell2.south = false;
                }
            }
        }
    }

    createMazePrim() {
        console.log("Creating Maze Prim");
        let walls = [];
        let visited = [];
    
        for (let i = 0; i < this.model.length; i++) {
            visited.push(false);
        }
    
        //const start = this.model[Math.floor(Math.random() * this.model.length)];
        const start = this.model[0];
        visited[this.getCellIndex(start.row, start.col)] = true;
        let neighbours = this.getNeighbors(start).filter(neighbour => !visited[this.getCellIndex(neighbour.row, neighbour.col)])
        for (let neighbour of neighbours) {
            walls.push([start, neighbour]);
        }
         
        while (walls.length > 0) {
            const randomIndex = Math.floor(Math.random() * walls.length);
            const wall = walls[randomIndex];
            walls.splice(randomIndex, 1); // Remove the selected wall
            const cell1 = wall[0];
            const cell2 = wall[1];
            if(!visited[this.getCellIndex(cell2.row, cell2.col)]) {
            visited[this.getCellIndex(cell2.row, cell2.col)] = true;

            // Update the model with the removed walls
            if (cell1.row < cell2.row) {
                this.getCell(cell1.row, cell1.col).south = false;
                this.getCell(cell2.row, cell2.col).north = false;
            } else if (cell1.row > cell2.row) {
                this.getCell(cell1.row, cell1.col).north = false;
                this.getCell(cell2.row, cell2.col).south = false;
            } else if (cell1.col < cell2.col) {
                this.getCell(cell1.row, cell1.col).east = false;
                this.getCell(cell2.row, cell2.col).west = false;
            } else if (cell1.col > cell2.col) {
                this.getCell(cell1.row, cell1.col).west = false;
                this.getCell(cell2.row, cell2.col).east = false;
            }
    
            const newNeighbours = this.getNeighbors(cell2).filter(neighbour => !visited[this.getCellIndex(neighbour.row, neighbour.col)])
            for (let neighbour of newNeighbours) {
                walls.push([cell2, neighbour]);
            }
            
        }
            
        }
    }
    
    
    

    getNeighbors(cell){
        let neighbours = [];

        if(cell.row > 0){
            neighbours.push(this.getCell(cell.row - 1, cell.col));
        }
        if (cell.row < this.height - 1){
            neighbours.push(this.getCell(cell.row + 1, cell.col));
        }
        if(cell.col > 0){
            neighbours.push(this.getCell(cell.row, cell.col - 1));
        }
        if(cell.col < this.width - 1){
            neighbours.push(this.getCell(cell.row, cell.col + 1));
        }

        return neighbours;
    }

    createStart(){
        let row = Math.floor(Math.random() * this.height);
        let col = Math.floor(Math.random() * this.width);
        const start = {
            "row": row,
            "col": col
        }
        this.start = start;
    }

    simpleStart(){
        this.start = {"row": 0, "col": 0};
    }

    simpleGoal(){
        this.goal = {"row": this.height-1, "col": this.width-1};
    }

    createGoal(){
        let row = Math.floor(Math.random() * this.height);
        let col = Math.floor(Math.random() * this.width);
        while(row === this.start.row && col === this.start.col){
            row = Math.floor(Math.random() * this.height);
            col = Math.floor(Math.random() * this.width);
        }
        const goal = {
            "row": row,
            "col": col
        }
        this.goal = goal;
    }

    getJson(){
        const json = {
            "rows": this.height,
            "cols": this.width,
            "start": this.start,
            "goal": this.goal,
            "maze": this.model
        }
        return json;
    }
}