#templateManager

JS template manager based on jQuery. Get your templates from inline scripts or through ajax calls and manage them in one place.

##Usage
```javascript

app.getTemplate('templates/homepage', function(template){
	$body.html(template(data));
});

```
##API
```javascript
// Set base path for templates that you get via ajax calls
app.getTemplate.setBasePath('static/templates/')

// Will loop through inline scripts with class "jsTemplate"
// and save compiled templates under key provided by "data-template-key" attribute on script tag
app.getTemplate.cacheScriptTemplates('.jsTemplate', 'template-key');

// Set template engine (looks for underscore by default)
app.getTemplate.setTemplateEngine(window._.template);

// Register your compiled templates
app.getTemplate.register('myTemplate', _.template('<div>Test</div>'));

// Set expected template extension for templates compiled on ajax calls, defaults to ".jst"
app.getTemplate.setTemplateExtension('.jst');

// Set cache attribute for ajax calls, defaults to false
app.getTemplate.setAjaxCache(true);

```


##Installation

After including library file it is recommend to alias and bring library (that is initialy in $.wk.getTemplate namespace) to your desired namespace.
 ```javascript
 app.getTemplate = $.wk.getTemplate;
```


