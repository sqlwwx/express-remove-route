module.exports = function removeRoute(app, path) {
    var found, routes = [], stack, idx;

    found = findRoute(app, path);
    routes = found.routes;
    stack = found.stack;

    if (routes.length === 0) return 0;

    var removeCount = 0;
    routes.forEach(function (route){
      idx = stack.indexOf(route);
      stack.splice(idx, 1);
      removeCount++;
    });
    return removeCount;
};

module.exports.findRoute = findRoute;

function findRoute(app, path) {
    var routes = [], stack;

    stack = app._router.stack;

    function _findRoute(path) {
        stack.forEach(function(layer) {
            if (!layer) return;
            if (layer && !layer.match(path)) return;
            if (['query', 'expressInit'].indexOf(layer.name) != -1) return;
            if (layer.name == 'router') {
                stack = layer.handle.stack;
                _findRoute(trimPrefix(path, layer.path));
            } else {
                routes.push(layer);
            }
        });
    }

    _findRoute(path, stack);

    if (routes.length === 0) return null;
    return {routes: routes, stack: stack};
}

function trimPrefix(path, prefix) {
    // This assumes prefix is already at the start of path.
    return path.substr(prefix.length);
}
