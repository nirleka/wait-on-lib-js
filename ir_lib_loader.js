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
            readyDeps: new Deps.Dependency,
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
					if (isCSS) {
						$( 'head' ).append( '<link rel="preload stylesheet" type="text/css" href="' + src + '"/>' );
					} else if (options && options.success) {
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
    handle = {
        ready: function() {
            var lib;
            lib = self._libs[src];
            lib.readyDeps.depend();
            return lib.ready;
        }
    };
    return handle;
};

IRLibLoader.loadRecurse = function(srcArray, index, handle) {
    if (index < 0 || index >= srcArray.length) {
        handle.setReady();
        return;
    }
    IRLibLoader.load(srcArray[index], {
        success: function() {
            console.log("Loaded: " + srcArray[index]);
            IRLibLoader.loadRecurse(srcArray, index + 1, handle);
        },
        error: function(e) {
            // this one failed - but we continue with the rest
            console.log("Error loading: " + srcArray[index]);
            IRLibLoader.loadRecurse(srcArray, index + 1, handle);
        }
    });
};

IRLibLoader.loadInOrder = function(srcArray) {
    var allReady = false;
    var readyDeps = new Deps.Dependency;
    handle = {
        ready: function() {
            readyDeps.depend();
            return allReady;
        },
        setReady: function() {
            allReady = true;
            readyDeps.changed();
        }
    };
    IRLibLoader.loadRecurse(srcArray, 0, handle);
    return handle;
};