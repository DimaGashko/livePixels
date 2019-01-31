import LiveImg from './components/LiveImg/LiveImg';
import * as dat from 'dat.gui';

import 'normalize.css'
import './styles/index.sass';

const global = <any>window;

const container = document.querySelector('.live-img');
 
const liveImg = global.img = new LiveImg({
   width: 365,
   height: 400,
   pixelSize: 20,
});

container.appendChild(liveImg.root);

const gui = new dat.GUI();

gui.add(liveImg, 'width', 5, window.innerWidth);
gui.add(liveImg, 'height', 5, window.innerHeight);
gui.add(liveImg, 'pixelSize', 1, 100);