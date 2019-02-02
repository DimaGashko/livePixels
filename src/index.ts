import LiveImg from './components/LiveImg/LiveImg';
import * as dat from 'dat.gui';

import 'normalize.css'
import './styles/index.sass';

const global = <any>window;
const container = document.querySelector('.live-img');

const gui = new dat.GUI();

const imgSources = {
   'year2019': require('./img/examples/2019.jpg'),
   'flower': require('./img/examples/flower.jpg'),
   'girl': require('./img/examples/girl.jpg'),
   'girl2': require('./img/examples/girl2.jpg'),
   'cat': require('./img/examples/cat.jpg'),
   'shark': require('./img/examples/shark.png'),
   'masons': require('./img/examples/masons.png'),
   'sea': require('./img/examples/sea.jpg'),
   'eye': require('./img/examples/eye.jpg'),
   'pixelOwl': require('./img/examples/pixelOwl.webp'),
   'glitch': require('./img/examples/glitch.jpg'),
   'mask': require('./img/examples/mask.jpg'),
   'darwin': require('./img/examples/darwin.jpg'),
};

const liveImg = global.img = new LiveImg({
   width: 300,
   height: 200, 
   pixelSize: 2,
   pixelShape: 'circle',
});

container.appendChild(liveImg.root);

setImg(imgSources.shark);

(function initGui() {
   const config = {
      img: imgSources.shark,
   }

   const width = gui.add(liveImg, 'width', 5, window.innerWidth, 1);
   const height = gui.add(liveImg, 'height', 5, window.innerHeight, 1);
   const pixelSize = gui.add(liveImg, 'pixelSize', 1, 20);
   const pixelShape = gui.add(liveImg, 'pixelShape', ['circle', 'square']);
   const images = gui.add(config, 'img', imgSources);
   const fillType = gui.add(liveImg, 'fillType', ['center', 'cover']);

   window.addEventListener('resize', () => {
      width.max(window.innerWidth).updateDisplay();
      height.max(window.innerHeight).updateDisplay();
   });

   images.onChange(() => { 
      setImg(config.img);
   });

}());

function setImg(src: string): void {
   const img = new Image();

   img.addEventListener('load', () => {
      liveImg.setImg(img);
   });

   img.src = src;
}