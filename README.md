wait-on-lib-js-css
==================
Fork from [MaximDubrovin](https://github.com/MaximDubrovin/wait-on-lib-js)

Use Iron-Router waitOn or onBeforeAction hooks to load external javascript libraries / css file.
The css will be added in head in link tag with `data-preloadcss="1"` so that it can be remove later (see example below).

Scripts will be cached for browser reuse.
If scripts change, reload browser by:
```
Windows: ctrl + F5
Mac/Apple: Apple + R or command + R
Linux: F5
```

###How to use
1. Clone this packages in packages folder
2. Remove wait-on-lib-js if installed before
3. Install this package by: `meteor add nirleka:wait-on-lib-js`
4. See example below

###Load one or more independend libraries
Use Iron-Router waitOn to load external javascript libraries

IRLibLoader returns a handle similar to a subscriptions handle. It is ready as soon as the external script is loaded.
```javascript
    Router.map( function () {
      this.route('codeEditor',{
        waitOn: function(){
            return [IRLibLoader.load('https://some-external.com/javascript.js'), IRLibLoader.load("smthels.js")]
        }
      });
    });
```

###Load dependend libraries
Here we have one.js and two.js. two.js has to be loaded secondly because it depends on one.js. This is how you can do this:
```javascript
    Router.map(function(){
      this.route('home', {
        path: '/',
        onBeforeAction: function(){
          var one = IRLibLoader.load('/one.js', {
            success: function(){ console.log('SUCCESS CALLBACK'); },
            error: function(){ console.log('ERROR CALLBACK'); }
          });
          if(one.ready()){

            var two = IRLibLoader.load('/two.js');
            if(two.ready()){
              this.next();
            }
          }
        }
      });
    });
```

###Adding preload css and set it to head
Don't forget to remove the preload css when load route by adding action below in default controller.
```javascript
var DashboardController = RouteController.extend({
    action: function() {
		//remove all preload css if exist
		$('*[data-preloadcss="1"]').remove();
    }
});
```

Also notice that you can use an error and success callback in the IRLibLoader options.

###Order preserving load with waitOn
The method `IRLibLoader.loadInOrder` accepts an array of urls and loads them in that order one by one. This is light-weight and easy to use mechanism that works with any number of urls (since you do not need to explicitly dove-tail the callbacks).
```javascript
Router.map( function () {
  this.route('codeEditor',{
    waitOn: function(){
        return 	IRLibLoader.loadInOrder([
							"//www.google.com/jsapi",
							"//d26b395fwzu5fz.cloudfront.net/3.2.0/keen.js",
							"//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js",
							"//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js",
							"//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min.js",
							"//okfnlabs.org/elasticsearch.js/elasticsearch.js",
							"//okfnlabs.org/recline.backend.gdocs/backend.gdocs.js",
							"//okfnlabs.org/recline/dist/recline.js",
							"//cdnjs.cloudflare.com/ajax/libs/codemirror/4.10.0/codemirror.min.css",
							"//cdnjs.cloudflare.com/ajax/libs/codemirror/4.10.0/codemirror.min.js",
							"//cdnjs.cloudflare.com/ajax/libs/codemirror/4.10.0/addon/display/fullscreen.min.css",
							"//cdnjs.cloudflare.com/ajax/libs/codemirror/4.10.0/addon/display/fullscreen.min.js",
							"//cdnjs.cloudflare.com/ajax/libs/codemirror/4.10.0/addon/display/placeholder.min.js",
							"//handsontable.com/dist/handsontable.full.css",
							"//handsontable.com/dist/handsontable.full.js"
							]);
       	}
  });
});
```

###Load script / css in template
```handlebars
<!-- template.html -->
{{unless libsLoaded}}
    loading...
{{else}}
    {{>theTemplate}}
{{/if}}
```

```javascript
//template.js

var libLoadedHandle = null;
Template.myTemplate.onCreated(function(){
    libLoadedHandle = IRLibLoader.load('/my/library.js');
});

Template.myTemplate.helpers({
    libLoaded: function(){
        return libLoadedHandle.ready();
    }
});
```
