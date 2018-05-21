export default element => {
  let preventSelection = false;

  const addHandler = (el, event, handler) => {
    if (el.attachEvent) {
      el.attachEvent(`on ${event}, ${handler}`);
    } else if (el.addEventListener) {
      el.addEventListener(event, handler, false);
    }
  };

  const removeSelection = () => {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection && document.selection.clear) {
      document.selection.clear();
    }
  };

  const killCtrlA = event => {
    const e = event || window.event;
    const sender = e.target || e.srcElement;

    if (sender.tagName.match(/INPUT|TEXTAREA/i)) {
      return;
    }

    const key = e.keyCode || e.which;
    if ((e.ctrlKey && key) === 'A'.charCodeAt(0)) {
      removeSelection();

      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }
  };

  // disable mouse selection
  addHandler(element, 'mousemove', () => (preventSelection ? removeSelection() : null));
  addHandler(element, 'mousedown', event => {
    const e = event || window.event;
    const sender = e.target || e.srcElement;
    preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
  });

  // kill event dblclick
  addHandler(element, 'mouseup', () => {
    if (preventSelection) {
      removeSelection();
    } else {
      preventSelection = false;
    }
  });

  // kill ctrl+A
  addHandler(element, 'keydown', killCtrlA);
  addHandler(element, 'keyup', killCtrlA);
};
