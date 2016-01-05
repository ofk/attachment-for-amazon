(function (global) {
  var tiny = global.tiny = {
    callbacks: [],
    initialize(fn) {
      this.callbacks.push(fn);
      this.initialized && this.start();
    },
    start() {
      this.initialized = true;
      while (this.callbacks.length) {
        this.callbacks.shift()(tiny);
      }
    }
  };

  global.chrome.runtime.getBackgroundPage((background) => {
    tiny.options = background.tiny.options.get();
    tiny.optionsPage = {
      container(label) {
        var divElement = document.createElement('div'),
            labelElement = divElement.appendChild(document.createElement('label'));
        labelElement.appendChild(document.createElement('span')).appendChild(document.createTextNode(label));
        document.body.appendChild(divElement);
        return labelElement;
      },
      checkbox(label, onchange) {
        var callable = typeof onchange === 'function',
            inputElement = document.createElement('input');
        inputElement.type = 'checkbox';
        inputElement.addEventListener('change', (event) => {
          callable ? onchange(event.target.checked) : (tiny.options[onchange] = event.target.checked);
          background.tiny.options.set(tiny.options);
        });
        callable || (inputElement.checked = tiny.options[onchange]);
        var labelElement = this.container(label);
        labelElement.parentNode.setAttribute('class', 'checkbox');
        labelElement.insertBefore(inputElement, labelElement.firstChild);
        return inputElement;
      },
      text(label, onchange) {
        var callable = typeof onchange === 'function',
            inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.size = 36;
        inputElement.addEventListener('input', (event) => {
          callable ? onchange(event.target.value) : (tiny.options[onchange] = event.target.value);
          background.tiny.options.set(tiny.options);
        });
        callable || (inputElement.value = tiny.options[onchange]);
        var labelElement = this.container(label);
        labelElement.appendChild(document.createTextNode(' '));
        return labelElement.appendChild(inputElement);
      }
    };
    tiny.start();
  });
}(this));
