"use strict";

import Generator from "../MazeGenerator/generator.js";

export default class Model {
  constructor() {
    this.generator = new Generator();
  }


    route = [];
    visitedCells = [];
    deadends = [];
    width = 0;
    height = 0;
    goal = {};

    setVisitedCells(){
        for (let cell of this.model){
            cell.visited = false;
        }
    }

    run = true;

  depthFirstSearch(cell) {
    console.log(cell)
    if(cell == this.goal){
        console.log("goal")
        console.log(this.route)
        this.run = false;
        return;
    }
    
    if (cell.visited) {
        this.deadends.push(cell)
        console.log("visited")
        return;
    }

    cell.visited = true;
    
    this.checkDirection(cell)

    return;
  }

  checkDirection(cell){
    let next;
    if (!cell.east) {
        if(!this.run){
            return
        }
        next = this.getCell(cell.row, cell.col + 1);
          this.route.push(next);
        this.depthFirstSearch(next);
      }
      if (!cell.south) {
        if(!this.run){
            return
        }
        next = this.getCell(cell.row + 1, cell.col);
          this.route.push(next);
        this.depthFirstSearch(next);
      }
      if (!cell.west) {
        if(!this.run){
            return
        }
        next = this.getCell(cell.row, cell.col - 1);
          this.route.push(next);
          this.depthFirstSearch(next);
      }
      if (!cell.north) {
        if(!this.run){
            return
        }
        next = this.getCell(cell.row - 1, cell.col);
          this.route.push(next);
          this.depthFirstSearch(next);
      }
  }
  
  searchStep(cell){
    let next;
    if (!cell.east) {
        next = this.getCell(cell.row, cell.col + 1);
        this.route.push(next);
    }
    if (!cell.south) {
        next = this.getCell(cell.row + 1, cell.col);
        this.route.push(next);
    }
    if (!cell.west) {
        next = this.getCell(cell.row, cell.col - 1);
        this.route.push(next);
    }
    if (!cell.north) {
        next = this.getCell(cell.row - 1, cell.col);
        this.route.push(next);
    }
  }

  step(cell){

    if(cell == this.goal){
        console.log("goal")
        console.log(this.route)
        return;
    }
    if (cell.visited) {
        cell = this.route.pop();
        console.log("visited")
        return;
    }
    cell.visited = true;
    this.route.push(cell);
    this.searchStep(cell);

  }

  visitCell(cell){
    cell.visited = true;
    if(cell == this.goal){
        console.log("goal")
        console.log(this.route)
        return;
    }
    let neighbours = this.getNeighbours(cell);
    while(neighbours.length > 0){

    }
  }

  model = {};

  getNeighbours(cell) {
    let neighbours = [];
    if (!cell.east) {
      neighbours.push(this.getCell(cell.row, cell.col + 1));
    }
    if (!cell.south) {
      neighbours.push(this.getCell(cell.row + 1, cell.col));
    }
    if (!cell.west) {
      neighbours.push(this.getCell(cell.row, cell.col - 1));
    }
    if (!cell.north) {
      neighbours.push(this.getCell(cell.row - 1, cell.col));
    }
    neighbours = neighbours.filter((neighbour) => !neighbour.visited);
    return neighbours;
  }

  getCell(row, col) {
    return this.model[row * this.width + col];
  }

  setGoal(row, col){
    this.goal = this.getCell(row, col);
  }

    goalFound(){
        console.log("goal found")
    }
}
