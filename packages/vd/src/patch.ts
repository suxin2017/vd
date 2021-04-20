import { VElement } from './createElement';
import { Task } from './diff';

export function patch(tasks: Task[]) {
  for (let task of tasks) {
    switch (task.type) {
      case 'props':
        patchProps(task.data);
        break;
      case 'child':
        patchChildren(task.data);
        break;
      case 'replace':
        patchReplace(task.data);
        break;
    }
  }
}

function patchProps(data: any) {
  const { oldNode, props } = data;
  if(oldNode.tagName === 'text'){
    console.log(oldNode,'老街店')
      oldNode.parent.el.textContent = props.get('value')
      return
  }
  props.forEach((value: any, key: any) => {
    if(key.startsWith('on')){
      oldNode.el.removeEventListener(key.substr(2),oldNode.props[key])
      oldNode.el.addEventListener(key.substr(2),value)
  }else{
      oldNode.el.setAttribute(key, value);
  }
  oldNode.props[key] = value;

  });
}
function patchChildren(data: { node: VElement; [key: string]: any }) {
  const { node, type } = data;

  switch (type) {
    case 'move':
      // const {path,node:parentNode} = data;
      // const pos = {};
      // path.forEach((moveItem: { from: any; to: any; })=>{
      //   const { from, to } = moveItem;
      //   let a = parentNode.el?.childNodes[from];
      //   let b = parentNode.el?.childNodes[to];

      //   pos[to] = a;
      //   if (a && b) {
      //     node.el?.replaceChild(a, b);
      //     let temp = node.children[from];
      //     node.children[from] = node.children[to];
      //     node.children[to] = temp;
      //   }
      // })
    
   
      break;
    case 'create':
      const { at, nNode } = data;
      nNode.render();
      node.el?.insertBefore(nNode.el, node.el.childNodes[at - 1]);
      nNode.parent = node;
      node.children.splice(at -1 ,0 ,nNode)
      break;
    case 'remove':
      const childIndex = node.parent?.children.lastIndexOf(node);
      if(childIndex && childIndex !== -1)
      node.parent?.children.splice(childIndex,1)
      node.el?.parentNode?.removeChild(node.el);
  }
}

function patchReplace(data: any) {
  const { newNode, oldNode } = data;
  newNode.render();
  const newEl = newNode.el;
  (oldNode.el.parentNode as Element).replaceChild(newEl, oldNode.el);
  const oInd = oldNode.parent.children.lastIndexOf(oldNode);
  if(oInd){
    oldNode.parent.children[oInd] = newNode;

  }
}
