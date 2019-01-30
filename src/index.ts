import LiveImg from './components/LiveImg/LiveImg';

import 'normalize.css'
import './styles/index.sass';
import GameGrid, { IGameObjectForGrid } from './components/GameGrid/GameGrid';
import Vector from './components/Vector/Vector';
import LivePixel from './components/LiveImg/LivePixel';

const global = <any>window;

const container = document.querySelector('.live-img');
 
const liveImg = new LiveImg({
   width: 400,
   height: 250,
});

container.appendChild(liveImg.root);
 
console.log(liveImg.width, liveImg.height);

global.img = liveImg;

class Obj implements IGameObjectForGrid {
   public coordsInGrid: Vector;

   constructor(public coords: Vector = new Vector()) { 

   }
}

let grid = new GameGrid(new Vector(100, 60), new Vector(10, 10));

grid.add(new Obj(new Vector(1000, 5000)));

global.grid = grid;