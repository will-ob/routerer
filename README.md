Routerer
===================

```
This is how I route.
- Mims ?
```

Slim, testable router.

Install
---------

#### bower

```
bower install --save will-ob/routerer
```

#### npm
```
npm install --save git+ssh://git@github.com:will-ob/routerer.git
```

Use
----------

The easiest way to define a route:

```
var routerer = require('routerer'),
    MyRouter = routerer.createRouter(_, Backbone),
    addRoute = routerer.addRoute;

addRoute(MyRouter, "",  IndexPage);

```

Add some more:

```
//       Router    Path                  Initializing Function

addRoute(MyRouter, "login",                      loginPageInit);
addRoute(MyRouter, "sign-up",                   signUpPageInit);
addRoute(MyRouter, "account",                  accountPageInit);
addRoute(MyRouter, "user/:id/images/:page", userImagesPageInit);
```

Routes can also be added as you might expect if you were subclassing the `Backbone.Router`. Buhhhht, dooooon't - that will take us right back to where we started. (see '[Ok, but why](#ok-but-why)')

When you've got everything configured,

```
var myRouter = new MyRouter();
Backbone.history.start();
```

Ok, but why
---------------

Well, testing - and we'll get to that. But first, uniformity:

Every view gets an `el`, a map of url params, and a reference to the `router`.

```
// navigating to 'user/:id/images/:page', as is
// declared above, is the same as calling:

userImagesPageInit({
  el: $('page-el-owned-by-router'),
  router: myRouter,
  args: {id: "24", page: "742"}
});
```
Views can then set themselves up with any configuration required.

```
userImagesPageInit = function(opts) {
  if(opts == null){ opts = {}; };

  if( opts.router.logged_in ){
    opts.router.navigate('', true);
  } else {
    opts.el.html(signUpForm);
  }

  // Always return a teardown / close method
  return function(){

    // free all the memory!
    $(opts.el).html("");

  }
}
```

The router will always call the close method before navigating to a new page.

Without some enforced consistency, your `router` slips into tragedy. With this set-up, the router is _just_ your routes. You couldn't write a `routeHandler` if you tried. _figure of speech, I'm sure you're quite capable._

At the end of the day, the complexity of your router stays pretty constant. There's no chance developers will have to load an exponentially increasing amout of complexity into their heads each time they want to add _a_ route.

Testing your pages
------------------

When you test your views, you don't have to pass them a real router.

```
context("user is signed in", function(){
  beforeEach(function(){
    this.router = {
      navigate: function(){}
    }
  });

  it("routes to index", function(){
    var spy = sinon.spy(this.router, 'navigate'),
        page = new LoginPage({router: router});

    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0]).to.eql('');
    expect(spy.firstCall.args[1]).to.eql(true);
  });
});
```


License
--------

The MIT License (MIT)

Copyright (c) 2014 Will O'Brien


