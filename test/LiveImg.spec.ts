import { expect } from "chai";
import LiveImg from "../src/components/LiveImg/LiveImg";

describe("class LiveImg", () => {

   describe("new LiveImg", () => {
      
      it(`Default params`, () => {
         expect(new LiveImg()).instanceof(LiveImg);         
      });

      it(`Empty params`, () => {
         const liveImg = new LiveImg({});
         expect(liveImg).instanceof(LiveImg); 
      });

      it(`Width`, () => {
         const liveImg = new LiveImg({width: 100});

         expect(liveImg).instanceof(LiveImg); 
         expect(liveImg.width).equal(100);
      });

      it(`Height`, () => {
         const liveImg = new LiveImg({height: 100});

         expect(liveImg).instanceof(LiveImg); 
         expect(liveImg.height).equal(100);
      });
   
   });

});