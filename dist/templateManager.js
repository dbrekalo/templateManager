;(function($, window){

	"use strict";

	var templateCache = {},
		templateBasePath = '/',
		templateExtension = '.jst',
		templateEngine = window._ && window._.template,
		ajaxCache = false;

	function getTemplate(key, callBack, sync){

		var templatePath = templateBasePath + key + templateExtension,
			executeCallBack = function(){
				callBack && callBack(templateCache[key].template);
			};

		if (templateCache[key]) { // if cached or loading

			if ( templateCache[key].deffered.state() === 'resolved' ){
				executeCallBack();
			} else {
				$.when(templateCache[key].deffered).done(function(){ executeCallBack(); });
			}

			return templateCache[key].deffered;

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

				var $this = $(this);
				templateCache[$this.data(key)] = {
					template: templateEngine( $this.html() ),
					deffered: $.Deferred().resolve()
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