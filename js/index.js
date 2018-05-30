/**
 * Created by Administrator on 2018/5/30.
 */
function SelVal(data, el, exp) {
    var self = this;
    this.data = data;
    
    Object.keys(data).forEach(function (key) {
        self.proxyKeys(key); //绑定代理属性
    })
    
    observe(data);

    el.innerHTML = this.data[exp];// 初始化模板数据的值
    
    new Watcher(this, exp, function (value) {
        el.innerHTML = value
    });
    return this;
}

SelVal.prototype = {//这下我们就可以直接通过'  selfVue.name = 'canfoo'  '的形式来进行改变模板数据了
    proxyKeys: function (key) {
        var self = this;//SelVal
        Object.defineProperty(this, key ,{
            enumerable: false,
            configurable: true,
            get: function () {
                return self.data[key];
            },
            set: function (newVal) {
                self.data[key] = newVal;
            }
        })
    }
}