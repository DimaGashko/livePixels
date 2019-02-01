import LiveImg from './components/LiveImg/LiveImg';
import * as dat from 'dat.gui';

import 'normalize.css'
import './styles/index.sass';

const global = <any>window;
const container = document.querySelector('.live-img');

const gui = new dat.GUI();

const imgSources = {
   '2019': require('./img/examples/2019.jpg'),
   'flower': require('./img/examples/flower.jpg'),
   'girl': require('./img/examples/girl.jpg'),
   'cat': require('./img/examples/cat.jpg'),
   'shark': require('./img/examples/shark.png'),
   'masons': require('./img/examples/masons.png'),
   'sea': require('./img/examples/sea.jpg'),
   'eye': require('./img/examples/eye.jpg'),
   'pixelOwl': require('./img/examples/pixelOwl.webp'),
   'glitch': require('./img/examples/glitch.jpg'),
};

const liveImg = global.img = new LiveImg({
   width: 365,
   height: 400,
   pixelSize: 20,
   pixelShape: 'circle',
});

container.appendChild(liveImg.root);

(function initGui() {
   const width = gui.add(liveImg, 'width', 5, window.innerWidth);
   const height = gui.add(liveImg, 'height', 5, window.innerHeight);
   const pixelSize = gui.add(liveImg, 'pixelSize', 1, 100);
   const pixelShape = gui.add(liveImg, 'pixelShape', ['circle', 'square']);

   window.addEventListener('resize', () => {
      width.max(window.innerWidth).updateDisplay();
      height.max(window.innerHeight).updateDisplay();
   });

}());