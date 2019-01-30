import { expect } from 'chai';
import GameGrid, { IGameObjectForGrid } from '../GameGrid';
import Vector from '../../Vector/Vector';

describe('Class GameGrid', () => {
   class Obj implements IGameObjectForGrid {
      public coordsInGrid: Vector;

      constructor(public coords: Vector = new Vector()) { 

      }
   }

   it('Add and getAllObjects', () => {
      const grid = new GameGrid(new Vector(100, 100), new Vector(10, 10));
      const obj = new Obj(new Vector(50, 50));

      grid.add(obj);

      const allObjects = grid.getAllObjects();

      expect(allObjects.length).equal(1);
      expect(allObjects[0]).equal(obj);
   });

   it('При повторном добавлении объекта он перемещается на новое место', () => {
      const grid = new GameGrid(new Vector(100, 100), new Vector(10, 10));
      const obj = new Obj(new Vector(50, 50));

      grid.add(obj);
      
      obj.coords.x = 90;
      grid.add(obj);

      const allObjects = grid.getAllObjects();

      expect(allObjects.length).equal(1);
      expect(allObjects[0]).equal(obj);
   });

   it('getAllObjects', () => {
      const grid = new GameGrid(new Vector(100, 100), new Vector(10, 10));
      const gridSize: Vector = (<any>grid).size;
      const objects: Obj[] = [];

      for (let i = 0; i < 15; i++) {
         objects.push(new Obj(new Vector(
            Math.random() * gridSize.x, Math.random() * gridSize.y
         )));
      }

      objects.forEach(obj => grid.add(obj));

      const allObjects = grid.getAllObjects();

      const check1 = allObjects.every(obj => objects.indexOf(obj) != -1);
      const check2 = objects.every(obj => allObjects.indexOf(obj) != -1);
      const check3 = allObjects.length === objects.length;

      expect(check1).equal(true);
      expect(check2).equal(true);
      expect(check3).equal(true);
   });

}); 