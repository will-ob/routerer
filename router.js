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


  extractArguments = function(protoPath, args){
    var obj = {},
        parts = protoPath.split('/');

    if (protoPath == null) protoPath = "";
    if (args == null) args = [];

    // Only ':'-prefixed parts
    parts = _.select(parts, function(part){
      return part[0] == ":"
    })

    _.each(parts, function(part, idx){
      var key = part.slice(1) // remove ':'
      obj[key] = args[idx]
    })

    return obj
  }



  // The this is to permit subclassing of router
  // Not a requirement, but makes testing easier
  Router.addRoute = function(path, page){
    var handlerName = _.uniqueId("handler");

    if (! page.prototype.close ){
      throw new Error("Page must have a close method");
    }


    this.prototype.routes[path] = handlerName;
    this.prototype[handlerName] = function() {
      var args = extractArguments(path, Array.prototype.slice.apply(arguments))

      this.currentPage = new page({
        el: document.getElementById('page'),
        router: this,
        args: args
      });
    }
  }
  return Router;
}

