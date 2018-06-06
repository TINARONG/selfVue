/**
 * Created by Administrator on 2018/5/30.
 */
/*
*Compile解析器，用于解析DOM节点和绑定工作
* 需要实现：
* 1.解析模板指令，并替换模板数据，初始化视图
* 2.将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器
* 3.fragment:将需要解析的dom节点存入其中再进行处理。
* */
function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el)
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function () {
        if(this.el){
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);//重新渲染后替换原dom
        } else {
            console.log('dom不存在')
        }
    },
    nodeToFragment: function(el){//fragment
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            //将DOM元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild;
        };
        return fragment;
    },
    compileElement: function (el) {//遍历各个节点，对含有相关指定的节点进行特殊处理
        var self = this;
        var childNodes = el.childNodes;//childNodes:所有子节点（包含元素节点和文档节点）
        [].slice.call(childNodes).forEach(function (node) {
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent;//获取元素中的文本内容
            
            if(self.isElementNode(node)){//处理事件
                self.complie(node);
            } else if(self.isTextNode(node) && reg.test(text)){//视图内赋值，只考虑了{{}}这一种情况；
                self.compileText(node, reg.exec(text)[1]);
            }
        
            if(node.childNodes && node.childNodes.length){
                self.compileElement(node);//继续递归遍历子元素
            }
        })
    },
    complie:function (node) {//用于解析处理指令
       
        var self = this;
        var nodeAttrrs = node.attributes;//dom属性
        Array.prototype.forEach.call(nodeAttrrs,function (attr) {//遍历所有节点属性
            var attrName = attr.name;
            if(self.isDirective(attrName)){
                var exp = attr.value;
              
                var dir = attrName.substring(2);
                if(self.isEventDirective(dir)){//事件指令(v-on)
                    self.compileEvent(node, self.vm, exp, dir)
                } else { //v-modal
                    self.compileModal(node, self.vm, exp, dir)
                }
                node.removeAttribute(attrName);
            }
        })
    },
    compileText:function (node, exp) {//匹配到{{}}的处理
        var self = this;
        var initText = self.vm[exp];
        self.updateText(node, initText);//初始化时将初始数据data赋值到视图中；
        new Watcher(self.vm, exp,function (value) {//生成订阅器，绑定更新函数
            self.updateText(node, value);
        })
    },
    compileEvent: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];
        if(eventType && cb){
            node.addEventListener(eventType,cb.bind(vm),false)
        }
    },
    compileModal:function (node, vm, exp, dir) {
        var self = this;
        var val = this.vm[exp];
        console.log(val);
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, function (value) {
            self.modelUpdater(node, value);
        });
        
        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            console.log(newValue);
            if(val === newValue){
                return;
            }
            self.vm[exp] = newValue;
            val = newValue;
        })
    },

    isDirective: function (attr) {
      return  attr.indexOf('v-') == 0
    },
    updateText: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    modelUpdater: function (node, value, oldValue) {
        node.value = typeof  value == 'undefined' ? '' : value;
    },
    isEventDirective: function (dir) {
        return dir.indexOf("on:") === 0
    },
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    isTextNode: function (node) {
        return node.nodeType == 3
    },
    
}


