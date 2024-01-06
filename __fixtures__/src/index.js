import './index.css';

(() => {
  const body = document.querySelector('BODY');
  const div = document.createElement('div');
  div.innerText = `${process.env.MOCK_JS_VALUE} hello world`;
  body.appendChild(div);
})();
