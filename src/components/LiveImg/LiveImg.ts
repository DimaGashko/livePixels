import Vector from '../Vector/Vector';
import LivePixel, { livePixelShape } from './LivePixel';
import GameGrid from '../GameGrid/GameGrid';
import { getDivs_withCache } from '../../function/getDivs/getDivs';

import * as liveImgTemplate from './templates/LiveImg.pug';
import './styles/LiveImg.sass'

export interface LiveImgConfig {
   width?: number,
   height?: number,
   pixelSize?: number,
   pixelShape?: livePixelShape,
}

interface LiveImgElements {
   canvas: HTMLCanvasElement | null,
}

export default class LiveImg {
   private _size: Vector = new Vector(300, 300);
   private _maxSize: Vector = new Vector(5000, 5000);
   private _minSize: Vector = new Vector(0, 0);

   /**
    * Приблизительный размер пикселей
    * (реальный размер должен быть максимально близким к нему) 
    */
   private _basePixelSize: number = 10;

   /**
    * Реальный размер пикселей. Определяется таким образом, что бы 
    * пиксели можно было разместить на картинке без пропусков, перекрытий 
    * и выходов за границы.
    * 
    * Должен быть максимально близким к _basePixelSize
    */
   private _realPixelSize: number = null;

   /** В каких пределах может быть размер пикселей */
   private _pixelSizeRange: Vector = new Vector(1, 250);

   private _pixelShape: livePixelShape = 'circle';

   private _pixels: LivePixel[] = [];

   /** Html-контейнер картинки */
   private _root: Element | null = null;

   /** Html элементы */
   private _els: LiveImgElements = {
      canvas: null,
   };

   private ctx: CanvasRenderingContext2D = null;

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

   private _grid: GameGrid<LivePixel> = null;

   constructor(config?: LiveImgConfig) {
      if (config) {
         this._useConfig(config);
      }

      this.init();
      this.create();
      this.startRender();
   }

   private init(): void {
      this._createHtml();
      this._getElements();
      this._updateMetrics();
      this._getCtx();
   }

