

Router = routerer.createRouter(_, Backbone)
addRoute = routerer.addRoute

describe "Router", ->

  class OtherRouter extends Router

  it "exists", ->
    expect(Router).to.be.defined

  beforeEach ->
    @Router = OtherRouter

    @page = sinon.stub()
    @page.returns((->))

    @route = "things/:stuff"

    addRoute(@Router, @route, @page)

  describe "#addRoute", ->

    it "adds a route to the routes", ->
      expect(@Router::routes).to.include.keys(@route)

    it "adds handler to the prototype", ->
      handler = @Router::routes[@route]
      expect(@Router::[handler]).be.defined

    describe "handler", ->
      beforeEach ->
        @router = new OtherRouter
        Backbone.history.start(silent:true)
        @router.navigate(@route, {trigger: true})
        @opts = @page.args[0][0]

      afterEach ->
        Backbone.history.stop()
        window.location.hash = ""

      it "sets the close fn", ->
        expect(@router.close).to.be.defined

      it "creates a new page", ->
        expect(@page.called).to.be.true

      it "constructs with a router", ->
        expect(@opts.router).to.eq(@router)

      it "constructs with an el", ->
        expect(@opts.el).to.be.defined

      it "constructs with args", ->
        expect(@opts.args).to.be.defined
        expect(@opts.args).to.include.keys("stuff")

  describe "new page", ->

    # Note that routes must exist on the router before
    # an instance of the router is constructed. They
    # cannot be added after that point.

    beforeEach ->
      _this = this
      @idxPage = -> return _this.closeSpy = sinon.spy()

      addRoute(OtherRouter, "", @idxPage)
      addRoute(OtherRouter, "stats", -> (->))

      # Set to other so index page is constructed
      window.location.hash = "other"
      @router = new OtherRouter

      Backbone.history.start(silent:true)
      @router.navigate("", {trigger: true})

    afterEach ->
      Backbone.history.stop()

    it "closes the last page before opening the next", ->
      # Little tricky, 2nd navigate must be a different, valid route
      # We expect index's close to have been set and now called
      @router.navigate("stats", {trigger: true})
      expect(@closeSpy.called).to.be.true



