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
      if (config) {
         this._useConfig(config);
      }
   }

   public get width(): number {
      return this._width;
   }

   public set width(val: number) {
      this._setWidth(val);
   }

   public get height(): number {
      return this._height;
   }

   public set height(val: number) {
      this._setHeight(val);
   }

   /**
    * Устанавливает параметры картинки по конфигу
    * (не провоцирует каких либо перерисовок)
    * @param config параметры LiveImg
    */
   private _useConfig(config: LiveImgConfig): void {
      if (config.height) this._setHeight(config.height);
      if (config.width) this._setHeight(config.width);
   }

   private _setWidth(val: number): void {
      if (val > this._maxWidth) val = this._maxWidth;
      else if (val < this._minWidth) val = this._minWidth;

      this._width = val;
   }

   private _setHeight(val: number): void {
      if (val > this._maxHeight) val = this._maxHeight;
      else if (val < this._minHeight) val = this._minHeight;

      this._height = val;
   }

}