/**
 * react-lazyload
 */
import React, { Component } from "react";
import ReactDom from "react-dom";
import PropTypes from "prop-types";
import { on, off } from "./utils/event";
import scrollParent from "./utils/scrollParent";
import debounce from "./utils/debounce";
import throttle from "./utils/throttle";

import decorator from "./decorator";

const defaultBoundingClientRect = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
const LISTEN_FLAG = "data-lazyload-listened";
const listeners = [];
let pending = [];
let shouldCheckVisible = true;

// try to handle passive events
let passiveEventSupported = false;
try {
  const opts = Object.defineProperty({}, "passive", {
    get() {
      passiveEventSupported = true;
    },
  });
  window.addEventListener("test", null, opts);
}catch (e) { }
// if they are supported, setup the optional params
// IMPORTANT: FALSE doubles as the default CAPTURE value!
const passiveEvent = passiveEventSupported ? { capture: false, passive: true } : false;


const setVisibleCheck = (shouldCheck) => {
  shouldCheckVisible = shouldCheck;
};

/**
 * Check if `component` is visible in overflow container `parent`
 * @param  {node} component React component
 * @param  {node} parent    component's scroll parent
 * @return {bool}
 */
const checkOverflowVisible = function checkOverflowVisible(component, parent) {
  const node = ReactDom.findDOMNode(component);

  let parentTop;
  let parentHeight;

  try {
    ({ top: parentTop, height: parentHeight } = parent.getBoundingClientRect());
  } catch (e) {
    ({ top: parentTop, height: parentHeight } = defaultBoundingClientRect);
  }

  const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;

  // calculate top and height of the intersection of the element's scrollParent and viewport
  const intersectionTop = Math.max(parentTop, 0); // intersection's top relative to viewport
  const intersectionHeight = Math.min(windowInnerHeight, parentTop + parentHeight) - intersectionTop; // height

  // check whether the element is visible in the intersection
  let top;
  let height;

  try {
    ({ top, height } = node.getBoundingClientRect());
  } catch (e) {
    ({ top, height } = defaultBoundingClientRect);
  }

  const offsetTop = top - intersectionTop; // element's top relative to intersection

  const offsets = Array.isArray(component.props.offset) ?
    component.props.offset :
    [component.props.offset, component.props.offset]; // Be compatible with previous API

  return (offsetTop - offsets[0] <= intersectionHeight) &&
         (offsetTop + height + offsets[1] >= 0);
};

/**
 * Check if `component` is visible in document
 * @param  {node} component React component
 * @return {bool}
 */
const checkNormalVisible = function checkNormalVisible(component) {
  const node = ReactDom.findDOMNode(component);

  // If this element is hidden by css rules somehow, it's definitely invisible
  if (!(node.offsetWidth || node.offsetHeight || node.getClientRects().length)) return false;

  let top;
  let elementHeight;

  try {
    ({ top, height: elementHeight } = node.getBoundingClientRect());
  } catch (e) {
    ({ top, height: elementHeight } = defaultBoundingClientRect);
  }

  const windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;

  const offsets = Array.isArray(component.props.offset) ?
    component.props.offset :
    [component.props.offset, component.props.offset]; // Be compatible with previous API

  return (top - offsets[0] <= windowInnerHeight) &&
         (top + elementHeight + offsets[1] >= 0);
};


/**
 * Detect if element is visible in viewport, if so, set `visible` state to true.
 * If `once` prop is provided true, remove component as listener after checkVisible
 *
 * @param  {React} component   React component that respond to scroll and resize
 */
const checkVisible = function checkVisible(component) {
  if (!shouldCheckVisible) {
    return;
  }
  const node = ReactDom.findDOMNode(component);
  if (!node) {
    return;
  }

  const parent = scrollParent(node);
  const isOverflow = component.props.overflow &&
                     parent !== node.ownerDocument &&
                     parent !== document &&
                     parent !== document.documentElement;
  const visible = isOverflow ?
    checkOverflowVisible(component, parent) :
    checkNormalVisible(component);
  if (visible) {
    // Avoid extra render if previously is visible
    if (!component.visible) {
      if (component.props.once) {
        pending.push(component);
      }

      component.visible = true;
      component.forceUpdate();
    }
  } else if (!(component.props.once && component.visible)) {
    component.visible = false;
    if (component.props.unmountIfInvisible) {
      component.forceUpdate();
    }
  }
};


