import { VElement } from './createElement';
export interface Task {
  type: string;
  data: any;
}
type Children = VElement['children'];
type Props = VElement['props'];
export function diff(oldElement: VElement, newElement: VElement) {
  let taskQueue = [] as Task[];
  dsfWalk(oldElement, newElement, taskQueue);
  return taskQueue;
}

function isSameNode(oldElement: VElement, newElement: VElement) {
  return oldElement.tagName === newElement.tagName;
}

function dsfWalk(oldElement: VElement, newElement: VElement, task: Task[]) {
  // 替换元素
  if (isSameNode(oldElement, newElement)) {
    let diffPropsMap = diffProps(oldElement.props, newElement.props);
    if (diffPropsMap) {
      task.push({ type: 'props', data: {oldNode:oldElement,props:diffPropsMap }});
    }
    diffChildren(oldElement.children, newElement.children,oldElement, task);
  } else {
    task.push({ type: 'replace', data: {oldNode:oldElement,newNode:newElement }});
  }
}
function diffProps(oldProps: Props, newProps: Props) {
  let diffPropMap = new Map();
  if (oldProps == null && newProps != null) {
    return newProps;
  }
  let keys = Object.keys(oldProps);
  for (const key of keys) {
    // 键被替换了或者被删除了
    if (oldProps[key] !== newProps[key]) {
      diffPropMap.set(key,newProps[key])
    }
  }
  let newKeys = Object.keys(newProps);
  for (const key of newKeys) {
    //新增属性
    if (!oldProps.hasOwnProperty(key)) {
      diffPropMap.set(key,newProps[key])
    }
  }
  if(diffPropMap.size>0){
    return diffPropMap;
  }
}

function diffChildren(
  oldChildren: Children,
  newChildren: Children,
  parent: VElement,
  task: Task[]
) {

  let moveList: string | any[] = []
  for(let i = 0; i < newChildren.length; i++){
    const newChild = newChildren[i];
    let oldInd;
    let oldNode;
    for (let j = 0; j < oldChildren.length; j++) {
      let oldChild = oldChildren[j];
      if(oldChild.key === newChild.key){
        oldInd = j;
        oldNode = oldChild;
        break;
      }
    }
  
console.log(oldNode,oldInd)

    if(oldInd != null && oldNode){
      if (i !== oldInd) {
        moveList.push({node:oldNode,nNode: newChild,from:oldInd,to:i})
      }
      let deepTask = diff(oldNode,newChild);
      task.push(...deepTask)

    }else{
      task.push({type:'child',data:{type:'create',node:parent,nNode: newChild,at:i}});
    }
  }
  if(moveList.length>0){
    task.push({type:'child',data:{type:'move',node:parent,path:moveList}})

  }
  for(let i = 0; i < oldChildren.length; i++){
    const  oldChild = oldChildren[i];
    let flag = false;
    for (let j = 0; j < newChildren.length; j++) {
      let newChild = newChildren[j];
      if(oldChild.key === newChild.key){
        flag = true;
        break;
      }
    }
    console.log(flag)
    if(!flag){
      task.push({type:'child',data:{type:'remove',node: oldChild}})
    }
  }

 
}
