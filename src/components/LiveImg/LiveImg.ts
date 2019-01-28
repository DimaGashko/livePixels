export default class LiveImg {
   private _width: number = 300;
   private _height: number = 300;

   private _maxWidth: number = Infinity;
   private _maxHeight: number = Infinity;

   private _minWidth: number = 0;
   private _minHeight: number = 0;

   constructor() { 

   }

   public get width(): number {
      return this._width;
   }

   public set width(value: number) {
      this._width = value;
   }

   public get height(): number {
      return this._height;
   }

   public set height(value: number) {
      this._height = value;
   }

   public get maxWidth(): number {
      return this._maxWidth;
   }

   public set maxWidth(value: number) {
      this._maxWidth = value;
   }

   public get maxHeight(): number {
      return this._maxHeight;
   }

   public set maxHeight(value: number) {
      this._maxHeight = value;
   }

   public get minWidth(): number {
      return this._minWidth;
   }

   public set minWidth(value: number) {
      this._minWidth = value;
   }

   public get minHeight(): number {
      return this._minHeight;
   }
   
   public set minHeight(value: number) {
      this._minHeight = value;
   }
}