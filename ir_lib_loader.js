
IRLibLoader = typeof IRLibLoader === "undefined" && {};
IRLibLoader._libs = IRLibLoader._libs || {};

IRLibLoader.load = function(src, options) {

	var self, handle;

	self = this;

	if (!this._libs[src]) {

		this._libs[src] = {
			src: src,
			ready: false,
			readyDeps: new Deps.Dependency,
			options: options
		};

		$.ajax({
			url: src,
			dataType: 'script',
			cache: true
		}).done(function() {
			var lib = self._libs[src];
			lib.ready = true;
			lib.readyDeps.changed();
			options && options.success && options.success();
		}).fail(function() {
			options && options.error && options.error(arguments);
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