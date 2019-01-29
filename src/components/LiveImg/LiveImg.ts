import * as liveImgTemplate from './templates/LiveImg.pug';
import './styles/LiveImg.sass'

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

   /** HTML-контейнер картинки */
   private _root: Element | null = null;

   private _els: { [name: string]: Element | null } = {};

   /**
    * Id текущего requestAnimationFrame.
    * Используется для остановки рендера картинки.
    * Также _frameId !== 0, значит что в данный 
    * момент картинка рендерится (см. метод ` _isRendering() `)
    */
   private _frameId: number = 0;

   /**
    * При низком fps время кадра может быть слишком долгим. Так как 
    * все "update" учитывают время кадра, то при большом его значении 
    * могут работать не корректно
    * MAX_FRAME_TIME указывает, максимальное время кадра. Если оно больше
    * считаем его равным MAX_FRAME_TIME. 
    */
   private readonly _MAX_FRAME_TIME: number = 60;

   constructor(config?: LiveImgConfig) {
      if (config) {
         this._useConfig(config);
      }

      this._createHtml();
      this._getElements();

      this.startRender();
   }

   public get root(): Element | null {
      return this._root;
   }

   public get width(): number {
      return this._width;
   }
 
   /**
    * Устанавливает ширину картинки
    * (Вызывает перерисовку)
    */
   public set width(val: number) {
      this._setWidth(val);
   }

   public get height(): number {
      return this._height;
   }

   /**
    * Устанавливает высоту картинки
    * (Вызывает перерисовку) 
    */
   public set height(val: number) {
      this._setHeight(val);
   }

   private startRender(): void {
      if (this._isRendering()) return;
      const liveImg = this;
      let prevTime = -1;

      requestAnimationFrame(function renderFunction(time: number) { 
         let frameTime: number = (prevTime != -1) ?
            time - prevTime : 16;
         
         frameTime = liveImg._correctFrameTime(frameTime);

         liveImg.update(frameTime, time);
         liveImg.draw();

         prevTime = time;
         requestAnimationFrame(renderFunction);
      });
   }

   private _stopRender(): void {
      if (!this._isRendering()) return;

      cancelAnimationFrame(this._frameId);
      this._frameId = 0;
   }

   private update(frameTime: number, time: number): void { 
      console.log(frameTime, time);
   }

   private draw(): void {

   }

   private _isRendering(): boolean {
      return this._frameId !== 0;
   }

   private _createHtml(): void {
      const tmpContainer = document.createElement('div');
      tmpContainer.innerHTML = liveImgTemplate;

      this._root = tmpContainer.firstElementChild;
   }

   private _getElements(): void {
      this._els.canvas = this._root.querySelector('liveImg__canvas');
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

   private _correctFrameTime(frameTime: number): number {
      if (frameTime > this._MAX_FRAME_TIME) {
         frameTime = this._MAX_FRAME_TIME;
      }

      return frameTime;
   }
}