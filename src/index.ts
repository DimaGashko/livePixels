import LiveImg from './components/LiveImg/LiveImg';

import 'normalize.css'
import './styles/index.sass';

const global = <any>window;

const container = document.querySelector('.live-img');
 
const liveImg = new LiveImg({
   width: 350,
   height: 400,
});

container.appendChild(liveImg.root);
 
console.log(liveImg.width, liveImg.height);

global.img = liveImg;
