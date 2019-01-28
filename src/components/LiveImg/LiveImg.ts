import * as myImage from './LiveImgTemplate.pug';
console.log(myImage);

import { template } from 'micro-template';
console.log(template('asd<%=a%> sfa sdjflak;sdj ffasdfadsfadsf', {a: 999999}));
template.get;
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

   // HTML-контейнер картинки
   private _root: HTMLElement = null;

   constructor(config?: LiveImgConfig) {
      if (config) {
         this._useConfig(config);
      }
   }

   public get root(): HTMLElement {
      return this._root;
   }
   public set root(val: HTMLElement) {
      this._root = val;
   }

   public get width(): number {
      return this._width;
   }

   // Устанавливает ширину картинки
   // (Вызывает перерисовку)
   public set width(val: number) {
      this._setWidth(val);
   }

   public get height(): number {
      return this._height;
   }

   // Устанавливает высоту картинки
   // (Вызывает перерисовку)
   public set height(val: number) {
      this._setHeight(val);
   }

   /**
    * Устанавливает параметры картинки по конфигу
    * (не провоцирует каких либо перерисовок)
    * @param config параметры LiveImg
    */
   private _useConfig(config: LiveImgConfig): void {
      if ('width' in config) this._setWidth(config.width);
      if ('height' in config) this._setHeight(config.height);
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