Package.describe({
	name: 'nirleka:wait-on-lib-js',
	summary: "Use Meteor Iron-Routers waitOn to load external javascript",
	"version": "0.1.2",
	git: 'https://github.com/nirleka/wait-on-lib-js'
});

Package.on_use(function (api) {
  api.use(['jquery'], 'client');

  api.export && api.export('IRLibLoader');

  api.add_files('ir_lib_loader.js', 'client');
});

Package.on_test(function (api) {
  //no tests yet
});
