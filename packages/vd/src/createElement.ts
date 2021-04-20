/**
 * 
 * @param tagName 
 * @param props 
 * @param children 
 */
function createVElement(tagName:string,props:any,children:VElement['children'],key:any){
    return new VElement(tagName,props,children,key)
}


export class VElement {
    tagName: string;
    props: any;

    key: any;

    parent?:VElement;


    children:VElement[];


    el?: Element | Text;
    constructor(tagName:string, props: any, children: VElement['children'],key:any){
        this.tagName = tagName;
        this.props = props;
        this.children = children;
        this.key = key;

        for(let child of children){
            child.parent = this;
        }
    }

    render(){
        if(this.tagName === 'text'){
            this.el = document.createTextNode(this.props['value'])
        }else{
            this.el = document.createElement(this.tagName);
        }
        
        let keys = Object.keys(this.props);
        if(this.el instanceof Element){
            for(let key of keys){
                if(key.startsWith('on')){
                    this.el.addEventListener(key.substr(2),this.props[key])
                }else{

                    this.el.setAttribute(key,this.props[key])
                }
            }
        }
        this.children?.forEach(child=>{
            child.render();
            
            if(child.el){
                if(this.el instanceof Element){
                    this.el?.appendChild(child.el)
                }
            }
        })
    }
}

export const c = createVElement;