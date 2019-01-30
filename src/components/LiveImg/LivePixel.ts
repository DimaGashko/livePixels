import Vector from "../Vector/Vector";

enum DrawType { Circle, Square };

export default class LivePixel {
   private _size: number = 5;

   /**
    * Координаты пикселя
    * 
    * Непосредственно изменяют положение пикселя. 
    */
   private _coords: Vector = new Vector(0, 0);

   /**
    * Используется в глобальном update (при проверке взаимодействий, 
    * столкновений...), что бы не менять на прямую coords (так как изменение 
    * координаты пикселя меняет его положение относительно других пикселей, 
    * из-за чего будут некорректно определяться взаимодействия).
    */
   private _newCoords: Vector = null;

   /**
    * Скорость пикселя (на текущем кадре)
    * 
    * В конце каждого кадра скорость прибавляется к координатам и сбрасывается.
    */
   private _speed: Vector = new Vector(0, 0);

   private _color: string = '#FB8C00';

   private _drawType: DrawType = DrawType.Circle;

   constructor() { 

   }

   public update(frameTime: number, time: number): void { 

   }

   public draw(ctx: CanvasRenderingContext2D, frameTime: number, time: number): void { 
      
   }

   public get coords(): Vector {
      return this._coords;
   }

   public set coords(val: Vector) {
      this._coords = val;
   }

   public get size(): number {
      return this._size;
   }

   public set size(val: number) {
      this._size = val;
   }

   public get color(): string {
      return this._color;
   }
   public set color(val: string) {
      this._color = val;
   }

   private _drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
   }

   private _drawSquare(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
      ctx.fillRect(x, y, size, size);
   }
}