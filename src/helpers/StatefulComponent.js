import {alignWithDOM} from 'incremental-dom/src/alignment.js';
import {getWalker} from 'incremental-dom/src/walker.js';
import {getData} from 'incremental-dom/src/node_data.js';
import {nextSibling} from 'incremental-dom/src/traversal.js';

/*

Statefull components that can decide whether they need to be re-rendered to improve performance.

This is a function creates a function that can be called in a render (`IncrementalDOM.patch()`).

Requirements:

- Handle initial render
- Handle parent re-render
- Handle component re-render (setState called)

*/

function Component(reduce, render, props, shouldUpdate){
  this.reduce       = reduce;
  this._render      = render;
  this.state        = reduce(props);
  this.props        = props;
  this.setState     = this.setState.bind(this);
  this.shouldUpdate = shouldUpdate;
}

Component.prototype.render = function(){
  return this._render(this.props, this.state, this.setState);
};

// Called by the component to set the new state and re-render the component without re-rendering the
// whole document
Component.prototype.setState = function(newState){
  const parentNode = this.node.parentNode;
  this.state = newState;

  IncrementalDOM.patch(parentNode, ()=>{
    const walker = getWalker();
    // Skip over all siblings before component's element
    while(walker.currentNode !== this.node){
      nextSibling();
    }

    this.render();

    // Mark the last child as visited so IncrementalDOM
    // doesn't truncate all sibling elements after the
    // component's element
    getData(parentNode).lastVisitedChild = parentNode.lastChild;
  });
};

export default ({reduce, render, shouldUpdate})=>{
  // When rendering a component, we need to determine whether it's one of the following cases:
  //   - Initial render
  //   - Re-render
  //
  // We can determine this by asking IncrementalDOM whether we're about to render to an existing
  // node (`IncrementalDOM.getMatchingNode(nodeName, key)`).
  // The node name isn't known at the time of component declaration, but can be determined on
  // the very first render.
  let rootNodeName;

  return props=>{
    const key = props && props.key;

    // Asking IncrementalDOM whether we are going to be re-rendering an existing component
    // or rendering a new component.
    let node      = rootNodeName && alignWithDOM(rootNodeName, key);
    let component = node && node.__component;

    // Render a new component
    if(!component){
      component = new Component(reduce, render, props, shouldUpdate);

      // To determine the component's root element, we ask IncrementalDOM to track the first
      // element rendered.
      node = component.render();

      // if(__DEV__){
      if(!node){
        console.log("Component render did not return a rendered node", component.render.toString());
      }
      // }

      rootNodeName = node.nodeName.toLowerCase();
      component.node = node;
      node.__component = component;
    }
    // Parent re-render
    else{
      let prevProps = component.props;
      component.props = props;
      if(!component.shouldUpdate || component.shouldUpdate(props, prevProps)) {
        component.render();
      }
      else{
        nextSibling();
      }
    }
  };
};