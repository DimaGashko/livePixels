import { expect, assert } from 'chai';
import Vector from '../Vector';

describe('Class Vector', () => {

   describe('new Vector', () => {
      
      it('Если вызван без параметров, то координаты равны нулю', () => {
         const vector = new Vector();

         expect(vector.x).equal(0);
         expect(vector.y).equal(0);       
      });

      it('Координаты равны переданным параметрам', () => {
         const vector = new Vector(2, 5);

         expect(vector.x).equal(2);   
         expect(vector.y).equal(5);
      });
   
   });
 
   describe('Methods', () => { 
      
      it('copy()', () => { 
         const v1 = new Vector(1, 2);
         const res = v1.copy();

         expect(res.x).equal(v1.x);
         expect(res.y).equal(v1.y);
      });

      it('add()', () => { 
         const v1 = new Vector(1, 2);
         const res = v1.add(new Vector(2, 1));

         expect(res.x).equal(3);
         expect(res.y).equal(3);
      });

      it('copy() возвращает новый вектор', () => { 
         const v1 = new Vector(1, 2);
         const res = v1.copy();
         
         assert.isTrue(v1 !== res);
      });

      it('add() возвращает новый вектор', () => { 
         const v1 = new Vector(1, 2);
         const v2 = new Vector(2, 1);
         const res = v1.add(v2);
         
         assert.isTrue(v1 !== res);
         assert.isTrue(v2 !== res);
      });

   }); 

});