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

setImg(imgSources.sea);

(function initGui() {
   const config = {
      img: imgSources.sea,
   }

   const width = gui.add(liveImg, 'width', 5, window.innerWidth);
   const height = gui.add(liveImg, 'height', 5, window.innerHeight);
   const pixelSize = gui.add(liveImg, 'pixelSize', 1, 100);
   const pixelShape = gui.add(liveImg, 'pixelShape', ['circle', 'square']);
   const images = gui.add(config, 'img', imgSources);

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