class Props {
    [key: string]: any
  }
  
  interface IFunction extends Function {
    readonly fn?: any
  }
  
  export class EventBus implements Props {
    static instance: any = null;
  
    constructor() {
      if (!EventBus.instance) EventBus.instance = this;
      return EventBus.instance
    }
  
    events: { [key: string]: Array<IFunction> } = Object.create(null);
    emit = (event: string, ...args: any[]) => { //发布
      let cbs = this.events[event];
      cbs = cbs ? Array.isArray(cbs) ? cbs : Array.from(cbs) : [];
      cbs.forEach(fn => {
        fn.apply(null, args);
      });
    };
    on = (event: string | string[], fn: Function) => { //订阅
      if (Array.isArray(event)) {
        event.forEach(item => {
          this.on(item, fn);
        });
      } else {
        (this.events[event] || (this.events[event] = [])).push(fn);
      }
      return this;
    };
    off = (event?: string | string[], fn?: Function) => { //取消订阅
      if (!event && !fn) {
        this.events = Object.create(null);
        return this;
      }
      if (Array.isArray(event)) {
        event.forEach(item => {
          this.off(item, fn);
        });
        return this;
      }
      const cbs = event ? this.events[event] : null;
      if (!cbs) return this;
      if (!fn) {
        this.events = Object.create(null);
        return this;
      }
      let i = cbs.length, cb;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break;
        }
      }
      return this;
    };
    once = (event: string | string[], fn: Function) => { //单次订阅
      const on = (...args: any) => {
        this.off(event);
        fn.apply(this, args);
      };
      on.fn = fn;
      this.on(event, on);
      return this;
    };
  }
  
  export default new EventBus();
  