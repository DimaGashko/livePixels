import { expect } from "chai";
import LiveImg from "../src/components/LiveImg/LiveImg";

describe("class LiveImg", () => {

   describe("new LiveImg", () => {
      
      it(`Default params`, () => {
         expect(new LiveImg()).instanceof(LiveImg);         
      });

      it(`Custom params`, () => {
         const liveImg = new LiveImg({
            width: 100,
            height: 100,
         });

         expect(liveImg).instanceof(LiveImg); 
      });
   
   });

});