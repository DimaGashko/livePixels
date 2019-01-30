export default class Vector { 
   constructor(public x: number = 0, public y: number = 0) { 

   }

   /*
   mul div scale unscale
   */

   /** {1, 2} + {2, 3} = {3, 5} */
   public add(vector: Vector): Vector {
      return new Vector(
         this.x + vector.x,
         this.y + vector.y,
      );
   }

   /** {5, 5} - {1, 2} = {4, 3} */
   public sub(vector: Vector): Vector {
      return new Vector(
         this.x - vector.x,
         this.y - vector.y
      );
   }

   /** {1, 2} + 2 = {3, 4} */
   public addNum(num: number): Vector {
      return new Vector(
         this.x + num,
         this.y + num,
      );
   }

   /** {5, 6} - 2 = {3, 4} */
   public subNum(num: number): Vector {
      return new Vector(
         this.x - num,
         this.y - num
      );
   }

   /** {1, 3} * 2 = {2, 6} */
   public mul(num: number): Vector { 
      return new Vector(
         this.x * num,
         this.y * num
      );
   }

   /** {2, 6} / 2 = {1, 3} */
   public div(num: number): Vector { 
      return new Vector(
         this.x / num,
         this.y / num
      );
   }

   /** {2, 3} * {4, 5} = {2 * 4, 3 * 5} */
   public scale(vector: Vector): Vector { 
      return new Vector(
         this.x * vector.x,
         this.y * vector.x
      );
   }

   /** {10, 9} / {2, 3} = {10 / 2, 9 * 3} */
   public unscale(vector: Vector): Vector { 
      return new Vector(
         this.x / vector.x,
         this.y / vector.x
      );
   }

   public copy(): Vector {
      return new Vector(this.x, this.y);
   }

}