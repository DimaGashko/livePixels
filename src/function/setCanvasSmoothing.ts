/**
 * Включает/выключает сглаживание в канвасе
 * (вызывать нужно при каждом изменении размеров)
 * @param ctx CanvasRenderingContext
 * @param val turn on/off
 */
export function setCanvasSmoothing(ctx: CanvasRenderingContext2D, val: boolean) {
   (<any>ctx).mozImageSmoothingEnabled = val;
   (<any>ctx).webkitImageSmoothingEnabled = val;
   (<any>ctx).msImageSmoothingEnabled = val;
   ctx.imageSmoothingEnabled = val;
}