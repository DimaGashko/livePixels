import './index.sass';
import LiveImg from './components/LiveImg/LiveImg';

const liveImg = new LiveImg({
   width: 800,
   height: 600,
});
 
console.log(liveImg.width, liveImg.height);