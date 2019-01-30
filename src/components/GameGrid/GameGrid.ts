import Vector from "../Vector/Vector";

/**
 * Интерфейс, которому объект обязан соответствовать, 
 * что бы быть совместимым с сеткой
 */
export interface IGameObjectForGrid {
   coords: Vector;
   coordsInGrid: Vector;
}

/**
 * Класс сетки игрового поля
 * 
 * Представляет собой двумерную сетку размерностью `cellSize`. 
 * 
 * Сетка предназначена для быстрого получения объектов в нужном интервале.
 * Может использовать что бы быстро получать объекты находящиеся рядом с другим 
 * объектом (для определения столкновений), что избавляет от сложности O(n^2).
 * 
 * @param gridSize размер сетки в пикселях
 * @param cellSize размер ячеек сетки
 * 
 * @class
 */
export default class GameGrid<T extends IGameObjectForGrid> {
   /** Размер сетки (размер массивов) */ 
   private size: Vector = null

   /** Реальные размеры сетки в пикселях */
   private realSize: Vector = null;

   /** Размеры ячейки в пикселях */
   private cellSize: Vector = null;

   private grid: T[][][] = []; 
   private objectsLen: number = 0;

   constructor(gridSize: Vector, cellSize: Vector) { 
      this.realSize = gridSize.copy();
      this.cellSize = cellSize.copy();

      this.size = gridSize.unscale(cellSize);


      this.init();
   }

   /**
    * Добавляет объект в сетку. 
    * 
    * Если объект уже находился в сетке, то он сначала удаляется 
    * с предыдущего места и добавляется в новое. Если объект остается 
    * на том же месте, то функция ничего не делает.
    * 
    * @param object добавляемый объект
    */
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
      if (!cell) return;

      cell.push(object);

      this.objectsLen++;
   }

   public remove(obj: T) { 
      if (!obj) return;

      const cell = this.getCell(obj.coordsInGrid);
      if (!cell) return;

      cell.filter((item) => item != obj);

      this.objectsLen--;
   }

   /**
    * Возвращает все объекты, что находятся на переданном интервале
    * @param start координаты начала интервала (верхний правый угол)
    * @param size размеры интервала (ширина, высота)
    */
   public getObjectsOfRange(start: Vector, size: Vector): T[] { 
      const _start = this.getCoordsInGrid(start); // rangeStart in grid
      const _size = this.getCoordsInGrid(size); // rangeSize in grid

      const result: T[] = [];

      for (let x = _start.x; x <= _start.x + _size.x; x++) { 
         for (let y = _start.y; y <= _start.y + _size.y; y++) {
            const cell = this.getCell(new Vector(x, y));
            if (!cell) continue;

            for (let i = cell.length - 1; i >= 0; i--) {
               const obj = cell[i];

               const checkObj = obj && (
                  obj.coords.x >= start.x && obj.coords.y >= start.y &&
                  obj.coords.x <= start.x + size.x &&
                  obj.coords.y <= start.y + size.y
               );

               if (!checkObj) continue;

               result.push(obj);
            }
            
         }
      }
      
      return result;
   }

   /**
    * Возвращает все объекты находящиеся в сетке
    * (является упрощенным вариантом getObjectsOfRange)
    */
   public getAllObjects(): T[] { 
      const result: T[] = new Array(this.objectsLen);
      let index = 0;

      for (let x = 0; x < this.size.x; x++) {
         for (let y = 0; y < this.size.y; y++) { 
            const cell = this.getCell(new Vector(x, y));
            if (!cell) continue;

            for (let i = cell.length - 1; i >= 0; i--) {
               result[index++] = cell[i];
            }

         }
      }

      return result;
   }

   /**
    * Возвращает ячейку сетки по ее координатам 
    * 
    * Если переданы координаты за пределами сетки относятся к граничным ячейкам
    * 
    * @param coords Координаты ячейки
    */
   private getCell(coords: Vector): T[] {
      coords = coords.copy();

      const w = this.size.x;
      const h = this.size.y;

      if (coords.x < 0) coords.x = 0;
      else if (coords.x >= w) coords.x = w - 1;

      if (coords.y < 0) coords.y = 0;
      else if (coords.y >= h) coords.y = h - 1;

      return this.grid[coords.x][coords.y];
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

         for (let j = 0; j < this.size.y; j++) { 
            this.grid[i][j] = [];
         }
      }

   } 

}
