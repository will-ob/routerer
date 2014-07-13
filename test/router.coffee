
Router = router(_, Backbone)

describe "Router", ->

  class OtherRouter extends Router
  class Thing
    close: ->

  it "exists", ->
    expect(Router).to.be.defined

  beforeEach ->
    @route = "things"
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

  describe "#logout", ->
    beforeEach ->
      @router = new OtherRouter
      Backbone.history.start(silent:true)
      requests = @requests = []

      @xhr = sinon.useFakeXMLHttpRequest()
      @xhr.onCreate = (xhr) -> requests.push(xhr)

      @locationReplace = sinon.stub(window.location, "replace")

    afterEach ->
      @xhr.restore()
      Backbone.history.stop()
      window.location.hash = ""
      @locationReplace.restore()

    it "deletes the session", ->
      @router.navigate("logout", {trigger: true})
      expect(@requests).to.have.length(1)
      req = @requests[0]
      expect(req.method).to.eql("DELETE")
      expect(req.url).to.eql("/v1/session")

    it "routes to /", ->
      @router.navigate("logout", {trigger: true})
      @requests[0].respond(204, {})
      expect(@locationReplace.called).to.be.true
      expect(@locationReplace.firstCall.args[0]).to.eq("/")


  describe "#getCurrentUser", ->
    context "user is logged in", ->
      user = {id: "some-id"}
      beforeEach ->
        @server = sinon.fakeServer.create()
        @server.respondWith('/v1/me', [200, {"Content-Type": "application/json"}, JSON.stringify(user) ])
        @router = new Router()

      it "promise resolves with the user", (done) ->
        @router.getCurrentUser().then((u)  =>
          expect(u.id).to.equal(user.id)
          done()
        ).done()
        @server.respond()

    context "user is not logged in", ->
      beforeEach ->
        @server = sinon.fakeServer.create()
        @server.respondWith('/v1/me', [401, {"Content-Type": "application/json"}, JSON.stringify({errors: "Unauthorized"}) ])
        @router = new Router()

      it "fails if no user is authenticated", ->
        spy = sinon.spy()
        @router.getCurrentUser()
          .fail(spy)
          .fin( -> expect(spy.called).to.be.true )
          .done()
        @server.respond()

  describe "#logout", ->

    xit "logs the user out"

    xit "navigates to root"


