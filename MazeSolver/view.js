"use strict";


export default class View {
    constructor(controller){
        this.controller = controller
    }

    gridheight = 4;
    gridwidth = 4;

    setSize(height, width){
        this.gridheight = height;
        this.gridwidth = width;
        this.createView();
    }

    createView(){
        const board = document.querySelector("#board");
        board.style.setProperty("--GRID_WIDTH", this.gridwidth);
        for(let row = 0; row < this.gridheight; row++){
            for(let col = 0; col < this.gridwidth; col++){
                const cell = document.createElement("div");
                cell.classList.add("cell");
                board.appendChild(cell);
            }
        }
    }

    displayBoard(model){
        const cells = document.querySelectorAll("#board .cell");
        for (let i = 0; i < cells.length; i++){
            let row = Math.floor(i / this.gridwidth);
            let col = i % this.gridwidth;
            const modelCell = model[i];
            const cell = cells[i];

            if (modelCell.visited){
                cell.classList.add("visited");
            }
            const ways = ["north", "east", "south", "west"];
            for (let way of ways){
                if(modelCell[way]){
                    cell.classList.remove(way);
                } else {
                    cell.classList.add(way);
                }
            }
        }
    }

    displayStart(start){
        const cells = document.querySelectorAll("#board .cell");
        const cell = cells[start.row * this.gridwidth + start.col];
        cell.classList.add("start");
    }

    displayGoal(goal){
        const cells = document.querySelectorAll("#board .cell");
        const cell = cells[goal.row * this.gridwidth + goal.col];
        cell.classList.add("end");
    }

    deadends = [];

    showRoute(route, deadends){
        this.deadends = deadends;
        console.log(deadends)
        route.forEach((cell, index) => {
            setTimeout(() => {
                this.addClass(cell);
            }, (index + 1) * 200); 
        });
    }
    

    addClass(cell){
        const cells = document.querySelectorAll("#board .cell");
        const cell1 = cells[cell.row * this.gridwidth + cell.col];
        if(cell1.classList.contains("visited") && this.deadends.includes(cell)){
            //cell1.classList.remove("visited");
            //cell1.classList.add("dead-end")
        } else {
            cell1.classList.add("visited");
        }
    }
}