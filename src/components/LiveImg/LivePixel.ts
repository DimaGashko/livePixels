import Vector from "../Vector/Vector";

export default class LivePixel {
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
   public coordsInGrin: Vector = null;

   /**
    * Скорость пикселя (на текущем кадре)
    * 
    * В конце каждого кадра скорость прибавляется к координатам и сбрасывается.
    */
   public speed: Vector = new Vector(0, 0);

   public color: string = '#FB8C00';

   public drawShape: 'circle' | 'square' = 'circle';

   constructor() { 

   }

   public update(frameTime: number, time: number): void { 
      
   }

   public draw(ctx: CanvasRenderingContext2D, frameTime: number, time: number): void { 
      ctx.save();
      ctx.fillStyle = this.color;

      let drawShape = this.drawShape;

      if (this.size < 4) drawShape = 'square';

      if (drawShape === 'circle') { 
         this._drawCircle(ctx, this.coords.x, this.coords.y, this.size);

      } else if (drawShape === 'square') {
            this._drawSquare(ctx, this.coords.x, this.coords.y, this.size);
      }

      ctx.restore();
   }

   private _drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
   }

   private _drawSquare(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
      ctx.fillRect(x, y, size, size);
   }
}