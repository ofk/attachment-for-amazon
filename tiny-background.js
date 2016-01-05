(function (global, localStorage) {
  var tiny = global.tiny = {};

  tiny.storage = {
    getData(key) {
      var val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    },
    setData(key, val) {
      localStorage.setItem(key, JSON.stringify(val));
    },
    get(key, force) {
      var data = this.getData(key);
      if (!force && data && data.expire) {
        if (new Date(data.expire).getTime() <= Date.now()){
          data = null;
        }
      }
      return data && data.hasOwnProperty('value') ? data.value : data;
    },
    set(key, value, expire) {
      var data = { value };
      if (expire) {
        if (expire instanceof Date) {
          data.expire = expire.toString();
        } else if (typeof expire === 'number') {
          data.expire = new Date(Date.now() + expire).toString();
        } else {
          throw new Error('invalid expire type');
        }
      }
      this.setData(key, data);
    },
    has(key, force) {
      if (!(key in localStorage)) return false;
      return this.get(key, force) !== null;
    },
    touch(key, expire) {
      var data = this.get(key, true);
      if (data) this.set(key, data, expire);
    }
  };

  tiny.options = {
    data: tiny.storage.get('options'),
    get() {
      return this.data;
    },
    set(data) {
      tiny.storage.set('options', data);
      this.data = data;
    }
  };

  global.chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
    case 'tiny.options':
      sendResponse({
        options: tiny.options.get()
      });
      break;
    }
  });
}(this, this.localStorage));
