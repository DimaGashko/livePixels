import Vector from "../components/Vector/Vector";

type CTX = CanvasRenderingContext2D;
type IMG = HTMLImageElement;
type TYPE = 'center' | 'cover';

export default function canvasImgFill(ctx: CTX, img: IMG, type: TYPE): void { 
   if (!(type in fillMethods)) {
      throw SyntaxError('Wrong fill type');
   }

   fillMethods[type](ctx, img);
}
 
const fillMethods: { [type: string]: (ctx: CTX, img: IMG) => void } = {

   center: function(ctx: CTX, img: IMG) {
      const canvasSize = new Vector(ctx.canvas.width, ctx.canvas.height);
      const imgSize = new Vector(img.naturalWidth, img.naturalHeight);
      const ratio = imgSize.x / imgSize.y;

      let dw = imgSize.x;
      let dh = imgSize.y;
   
      if (dw > canvasSize.x) {
         dw = canvasSize.x;
         dh = dw / ratio;
   
         if (dh > canvasSize.y) {
            dh = canvasSize.y;
            dw = dh * ratio;
         }
      }
   
      else if (dh > canvasSize.y) {
         dh = canvasSize.y;
         dw = dh * ratio;
   
         if (dw > canvasSize.x) {
            dw = canvasSize.x;
            dh = dw / ratio;
         }
      }
   
      ctx.drawImage(img,
         canvasSize.x / 2 - dw / 2,
         canvasSize.y / 2 - dh / 2,
         dw, dh
      );
   },

   cover: function (ctx: CTX, img: IMG) {
      
   }
   
}
