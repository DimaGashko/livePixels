import LiveImg from './components/LiveImg/LiveImg';
import * as dat from 'dat.gui';

import 'normalize.css'
import './styles/index.sass';

const global = <any>window;
const container = document.querySelector('.live-img');

const gui = new dat.GUI();

const liveImg = global.img = new LiveImg({
   width: 365,
   height: 400,
   pixelSize: 20,
   pixelShape: 'circle',
});

container.appendChild(liveImg.root);

(function initGui() {
   const width = gui.add(liveImg, 'width', 5, window.innerWidth).listen();
   const height = gui.add(liveImg, 'height', 5, window.innerHeight).listen();
   const pixelSize = gui.add(liveImg, 'pixelSize', 1, 100).listen();
   const pixelShape = gui.add(liveImg, 'pixelShape', ['circle', 'square']);

   window.addEventListener('resize', () => {
      width.max(window.innerWidth);
      height.max(window.innerHeight);

      width.updateDisplay();
      height.updateDisplay();
   });

}());