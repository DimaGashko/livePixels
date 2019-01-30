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

}); 