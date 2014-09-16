!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.router=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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


},{}]},{},[1])
(1)
});