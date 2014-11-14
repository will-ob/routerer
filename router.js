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

  // Re
  extractUrlParams = function(str){
    var params = {};

    if (str === null) { str = ""; }

    // Split by '&', process each as a kv pair
    _.each(str.split('&'), function(kvStr){
      pair = kvStr.split('=');

      if (pair.length == 1) {
        params[pair[0]] = void 0;
      } else {
        // Add key/value to params
        params[pair[0]] = pair[1] || null;
      }
    });

    return params;
  }

  // Returns an pojso containing the args parsed from
  // the protyotype path and actual path. It also
  // includes the parameter string if there is one. And
  // finally, an object of parameters parsed from
  // the parameter string.
  //
  // Eg. protoPath: '/users/:user_id/hats/:hat_id?admin=true&stuff'
  //     args: ['246', '7']
  //
  //     Would return:
  //
  //       {
  //         args: { user_id: '246', hat_id: '7' },
  //         urlParamsStr: 'admin=true&stuff',
  //         urlParams: { admin: 'true', stuff: undefined }
  //       }
  //
  // protoPath - (string) the Backbone router path from
  // which args was derrived from.
  //
  // args - (array) arguments array that would have been
  // passed by Backbone to the handler function
  extractUrlData = function(protoPath, args){
    var urlParamsStr,
        urlParams,
        obj = {},
        parts = protoPath.split('/');

    if (protoPath === null) protoPath = "";
    if (args === null) args = [];

    // Select ':'-prefixed parts
    parts = _.select(parts, function(part){
      return part[0] == ":";
    });

    // Add each :-prefixed part and its corresponding
    // value to the return object
    _.each(parts, function(part, idx){
      var key = part.slice(1); // remove ':'
      obj[key] = args[idx];
    });

    if((parts.length+1) == args.length) {
      // Add in URL params, which is the last
      // argument passed to the handler since Backbone 1.1.1
      var urlParamsStr = args.slice(-1).pop();
      var urlParams = extractUrlParams(urlParamsStr)
    } else if ((parts.length+1) < args.length)  {
      console.warn(
        "Routerer: Assumptions violated. " +
        "Please report pattern and path to " +
        "https://github.com/will-ob/routerer/issues"
      );
    }

    return {
      args: obj,
      urlParams: (urlParams || []),
      urlParamsStr: (urlParamsStr || null)
    };
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
      var pageInitOptions;

      pageInitOptions = extractUrlData(path, Array.prototype.slice.apply(arguments));
      pageInitOptions.router = this;
      pageInitOptions.el = document.getElementById('page');

      this.currentPage = new page(pageInitOptions);
    };
  };
  return Router;
};

