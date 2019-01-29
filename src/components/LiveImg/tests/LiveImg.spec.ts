import { expect } from 'chai';
import LiveImg from '../LiveImg';

describe('Class LiveImg', () => {

   describe('new LiveImg', () => {
      
      it('Default params', () => {
         expect(new LiveImg()).instanceof(LiveImg);         
      });

      it('Empty params', () => {
         const liveImg = new LiveImg({});
         expect(liveImg).instanceof(LiveImg); 
      });

      it('Width', () => {
         const liveImg = new LiveImg({width: 100});

         expect(liveImg).instanceof(LiveImg); 
         expect(liveImg.width).equal(100);
      });

      it('Height', () => {
         const liveImg = new LiveImg({height: 100});

         expect(liveImg).instanceof(LiveImg); 
         expect(liveImg.height).equal(100);
      });
   
   });
 
   describe('Gets & Sets', () => { 
      const liveImg = new LiveImg();

      it('width (by LiveImg interface)', () => {
         liveImg.width = 500;
         expect(liveImg.width).equal(500);
      });

      it('height (by LiveImg interface)', () => {
         liveImg.height = 500;
         expect(liveImg.height).equal(500);
      });

      it('root (by LiveImg interface)', () => { 
         const root: any = liveImg.root;
         expect(root).instanceOf(Element);
      });
  
      it('width (by DOM element)', () => {
         liveImg.width = 500;
         expect(liveImg.root.clientWidth).equal(500);
      });

      it('height (by DOM element)', () => {
         liveImg.height = 500;
         expect(liveImg.root.clientHeight).equal(500);
      });
   }); 

});