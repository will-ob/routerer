module.exports = function (_, Backbone){

  var Router = Backbone.Router.extend({
    routes: {},
    execute: function(){
      if (_.isObject(this.currentPage)) {
        if (_.isFunction(this.currentPage.close)) {
          this.currentPage.close();
        } else {
          console.warn('Page has no `close` method!');
        }
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

      // In case of queryString
      if(/\w+=\w+(\&\w+=\w+)*/g.test(args[idx])){
        querys = (_ref = args[idx]) != null ? _ref.split('&') : null;
        obj[key] = {};
        _.each(querys, function(q) {
          key_val = q.split('=');
          obj[key][key_val[0]] = key_val[1];
        });

      } else {
        obj[key] = args[idx];
      }

    });

    return obj;
  };



  // The this is to permit subclassing of router
  // Not a requirement, but makes testing easier
  Router.addRoute = function(path, page){
    var handlerName = _.uniqueId("handler");

    if (! page.prototype.close ){
      throw new Error("Page must have a close method");
    }


    this.prototype.routes[path] = handlerName;
    this.prototype[handlerName] = function() {
      var args = extractArguments(path, Array.prototype.slice.apply(arguments));

      this.currentPage = new page({
        el: document.getElementById('page'),
        router: this,
        args: args
      });
    };
  };
  return Router;
};

