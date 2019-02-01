import LiveImg from './components/LiveImg/LiveImg';
import * as dat from 'dat.gui';

import 'normalize.css'
import './styles/index.sass';

const global = <any>window;
const container = document.querySelector('.live-img');

const gui = new dat.GUI();

const imgSources = {
   '2019': 'https://bestcube.space/wp-content/uploads/22.jpg',
   'flower': 'https://bipbap.ru/wp-content/uploads/2017/10/0_8eb56_842bba74_XL-640x400.jpg',
   'girl': 'https://sun9-8.userapi.com/c824201/v824201969/173426/YW0DIgHPsvw.jpg?ava=1',
   'cat': 'https://yashik.tv/attach/image/0/u/b/0ub797gcbe_900_9999_a.jpg',
   'shark': 'https://pngimage.net/wp-content/uploads/2018/06/png-rfhnbyrb-2.png',
   'masons': 'https://pngimage.net/wp-content/uploads/2018/06/png-rfhnbyrb-3.png',
   'sea': 'https://bipbap.ru/wp-content/uploads/2017/04/555946b1b027f7626674951f6f236e9198f06211.jpg',
   'eye': 'https://wpapers.ru/wallpapers/3d/Rendering/5289/PREV_%D0%93%D0%BB%D0%B0%D0%B7.jpg',
   'pixelOwl': 'https://avatars.mds.yandex.net/get-pdb/876214/ca7b23cc-9603-4101-85ae-168c2e338d82/s375',
   'glitch': 'http://illjuzija.ru/wp-content/uploads/2016/05/%D0%91%D0%B5%D0%B7-%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8-11-2-600x338.gif',

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
      width.max(window.innerWidth);
      height.max(window.innerHeight);

      width.updateDisplay();
      height.updateDisplay();
   });

}());