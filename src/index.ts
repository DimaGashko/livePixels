import './index.sass';
import LiveImg from './components/LiveImg/LiveImg';

const liveImg = new LiveImg({
   width: 600,
   height: 400,
});

console.log(liveImg.width, liveImg.height);