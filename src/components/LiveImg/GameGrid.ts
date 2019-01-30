import Vector from "../Vector/Vector";

export default class GameGrid<T> {
   /** Размер сетки (размер массивов) */ 
   private size: Vector = null

   /** Реальные размеры сетки в пикселях */
   private realSize: Vector = null;

   /** Размеры ячейки в пикселях */
   private cellSize: Vector = null;

   private grid: T[][] = []; 

   constructor(gridSize: Vector, cellSize: Vector) { 
      this.realSize = gridSize.copy();
      this.cellSize = cellSize.copy();

      this.size = gridSize.unscale(cellSize);


      this.init();
   }

   private init() { 
      this.grid = new Array(this.size.x);
      
      for (let i = 0; i < this.size.x; i++) {
         this.grid[i] = new Array(this.size.y);
      }
   } 

}

