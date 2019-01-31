import LiveImg from './components/LiveImg/LiveImg';

import 'normalize.css'
import './styles/index.sass';

const global = <any>window;

const container = document.querySelector('.live-img');
 
const liveImg = new LiveImg({
   width: 100,
   height: 100,
});

container.appendChild(liveImg.root);
 
console.log(liveImg.width, liveImg.height);

global.img = liveImg;