   private startRender(): void {
      if (this._isRendering()) return;
      const liveImg = this;
      let prevTime = -1;

      requestAnimationFrame(function renderFunction(time: number) {
         let frameTime: number = (prevTime != -1) ?
            time - prevTime : 16;

         frameTime = liveImg._correctFrameTime(frameTime);

         liveImg._clearCanvas();
         liveImg.update(frameTime, time);
         liveImg.draw(frameTime, time);

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
      
   }

   private draw(frameTime: number, time: number): void {
      const ctx = this.ctx;

      for (let i = this._pixels.length - 1; i >= 0; i--) {
         const pixel = this._pixels[i];
         pixel.draw(ctx, frameTime, time);
         /*ctx.fillRect(
            pixel.coords.x, pixel.coords.y,
            pixel.size, pixel.size
         );*/
      }
   }

   /**
    * Создает картинку (сетку, пиксели...)
    *
    * Старые объекты удаляются 
    */
   private create(): void {
      this._updateRealPixelSize();

      console.log(
         'Pixel size:', this._basePixelSize,
         'real:', +this._realPixelSize.toFixed(2)
      );

      this._createGrid();
      this._createPixels();
   }

   /**
    * Создает сетку с пикселями. Если она уже была создана 
    * она удаляется (вместе со старыми пикселями)
    */
   private _createGrid(): void { 
      const pixelS = this._realPixelSize;

      this._grid = new GameGrid(
         this._size, new Vector(pixelS, pixelS)
      );
   }

   private _createPixels(): void { 
      // По осям должно быть width(height) / pixelSize пикселей
      const pixelsSize = this._size.div(this._realPixelSize).ceil();

      // А всего пикселей - это их площадь
      const pixelsLen = pixelsSize.x * pixelsSize.y;

      const pixels = new Array(pixelsLen);

      for (let i = 0; i < pixelsLen; i++) { 
         const pixel = new LivePixel();

         pixel.size = this._realPixelSize;
         pixel.shape = this._pixelShape;
      
         pixel.coords = new Vector(
            i % pixelsSize.x, (i / pixelsSize.x) ^ 0
         ).mul(this._realPixelSize);

         pixels[i] = pixel;
      }

      this._pixels = pixels;
      console.log('Pixels count', pixelsLen);
   }

   /** 
    * Пересчитывает окончательные размеры (_realPixelSize) пикселей так, 
    * что бы они были максимально близкими к _basePixelSize и при этом, что бы 
    * пиксели можно было разместить на картинке без пропусков, 
    * перекрытий и выходов за границы
    */
   private _updateRealPixelSize(): void {
      const base = this._basePixelSize;

      if (base <= 3) { 
         // Если размер пикселей пару пикселей, небольшие погрешности допустимы
         this._realPixelSize = base;
         return;
      }

      // Максимально-доступное отклонение от идеального совпадения
      const epsilon = 4;

      if (this._size.x % base <= epsilon) {
         this._realPixelSize = base;
         return;
      }
      
      // Выбираем из чисел, что делятся на ширину
      const candidates = getDivs_withCache(this._size.x, epsilon);

      // Дополнительно проверяем с width/base
      candidates.push(this._size.x / base);

      // Выбираем число из candidates максимально близкое к base
      let resSize: number = base;
      let minDif: number = Infinity;

      candidates.forEach((candidate) => { 
         const dif = Math.abs(base - candidate);

         if (dif < minDif) {
            minDif = dif;
            resSize = candidate;
         }
      });

      if (resSize <= 1) {
         resSize = 1;
      }
      
      this._realPixelSize = resSize;
   }

   /** Устанавливает всем пикселям текущую форму */
   private updatePixelShape() { 
      this._pixels.forEach((pixel) => {
         pixel.shape = this.pixelShape
      });
   }
   
   private _isRendering(): boolean {
      return this._frameId !== 0;
   }

   private _clearCanvas(): void {
      this.ctx.clearRect(0, 0, this._size.x, this._size.y);
   }

   private _updateMetrics(): void {
      this._updateCanvasSize();
   }

   private _updateCanvasSize(): void {
      this._els.canvas.width = this._size.x;
      this._els.canvas.height = this._size.y;
   }

   private _createHtml(): void {
      const tmpContainer = document.createElement('div');
      tmpContainer.innerHTML = liveImgTemplate;

      this._root = tmpContainer.firstElementChild;
   }

   private _getElements(): void {
      this._els.canvas = this._root.querySelector('.liveImg__canvas');

      this._checkElements();
   }

   private _getCtx(): void {
      this.ctx = this._els.canvas.getContext('2d');
   }

   private _checkElements(): void {
      const missedElements: string[] = [];

      if (!this._els.canvas) {
         missedElements.push('canvas');
      }

      if (!missedElements.length) return;

      const errMsg = `LiveImgError: Can't get next elements: ${missedElements}`;
      throw ReferenceError(errMsg);
   }

   /**
    * Устанавливает параметры картинки по конфигу
    * (не провоцирует каких либо перерисовок)
    * @param config параметры LiveImg
    */
   private _useConfig(config: LiveImgConfig): void {
      if ('width' in config) this._setWidth(config.width);
      if ('height' in config) this._setHeight(config.height);
      if ('pixelSize' in config) this._setPixelSize(config.pixelSize);
      if ('pixelShape' in config) this._setPixelShape(config.pixelShape);
   }   

   private _setPixelShape(shape: livePixelShape): void {
      this._pixelShape = shape;
   }

   private _setPixelSize(size: number): void {
      const range = this._pixelSizeRange;

      if (size < range.x) size = range.x;
      else if (size > range.y) size = range.y;

      this._basePixelSize = size;
   }

   private _setWidth(val: number): void {
      if (val > this._maxSize.x) val = this._maxSize.x;
      else if (val < this._minSize.x) val = this._minSize.x;

      this._size.x = val;
   }

   private _setHeight(val: number): void {
      if (val > this._maxSize.y) val = this._maxSize.y;
      else if (val < this._minSize.y) val = this._minSize.y;

      this._size.y = val;
   }

   private _correctFrameTime(frameTime: number): number {
      if (frameTime > this._MAX_FRAME_TIME) {
         frameTime = this._MAX_FRAME_TIME;
      }

      return frameTime;
   }

   public get root(): Element | null {
      return this._root;
   }

   public get pixelSize() {
      return this._basePixelSize;
   }

   /**
    * Устанавливает размер пикселя (ожидаемый, базовый) 
    * 
    * **Провоцирует перепостроение картинки**
    */
   public set pixelSize(val: number) {
      this._setPixelSize(val);
      this.create();
   }

   public get pixelShape() {
      return this._pixelShape;
   }

   /**
    * Устанавливает форму пикселя
    */
   public set pixelShape(val: livePixelShape) {
      this._setPixelShape(val);
      this.updatePixelShape();
   }

   public get width(): number {
      return this._size.x;
   }

   /**
    * Устанавливает ширину картинки
    * 
    * **Провоцирует перепостроение картинки**
    */
   public set width(val: number) {
      this._setWidth(val);
      this._updateCanvasSize();
      this.create();
   }

   public get height(): number {
      return this._size.y;
   }

   /**
    * Устанавливает высоту картинки
    * 
    * **Провоцирует перепостроение картинки** 
    */
   public set height(val: number) {
      this._setHeight(val);
      this._updateCanvasSize();
      this.create();
   }
}