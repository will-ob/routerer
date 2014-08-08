this-is-how-i-route
===================

```
This is how I route.
- Mims ?
```

Slim, testable router.

Install
---------

```
npm install --save git+ssh://git@github.com:will-ob/this-is-how-i-route.git
```

Use
----------

The easiest way to define a route:

```
// Yes, really, the function on the costructor function
Router.addRoute("",             IndexPage);
```

Add some more

```
_        = require('lodash');
Backbone = require('backbone');
Router   = require('router')(_, Backbone);

Router.addRoute("login",        LoginPage);
Router.addRoute("sign-up",     SignUpPage);
Router.addRoute("account",    AccountPage);
```

Routes can also be added as you might expect if you were subclassing the `Backbone.Router`. Buhhhht, dooooon't - that will take us right back to where we started. (see '[Ok, but why](#ok-but-why)')

```
MyRouter = Router.extend({
  routes: {
    'things': 'stuff'
  },
  stuff: function(){
    // Handler logic
  }
});
```
When you've got everything configured,

```
var router = new Router();
Backbone.history.start();
```

Ok, but why
---------------

Well, testing - and we'll get to that. But first, uniformity:

Every view gets an `el`, a map of url params, and a reference to the `router`.

```
// 'user/:id/images/:page'
// is == to calling:

new SignUpPage({
  el: $('page-el-owned-by-router'),
  router: thisRouter,
  args: {id: "24", page: "742"}
});
```

Views can then set themselves up with any configuration required.

```
SignUpPage = function(opts) {
  if(opts == null){ opts = {}; };

  if( opts.router.logged_in ){
    opts.router.navigate('', true);
  } else {
    opts.el.html(signUpForm);
  }
}
```

And all views are disposed of the same way, automatically, by the router.

```
page.close();
```

Without some enforced consisntency, your `router` slips into tragedy. With this set-up, the router is _just_ your routes. You couldn't write a `routeHandler` if you tried. _figure of speech, I'm sure you're quite capable._

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


