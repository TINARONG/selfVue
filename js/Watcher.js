/**
 * Created by Administrator on 2018/5/30.
 */
//订阅者Watcher在初始化的时候需要将自己添加进订阅器Dep中

function Watcher(vm, exp, cb) {
    this.cb = cb;//callback
    this.exp = exp;//放着data的key
    this.vm = vm;
    this.value = this.get();//将自己添加到订阅器的操作
};

Watcher.prototype = {
    update: function () {
        this.run();
    },
    run: function () {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if(value !== oldVal){
            this.value = value;
            this.cb.call(this.vm, value);
        }
    },
    get: function () {
        Dep.target = this;//缓存自己
        var value = this.vm.data[this.exp];//在此处触发oberver的get方法存入DEP订阅器
        Dep.target = null;//释放自己
        return value;
    }
}
