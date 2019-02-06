import Vector from '../Vector/Vector';
import LivePixel, { PixelShape } from './LivePixel';
import GameGrid from '../GameGrid/GameGrid';
import { getDivs_withCache } from '../../functions/getDivs/getDivs';
import canvasImgFill from '../../functions/canvasImgFill';

import * as liveImgTemplate from './templates/LiveImg.pug';
import './styles/LiveImg.sass'
import perlinNoise from '../../functions/perlin-noise';

export type FillType = 'center' | 'cover'; 

export interface LiveImgConfig {
   width?: number,
   height?: number,
   pixelSize?: number,
   pixelShape?: PixelShape,
}

interface LiveImgElements {
   canvas: HTMLCanvasElement | null,
}

export default class LiveImg {
   private _size: Vector = new Vector(300, 300);
   private _maxSize: Vector = new Vector(5000, 5000);
   private _minSize: Vector = new Vector(0, 0);

   // Имитируемая картинка (картинка уже должна быть загруженной)
   private _img: HTMLImageElement = null;

   private _fillType: FillType = 'center';

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
   private _pixelSizeLimits: Vector = new Vector(1, 250);

   private _pixelShape: PixelShape = 'circle';

   /** Пиксели картинки */
   private _pixels: LivePixel[] = [];

   /** Html-контейнер картинки */
   private _root: Element | null = null;

   /** Html элементы */
   private _els: LiveImgElements = {
      canvas: null,
   };

   private ctx: CanvasRenderingContext2D = null;

   /** постоянно увеличивающаяся переменная */
   private time: number = 0;

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
      this._updateCanvasSize();
      this._getCtx();
   }

   private startRender(): void {
      if (this._isRendering()) return;
      const liveImg = this;
      let prevT = -1;

      requestAnimationFrame(function renderFunction(t: number) {
         let frameTime: number = (prevT != -1) ?
            t - prevT : 16;

         frameTime = liveImg._correctFrameTime(frameTime);
         prevT = t;

         liveImg._clearCanvas();
         liveImg.update(frameTime);
         liveImg.draw(frameTime);

         liveImg.time += 0.005;
         requestAnimationFrame(renderFunction);
      });
   }

   private _stopRender(): void {
      if (!this._isRendering()) return;

      cancelAnimationFrame(this._frameId);
      this._frameId = 0;
   }

   private update(frameTime: number): void {
      for (let i = this._pixels.length - 1; i >= 0; i--) {
         this._pixels[i].update(frameTime, this.time);
      }
   }

   private draw(frameTime: number): void {
      for (let i = this._pixels.length - 1; i >= 0; i--) {
         this._pixels[i].draw(this.ctx, frameTime, this.time);
      }
   }

   /**
    * Создает картинку (сетку, пиксели...)
    *
    * Старые объекты удаляются 
    */
   private create(): void {
      this._updateRealPixelSize();
      this._createGrid();
      this._createPixels();

      this.useImg();
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
    * перекрытий и выходов за границы (если это возможно без сильного 
    * отклонения от _basePixelSize)
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

   /**
    * Применяет картинку this._img к текущим пикселям
    */
   private useImg(): void {
      if (!this._img) return;
   
      const colors = this.getPixelColors();
      const size = this._size.div(this._realPixelSize).ceil();
      
      this._pixels.forEach((pixel, i) => {
         const x = i % size.x;
         const y = (i / size.x) ^ 0;

         pixel.homeCoords.x = x * this._realPixelSize;
         pixel.homeCoords.y = y * this._realPixelSize;

         let r = colors[i][0];
         let g = colors[i][1];
         let b = colors[i][2];
         let a = colors[i][3] / 255;

         pixel.color = `rgba(${r},${g},${b},${a})`;
      });

   }

   /**
    * Возвращает массив цветов пикселей 
    * 
    * Длина массива цветов равна количеству пикселей (длине this._pixels).
    * Благодаря чему каждый цвет можно применить к пикселю в обычном цикле
    * где i-тому пикселю присваивается i-тый цвет
    * 
    * Возвращает массив цветов. Цвет представляется в виде массива чисел вида:
    * [r, g, b, a]. Каждая компонента цвета находится в интервале [0, 255]
    */
   private getPixelColors(): number[][] {
      const pixels = this.getImgPixels().data;
      const pixelSize = this._realPixelSize;
      const w = this._size.x;
      const h = this._size.y;

      const colors: number[][] = [];

      // Фактически берем только каждый pixelSize цвет, остальные не учитываются

      for (let y = 0; y < h; y += pixelSize) {
         for (let x = 0; x < w; x += pixelSize) {
            const i = (w * (y ^ 0) + (x ^ 0)) * 4;

            colors.push([
               pixels[i],
               pixels[i + 1], 
               pixels[i + 2],
               pixels[i + 3],
            ]);
         }
      }

      return colors;
   }

   /**
    * Возвращает массив реальных пикселей картинки
    * возвращаются пиксели не this._img, а пиксели канваса, с 
    * размерами this._size и нарисованной на нем (способом fillType) this._img 
    */
   private getImgPixels(): ImageData {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const bgColor = '#000';

      canvas.width = this._size.x;
      canvas.height = this._size.y;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, this._size.x, this._size.y);

      canvasImgFill(ctx, this._img, this._fillType);

      return ctx.getImageData(0, 0, this._size.x, this._size.y);
   }

   private _isRendering(): boolean {
      return this._frameId !== 0;
   }

   private _clearCanvas(): void {
      this.ctx.clearRect(0, 0, this._size.x, this._size.y);
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

   private _setPixelShape(shape: PixelShape): void {
      this._pixelShape = shape;
   }

   private _setPixelSize(size: number): void {
      const range = this._pixelSizeLimits;

      if (size < range.x) size = range.x;
      else if (size > range.y) size = range.y;

      this._basePixelSize = size;
   }

   private _setWidth(val: number): void {
      if (val > this._maxSize.x) val = this._maxSize.x;
      else if (val < this._minSize.x) val = this._minSize.x;

      this._size.x = val ^ 0;
   }

   private _setHeight(val: number): void {
      if (val > this._maxSize.y) val = this._maxSize.y;
      else if (val < this._minSize.y) val = this._minSize.y;

      this._size.y = val ^ 0;
   }

   /**
    * Устанавливает картинку, которую пиксели будут имитировать
    * @param img картинка
    * (просто устанавливает свойство)
    */
   private _setImg(img: HTMLImageElement) {
      this._img = img;
   }

   /**
    * Устанавливает тип рисования картинки
    * @param val тип
    * (просто устанавливает свойство)
    */
   private _setFillType(val: FillType) {
      this._fillType = val;
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
    * Устанавливает картинку, которую пиксели будут имитировать
    * @param img картинка
    */
   public setImg(img: HTMLImageElement) {
      this._setImg(img);

      this.shufflePixels();
      this.useImg();
   }

   private shufflePixels() {
      let i = this.time / 1000;

      this._pixels.sort((a, b) => { 
         i += 0.0013;
         //return Math.random() - 0.5;
         return perlinNoise(i, 1 / i, 0) - 0.5;
      });
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
    * Устанавливает тип рисования картинки
    */
   public set fillType(val: FillType) {
      this._setFillType(val);

      this.shufflePixels();
      this.useImg();
   }

   public get fillType() {
      return this._fillType;
   }

   /**
    * Устанавливает форму пикселя
    */
   public set pixelShape(val: PixelShape) {
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