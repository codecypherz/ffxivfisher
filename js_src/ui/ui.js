/**
 * The set of UI related utilities.
 */

goog.provide('ff.ui');

goog.require('goog.dom');


/**
 * Gets the first element within the component that uses the ID fragment.
 * @param {!goog.ui.Component} component The component in which to search.
 * @param {string} idFragment The fragment from which to generate the ID.
 * @return {Element} The element, if found.
 */
ff.ui.getElementByFragment = function(component, idFragment) {
  var root = component.getElement();
  if (!root) {
    throw Error('The component does not have its element set.');
  }
  return ff.ui.getElement(component.makeId(idFragment), root);
};


/**
 * Gets the element by ID, but with an option to scope.  When using a scope,
 * the element does not have to be in the document to be found.
 * @param {string} id The ID by which to search for the element.
 * @param {Element=} opt_root The scope of the search.
 * @return {Element} The element, if found.
 */
ff.ui.getElement = function(id, opt_root) {
  var domHelper = goog.dom.getDomHelper();
  if (opt_root) {
    // findNode only checks descendants of the root.
    if (opt_root.id == id) {
      return opt_root;
    }
    return /** @type {Element} */ (domHelper.findNode(opt_root, function(node) {
      return node.id == id;
    }));
  } else {
    return domHelper.getElement(id);
  }
};
