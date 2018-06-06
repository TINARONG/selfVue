/**
 * Created by Administrator on 2018/5/30.
 */
function SelVue(options) {
    var self = this;
    this.vm = this;
    this.data = options.data;
    
    Object.keys(this.data).forEach(function (key) {
        self.proxyKeys(key); //绑定代理属性
    })
    observe(this.data);
    new Compile(options.el, this.vm);
    return this;
}

SelVue.prototype = {//这下我们就可以直接通过'  selfVue.name = 'canfoo'  '的形式来进行改变模板数据了
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