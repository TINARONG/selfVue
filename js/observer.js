/**
 * Created by Administrator on 2018/5/30.
 */
//个监听器Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。
function defineReactive(data,key,val) {
    observe(val);//递归遍历所有子属性
    var dep = new Dep();
    Object.defineProperty(data,key,{
        enumerable: true,
        configurable: true,
        get:function () {
            console.log('get' + val)
            //将订阅器Dep添加一个订阅者设计在getter里面，这是为了让Watcher初始化进行触发
            if(Dep.target){//判断是否需要添加订阅者
                dep.addSub(Dep.target);//在这里添加一个订阅者
            }
            return val;
        },
        set: function (newVal) {
            val = newVal;
            console.log("属性" + key + '已经被监听到了，现在值为"' + newVal.toString() + '"');
            dep.notify();//数据变化后通知订阅者；
        }
    })
}
//监听器
function observe(data){
    if(!data || typeof data !== 'object'){
        return
    }
    Object.keys(data).forEach(function (key) {
        defineReactive(data,key,data[key])
    })
}

//需要创建一个可以容纳订阅者的消息订阅器Dep，订阅器Dep主要负责收集订阅者，然后再属性变化的时候执行对应订阅者的更新函数。
//订阅器
function Dep() {
    this.subs = [];
}
Dep.prototype = {
    addSub: function (sub) {
        this.subs.push (sub);
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            //sub:watcher
            sub.update();
        })
    }
}

// var library = {
//     book1: {
//         name: ''
//     },
//     book2: ''
// };
//
//
// observe(library);
// library.book1.name = 'vue权威指南'; // 属性name已经被监听了，现在值为：“vue权威指南”
// library.book2 = '没有此书籍';  // 属性book2已经被监听了，现在值为：“没有此书籍”