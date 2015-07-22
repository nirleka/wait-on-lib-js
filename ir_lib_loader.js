IRLibLoader = typeof IRLibLoader === "undefined" && {};
IRLibLoader._libs = IRLibLoader._libs || {};

IRLibLoader.load = function(src, options) {
    var cssRE, handle, opt, self;
    self = this;
    opt = options;
    cssRE = /\.css$/i;
    if (!this._libs[src]) {
        this._libs[src] = {
            src: src,
            ready: false,
            readyDeps: new Deps.Dependency(),
            options: options
        };
		var isCSS = cssRE.test(src);
        $.ajax({
            url: src,
            dataType: isCSS ? 'text' : 'script',
			cache: true,
            success: function(data, textStatus, jqxhr) {
                var lib;
                lib = self._libs[src];
                if (jqxhr.status === 200) {
                    lib.ready = true;
                    lib.readyDeps.changed();
                    if (options && options.success) {
                        if (isCSS) {
                            $( 'head' ).append( '<link rel="preload stylesheet" type="text/css" href="' + src + '"/>' );
                        }
                        return options.success(data);
                    }
                }
            },
            error: function() {
                if (options && options.error) {
                    return options.error(arguments);
                }
            }
        });
    }
    return {
        ready: function() {
            var lib;
            lib = self._libs[src];
            lib.readyDeps.depend();
            return lib.ready;
        }
    };
};

var readyDeps;
var handle = {
    allReady: false
};

IRLibLoader.loadRecurse = function(srcArray, index, handle, debug) {
    if (index < 0 || index >= srcArray.length) {
        handle.setReady();
        return;
    }
    IRLibLoader.load(srcArray[index], {
        success: function() {
            if (debug) {
                console.log("Loaded: " + srcArray[index]);
            }
            IRLibLoader.loadRecurse(srcArray, index + 1, handle);
        },
        error: function(e) {
            // this one failed - but we continue with the rest
            if (debug) {
                console.log("Error loading: " + srcArray[index]);
            }
            IRLibLoader.loadRecurse(srcArray, index + 1, handle);
        }
    });
};

IRLibLoader.loadInOrder = function(srcArray, debug) {
    readyDeps = new Deps.Dependency();
    handle.ready = function() {
        readyDeps.depend();
        return this.allReady;
    };
    handle.setReady =function() {
        this.allReady = true;
        readyDeps.changed();
    };

    IRLibLoader.loadRecurse(srcArray, 0, handle, debug);
    return handle;
};
