
goog.provide('ff.model.CatchPathPart');



/**
 * @interface
 */
ff.model.CatchPathPart = function() { };


/** @return {string} The name of the part. */
ff.model.CatchPathPart.prototype.getName;


/** @return {string} The url for the image. */
ff.model.CatchPathPart.prototype.getImageUrl;


/**
 * Converts the fish to JSON.
 * @return {!Object}
 */
ff.model.CatchPathPart.prototype.toJson;
