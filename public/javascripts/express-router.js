(function () {
    var routes = [];
    function Req() {
        this.url = location.pathname + location.search;
    }

    function Res() {

    }

    Req.prototype.render = function (templateName, options) {
                
    }
    
    function start(Backbone, routes) {
        var handlers = {}, Router;

        Object.keys(routes).map(function (route) {
            handlers[route] = function () {
                routes[route](new Req(), new Res());
            }
        });

        Backbone.history.start({pushState: true, root: '/'});
        Router = Backbone.Router.extend({
            routes: handlers
        });
        return new Router();
    }

    module.exports = {
        start: start
    };
    /*
    router = router.start(Exoskeleton, {
        '': function () {
            console.log(arguments);
        },
        'room/:id': function () {
            console.log(arguments);
        }
    })
    */

}());

