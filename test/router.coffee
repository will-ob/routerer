

Router = router(_, Backbone)

describe "Router", ->

  class OtherRouter extends Router
  class Thing
    close: ->

  it "exists", ->
    expect(Router).to.be.defined

  beforeEach ->
    @route = "things/:stuff"
    @Page = sinon.stub()
    @Page.name = "SomeClassName"
    @Page::close = (->)
    @Page.returns(new Thing)
    Router.addRoute.call(OtherRouter, @route, @Page)

  describe ".addRoute", ->

    it "adds a route to the routes", ->
      expect(OtherRouter::routes).to.include.keys(@route)

    it "adds handler to the prototype", ->
      handler = OtherRouter::routes[@route]
      expect(OtherRouter::[handler]).be.defined

    describe "handler", ->
      beforeEach ->
        @router = new OtherRouter
        Backbone.history.start(silent:true)
        @router.navigate(@route, {trigger: true})
        @opts = @Page.args[0][0]

      afterEach ->
        Backbone.history.stop()
        window.location.hash = ""

      it "sets the current page", ->
        expect(@router.currentPage).to.be.defined

      it "creates a new page", ->
        expect(@Page.called).to.be.true

      it "constructs with a router", ->
        expect(@opts.router).to.eq(@router)

      it "constructs with an el", ->
        expect(@opts.el).to.be.defined

      it "constructs with args", ->
        expect(@opts.args).to.be.defined
        expect(@opts.args).to.include.keys("stuff")

  describe "new page", ->
    class StatsPage
      close: ->

    beforeEach ->
      OtherRouter.addRoute("stats", StatsPage)
      @router = new OtherRouter
      Backbone.history.start(silent:true)
      @router.navigate(@route, {trigger: true})

    afterEach ->
      Backbone.history.stop()

    it "closes the last page before opening the next", ->
      # Little tricky, 2nd navigate must be a different, valid route
      # If this fails, ensure stats is valid route
      spy = sinon.spy(@router.currentPage, "close")
      @router.navigate("stats", {trigger: true})
      expect(spy.called).to.be.true



