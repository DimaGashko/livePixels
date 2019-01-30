import Vector from "../Vector/Vector";

interface IObject {
   coords: Vector;
   coordsInGrid: Vector;
}

export default class GameGrid<T extends IObject> {
   /** Размер сетки (размер массивов) */ 
   private size: Vector = null

   /** Реальные размеры сетки в пикселях */
   private realSize: Vector = null;

   /** Размеры ячейки в пикселях */
   private cellSize: Vector = null;

   private grid: T[][][] = []; 

   constructor(gridSize: Vector, cellSize: Vector) { 
      this.realSize = gridSize.copy();
      this.cellSize = cellSize.copy();

      this.size = gridSize.unscale(cellSize);


      this.init();
   }

   public add(object: T) { 
      const coords = this.getCoordsInGrid(object.coords);
      const prev = object.coordsInGrid;

      // Объект уже находится в сетке
      if (prev) { 

         // Если объект уже находится в нужной ячейке
         if (prev.x === coords.x && prev.y === coords.y) {
            return;
         }

         // Удаляем объект со старого места
         this.remove(object);

      } 

      object.coordsInGrid = coords;
      
      const cell = this.getCell(coords);
      cell.push(object);
   }

   public remove(object: T) { 
      if (!object) return;

      const coords = this.getCoordsInGrid(object.coords);
      const cell = this.getCell(coords);

      cell.filter((item) => item != object);
   }

   /**
    * Возвращает ячейку сетки по ее координатам 
    * @param coords Координаты ячейки
    */
   private getCell(coords: Vector) : T[] | null {
      const hasCoords = coords.x >= 0 && coords.y >= 0
         && coords.x < this.size.x && coords.y < this.size.y;

      return (hasCoords) ? this.grid[coords.x][coords.y] : null;
   }

   private getCoordsInGrid(coords: Vector) { 
      let res = coords.unscale(this.cellSize);

      res.x = res.x ^ 0;
      res.y = res.y ^ 0;

      return res;
   }

   private init() { 
      this.grid = new Array(this.size.x);
      
      for (let i = 0; i < this.size.x; i++) {
         this.grid[i] = new Array(this.size.y);
      }
   } 

}

