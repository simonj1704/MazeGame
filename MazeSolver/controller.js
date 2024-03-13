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
        document.querySelector("#generate").addEventListener("click", this.newMaze.bind(this));
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
    }

    gridHeight = 4;
    gridWidth = 4;
    startPos = {"row": 0, "col": 0};
    goal = {"row": 2, "col": 3};

    json = {
        "rows": 4,
        "cols": 4,
        "start": {"row": 0, "col": 0},
        "goal": {"row": 2, "col": 3},
        "maze":
        [
          [{"row":0,"col":0,"north":true,"east":true,"west":true,"south":false},
           {"row":0,"col":1,"north":true,"east":false,"west":true,"south":false},
           {"row":0,"col":2,"north":true,"east":false,"west":false,"south":true},
           {"row":0,"col":3,"north":true,"east":true,"west":false,"south":false}],
          [{"row":1,"col":0,"north":false,"east":false,"west":true,"south":true},
           {"row":1,"col":1,"north":false,"east":true,"west":false,"south":true},
           {"row":1,"col":2,"north":true,"east":false,"west":true,"south":false},
           {"row":1,"col":3,"north":false,"east":true,"west":false,"south":true}],
          [{"row":2,"col":0,"north":true,"east":false,"west":true,"south":false},
           {"row":2,"col":1,"north":true,"east":true,"west":false,"south":true},
           {"row":2,"col":2,"north":false,"east":true,"west":true,"south":false},
           {"row":2,"col":3,"north":true,"east":true,"west":true,"south":false}],
          [{"row":3,"col":0,"north":false,"east":false,"west":true,"south":true},
           {"row":3,"col":1,"north":true,"east":false,"west":false,"south":true},
           {"row":3,"col":2,"north":false,"east":false,"west":false,"south":true},
           {"row":3,"col":3,"north":false,"east":true,"west":false,"south":true}]
        ]
      };

    settings(json){
        this.model.model = json.maze;
        this.gridHeight = json.rows;
        this.gridWidth = json.cols;
        this.start = json.start;
        this.goal = json.goal;
    }
}