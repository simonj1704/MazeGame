"use strict";

import Model from "./model.js";
import View from "./view.js";
import Generator from "../MazeGenerator/generator.js";


window.addEventListener("load", start);

function start(){
    const controller = new Controller();
    controller.start();
}

export default class Controller {
    constructor(){
        this.generator = new Generator()
        this.model = new Model();
        this.view = new View(this);
    }

    start(){
        this.newMaze();
        document.querySelector("#generate").addEventListener("click", this.newMaze.bind(this));
        document.querySelector("#solve").addEventListener("click", this.automaticSolve.bind(this));
        
    }
    
    next = {
        row: 0,
        col: 0
    };

    solve(){
        this.model.setVisitedCells();
        let cell = this.model.getCell(this.next.row, this.next.col);
        this.tick(cell);
        this.view.displayBoard(this.model.model);
    }

    tick(cell){
        if(cell == this.goal){
            console.log("goal")
            return;
        }
        if (cell.visited) {
            this.next = this.model.route.pop();
            return;
        }
        cell.visited = true;
        const neighbours = this.model.getNeighbours(cell);
    
        console.log(neighbours)
        this.next = neighbours[0];
    }

    showRoute(){
        console.log(this.model.deadends)
        this.view.showRoute(this.model.route, this.model.deadends)
    }

    automaticSolve(){
        this.model.run = true;
        let cell = this.model.getCell(this.startPos.row, this.startPos.col);
        this.model.route.push(cell);
        this.model.depthFirstSearch(cell);
        this.showRoute();
    }

    newMaze(){
        document.querySelector("#board").innerHTML = "";
        let height = document.querySelector("#rows").value;
        let width = document.querySelector("#cols").value;
        this.generator.initMaze2(height, width);
        this.settings(this.generator.getJson());
        this.view.setSize(height, width);
        this.view.displayBoard(this.generator.model);
        this.view.displayStart(this.generator.start);
        this.view.displayGoal(this.generator.goal);
        this.model.setGoal(this.goal.row, this.goal.col);
        console.log(this.model.model)
    }

    gridHeight = 0;
    gridWidth = 0;
    startPos = {};
    goal = {};

    json = {};

    settings(json){
        this.json = json;
        this.model.model = json.maze;
        this.gridHeight = json.rows;
        this.gridWidth = json.cols;
        this.model.width = json.cols;
        this.model.height = json.rows;
        this.startPos = json.start;
        this.goal = json.goal;
    }

    getSolution(){
        this.model
    }
}