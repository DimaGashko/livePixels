import './index.sass';
import LiveImg from './components/LiveImg/LiveImg';

const container = document.querySelector('.live-img');

const liveImg = new LiveImg({
   width: 800,
   height: 600,
});

container.appendChild(liveImg.root);
 
console.log(liveImg.width, liveImg.height);