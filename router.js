module.exports.createRouter = function (_, Backbone){

  var Router = Backbone.Router.extend({
    routes: {},
    execute: function(){
      if (_.isFunction(this.close)) {
        this.close();
      }
      Backbone.Router.prototype.execute.apply(this, arguments);
    }
  });

  // Returns an object of the arguments indexed by their
  // name in the protoPath.
  //
  // Eg. protoPath: '/users/:user_id/hats/:hat_id'
  //     args: [246, 7]
  //
  //     Would return { user_id: 246, hat_id: 7 }
  //
  // protoPath - (string) the Backbone router path from
  // which args was derrived from.
  //
  // args - (array) arguments array that would have been
  // passed by Backbone to the handler function
  extractArguments = function(protoPath, args){
    var obj = {},
        parts = protoPath.split('/');

    if (protoPath === null) protoPath = "";
    if (args === null) args = [];

    // Only ':'-prefixed parts
    parts = _.select(parts, function(part){
      return part[0] == ":";
    });

    _.each(parts, function(part, idx){
      var key = part.slice(1); // remove ':'
      obj[key] = args[idx];
    });

    return obj;
  };
  return Router;
};

module.exports.addRoute = function(Router, path, pageInitFn){
  var handlerName = _.uniqueId("handler");

  Router.prototype.routes = Router.prototype.routes || {};
  Router.prototype.routes[path] = handlerName;
  Router.prototype[handlerName] = function() {
    var args = extractArguments(path, Array.prototype.slice.apply(arguments));

    this.close = pageInitFn({
      el: document.getElementById('page'),
      router: this,
      args: args
    });

    if ( ! _.isFunction(this.close) ) {
      console.warn("Page's init function did not return a `close` function.");
    }
  };
};

