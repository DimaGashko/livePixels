import Vector from "../Vector/Vector";
import { IGameObjectForGrid } from "../GameGrid/GameGrid";

export type livePixelShape = 'circle' | 'square';

export default class LivePixel implements IGameObjectForGrid {
   public size: number = 5;

   /**
    * Координаты пикселя
    * 
    * Непосредственно изменяют положение пикселя. 
    */
   public coords: Vector = new Vector(0, 0);

   /**
    * Используется в глобальном update (при проверке взаимодействий, 
    * столкновений...), что бы не менять на прямую coords (так как изменение 
    * координаты пикселя меняет его положение относительно других пикселей, 
    * из-за чего будут некорректно определяться взаимодействия).
    */
   public newCoords: Vector = null;

   /** Используется в GameGrid */
   public coordsInGrid: Vector = null;

   /**
    * Скорость пикселя (на текущем кадре)
    * 
    * В конце каждого кадра скорость прибавляется к координатам и сбрасывается.
    */
   public speed: Vector = new Vector(0, 0);

   public color: string = '#000';

   public shape: livePixelShape = 'circle';

   constructor() { 

   }

   public update(frameTime: number, time: number): void { 
      
   }

   public draw(ctx: CanvasRenderingContext2D, frameTime: number, time: number): void { 
      ctx.fillStyle = this.color;

      let shape = this.shape;

      if (this.size < 5) shape = 'square';

      let x = this.coords.x;
      let y = this.coords.y;
      let size = this.size;

      if (shape === 'circle') { 
         ctx.beginPath();
         ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
         ctx.fill();

      } else if (shape === 'square') {
         ctx.fillRect(x, y, size, size);
      }

      // В этой функции нельзя использовать ctx.save() / ctx.restore();
      // Так как когда пикселей много эти функции в пару раз снижают fps
   }
}