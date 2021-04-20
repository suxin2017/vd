import { c, diff, patch } from 'vd';

let o = c('div', { id: 'test' }, [
  c('div', { id: 'replace' }, [], 'a'),

]);

let count = 0;
function App() {
  console.log(count)
  let n = c('div', { id: 'test' }, [
    c('div', {
      id: 'replace', onclick: () => {
        console.log('click')
        count++;
        update();
      }
    }, [
      c('text', { value: '' + count }, [], 'a'),
    ], 'a'),


  ]);
  return n;
}


// init 
o.render();

// update 
function update() {
  const n = App()
  const t = diff(o, n);
  patch(t)
  console.log(t)
}


const app = document.getElementById('app');



app.appendChild(o.el);

update();
