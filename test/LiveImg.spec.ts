import { expect } from "chai";
import LiveImg from "../src/components/LiveImg/LiveImg";

describe("class LiveImg", () => {

   describe("new LiveImg", () => {
      
      it(`With default params`, () => {
         const liveImg = new LiveImg();

         expect(liveImg).instanceof(LiveImg);         
      });
   
   });

});