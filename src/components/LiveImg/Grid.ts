import Vector from "../Vector/Vector";

export default class Grid<T> {
   /** Размер сетки (размер массивов) */ 
   private size: Vector = null

   /** Реальные размеры сетки в пикселях */
   private realSize: Vector = null;

   /** Размеры ячейки в пикселях */
   private cellSize: Vector = null;

   private grid: T[] = []; 

   constructor(gridSize: Vector, cellSize: Vector) { 
      this.realSize = gridSize.copy();
      this.cellSize = cellSize.copy();

      this.init();
   }

   private init() { 

   } 
}