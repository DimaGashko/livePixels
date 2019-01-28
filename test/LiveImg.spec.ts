import { expect } from 'chai';
import LiveImg from '../src/components/LiveImg/LiveImg';

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

      it('width', () => {
         liveImg.width = 500;
         expect(liveImg.width).equal(500);
      });

      it('height', () => {
         liveImg.height = 500;
         expect(liveImg.height).equal(500);
      });

      it('root', () => { 
         const root: any = liveImg.root;
         expect(root).instanceOf(Element);
      });
   }); 

});