const purgePending = function purgePending() {
  pending.forEach((component) => {
    const index = listeners.indexOf(component);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  });

  pending = [];
};

const lazyLoadHandler = () => {
  for (let i = 0; i < listeners.length; ++i) {
    const listener = listeners[i];
    checkVisible(listener);
  }
  // Remove `once` component in listeners
  purgePending();
};

// Depending on component's props
let delayType;
let finalLazyLoadHandler = null;


class LazyLoad extends Component {
  constructor(props) {
    super(props);

    this.visible = false;
  }

  componentDidMount() {
    // It's unlikely to change delay type on the fly, this is mainly
    // designed for tests
    const needResetFinalLazyLoadHandler = (this.props.debounce !== undefined && delayType === "throttle")
      || (delayType === "debounce" && this.props.debounce === undefined);

    if (needResetFinalLazyLoadHandler) {
      off(window, "scroll", finalLazyLoadHandler, passiveEvent);
      off(window, "resize", finalLazyLoadHandler, passiveEvent);
      finalLazyLoadHandler = null;
    }

    if (!finalLazyLoadHandler) {
      if (this.props.debounce !== undefined) {
        finalLazyLoadHandler = debounce(lazyLoadHandler, typeof this.props.debounce === "number" ?
          this.props.debounce :
          300);
        delayType = "debounce";
      } else if (this.props.throttle !== undefined) {
        finalLazyLoadHandler = throttle(lazyLoadHandler, typeof this.props.throttle === "number" ?
          this.props.throttle :
          300);
        delayType = "throttle";
      } else {
        finalLazyLoadHandler = lazyLoadHandler;
      }
    }

    if (this.props.overflow) {
      const parent = scrollParent(ReactDom.findDOMNode(this));
      if (parent && typeof parent.getAttribute === "function") {
        const listenerCount = 1 + (+parent.getAttribute(LISTEN_FLAG));
        if (listenerCount === 1) {
          parent.addEventListener("scroll", finalLazyLoadHandler, passiveEvent);
        }
        parent.setAttribute(LISTEN_FLAG, listenerCount);
      }
    } else if (listeners.length === 0 || needResetFinalLazyLoadHandler) {
      const { scroll, resize } = this.props;

      if (scroll) {
        on(window, "scroll", finalLazyLoadHandler, passiveEvent);
      }

      if (resize) {
        on(window, "resize", finalLazyLoadHandler, passiveEvent);
      }
    }

    listeners.push(this);
    checkVisible(this);
  }

  shouldComponentUpdate() {
    return this.visible;
  }

  componentWillUnmount() {
    if (this.props.overflow) {
      const parent = scrollParent(ReactDom.findDOMNode(this));
      if (parent && typeof parent.getAttribute === "function") {
        const listenerCount = (+parent.getAttribute(LISTEN_FLAG)) - 1;
        if (listenerCount === 0) {
          parent.removeEventListener("scroll", finalLazyLoadHandler, passiveEvent);
          parent.removeAttribute(LISTEN_FLAG);
        } else {
          parent.setAttribute(LISTEN_FLAG, listenerCount);
        }
      }
    }

    const index = listeners.indexOf(this);
    if (index !== -1) {
      listeners.splice(index, 1);
    }

    if (listeners.length === 0) {
      off(window, "resize", finalLazyLoadHandler, passiveEvent);
      off(window, "scroll", finalLazyLoadHandler, passiveEvent);
    }
  }

  render() {
    return this.visible ?
      this.props.children :
      this.props.placeholder ?
        this.props.placeholder :
        <div style={{ height: this.props.height }} className="lazyload-placeholder" />;
  }
}

LazyLoad.propTypes = {
  once: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  offset: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  overflow: PropTypes.bool,
  resize: PropTypes.bool,
  scroll: PropTypes.bool,
  children: PropTypes.node,
  throttle: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  debounce: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  placeholder: PropTypes.node,
  unmountIfInvisible: PropTypes.bool,
};

LazyLoad.defaultProps = {
  once: false,
  offset: 0,
  overflow: false,
  resize: false,
  scroll: true,
  unmountIfInvisible: false,
};
export const lazyload = decorator;
export default LazyLoad;
export {
  lazyLoadHandler as forceCheck,
  setVisibleCheck,
};
