var request = require('superagent'),
    Q       = require('q');

module.exports = function (_, Backbone){

  var Router = Backbone.Router.extend({
    routes: {
      "logout" : "logout"
    },
    getCurrentUser: function(){
      var def = Q.defer(),
          _this = this;

      request
        .get('/v1/me')
        .end(function(resp){
          if (resp.error.status == 401) {
            def.reject(new Error("No user signed in."));
          } else {
            def.resolve(resp.body);
          }
        });
      return def.promise;
    },
    execute: function(){
      if (_.isObject(this.currentPage)) {
        if (_.isFunction(this.currentPage.close)) {
          this.currentPage.close();
        } else {
          console.warn('Page has no `close` method!');
        }
      }
      Backbone.Router.prototype.execute.apply(this, arguments);
    },
    logout: function(){
      request
        .del('/v1/session')
        .end(function(){
          window.location.replace('/');
        });
    }
  });



  // The this is to permit subclassing of router
  // Not a requirement, but makes testing easier
  Router.addRoute = function(path, page){
    var handlerName = _.uniqueId("handler");

    if (! page.prototype.close ){
      throw new Error("Page must have a close method");
    }

    this.prototype.routes[path] = handlerName;
    this.prototype[handlerName] = function() {
      this.currentPage = new page({
        el: document.getElementById('page'),
        router: this
      });
    }
  }
  return Router;
}

