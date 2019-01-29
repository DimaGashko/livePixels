import LiveImg from './components/LiveImg/LiveImg';

import 'normalize.css'
import './styles/index.sass';

const container = document.querySelector('.live-img');
 
const liveImg = new LiveImg({
   width: 300,
   height: 200,
});

container.appendChild(liveImg.root); 
 
console.log(liveImg.width, liveImg.height);