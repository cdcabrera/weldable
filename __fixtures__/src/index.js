import './index.css';
import { hello } from './world';

(() => {
  const body = document.querySelector('BODY');
  const div = document.createElement('div');
  div.innerText = `${process.env.MOCK_JS_VALUE} ${hello()}`;
  body.appendChild(div);
})();
