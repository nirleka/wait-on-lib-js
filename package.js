Package.describe({
  summary: "Use Meteor Iron-Routers waitOn to load external javascript"
});

Package.on_use(function (api) {
  api.use(['jquery'], 'client');

  api.export && api.export('IRLibLoader');

  api.add_files('ir_lib_loader.js', 'client');
});

Package.on_test(function (api) {
  //no tests yet
});
