import './index.sass';
import LiveImg from './components/LiveImg/LiveImg';

const container = document.querySelector('.live-img');

const liveImg = new LiveImg({
   width: 300,
   height: 200,
});

container.appendChild(liveImg.root);
 
console.log(liveImg.width, liveImg.height);