;(function($, window){

	"use strict";

	var templateCache = {},
		templateBasePath = '/',
		templateExtension = '.jst',
		templateEngine = window._ && window._.template,
		ajaxCache = false;

	function getTemplate(key, callBack, sync){

		var templatePath = templateBasePath + key + templateExtension,
			templateObject = templateCache[key],
			executeCallBack = function(){
				callBack && callBack(templateCache[key].template);
			};

		if (templateObject) { // if cached or loading

			if (templateObject.deffered.state() === 'resolved'){ // already compiled

				executeCallBack();

			} else if (templateObject.templateString) { // script template

				if (!templateObject.compiled) {

					templateObject.template = templateEngine(templateObject.templateString);
					templateObject.compiled = true;
					templateObject.deffered.resolve();

				}

				executeCallBack();

			} else {
				$.when(templateObject.deffered).done(function(){ executeCallBack(); });
			}

			return templateObject.deffered;

		} else { // load via url

			var deffered = $.ajax({
				url: templatePath,
				method: 'GET',
				async: !sync,
				cache: ajaxCache,
				success: function(data) {

					templateCache[key].template = templateEngine( data );
					executeCallBack();

				}
			});

			templateCache[key] = {
				'deffered': deffered
			};

			return templateCache[key].deffered;

		}

	}

	var api = {

		setBasePath: function(path){
			templateBasePath = path;
			return api;
		},

		setTemplateEngine: function(engine){
			templateEngine = engine;
			return api;
		},

		setAjaxCache: function(value){
			ajaxCache = value;
			return api;
		},

		setTemplateExtension: function(extension){
			templateExtension = extension;
			return api;
		},

		cacheScriptTemplates: function(selector, key){

			$(selector).each(function(){

				var $template = $(this);
				templateCache[$template.data(key)] = {
					deffered: $.Deferred(),
					templateString: $template.text()
				};

			});

			return api;

		},

		register: function(key, template){

			templateCache[key] = {
				'template': template,
				'deffered': $.Deferred().resolve()
			};
			return api;

		}

	};

	$.extend(getTemplate, api);

	$.wk = $.wk || {};
	$.wk.getTemplate = getTemplate;

})(window.jQuery, window);