export interface LiveImgConfig {
   width?: number,
   height?: number,
}

export default class LiveImg {
   private _width: number = 300;
   private _height: number = 300;

   private _maxWidth: number = 10000;
   private _maxHeight: number = 10000;

   private _minWidth: number = 0;
   private _minHeight: number = 0;

   constructor(config?: LiveImgConfig) { 
      
   }

   public get width(): number {
      return this._width;
   }

   public set width(val: number) {
      if (val > this._maxWidth) val = this._maxWidth;
      else if (val < this._minWidth) val = this._minWidth;

      this._width = val;
   }

   public get height(): number {
      return this._height;
   }

   public set height(val: number) {
      if (val > this._maxHeight) val = this._maxHeight;
      else if (val < this._minHeight) val = this._minHeight;

      this._height = val;
   }

}