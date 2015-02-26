angular.module('angularTemplateStitch', [])

.provider('angularTemplateStitch', function ($provide) {

	this.setTemplate = function (templatePath) {

		var providerContext = this;

		this.commentValues = {
			startComment: '<!-- angularTemplateStitch -->'
		};

		$provide.decorator('$http', function ($delegate, $templateCache, $injector) {

			var $q = $injector.get('$q'),
				getProxy = $delegate.get,
				combinedTemplateDeferrend,
				commentHostName = providerContext.commentValues.host + '.' + providerContext.commentValues.value;

			$delegate.get = function (url, requestConfig) {

				var delegateContext = this,
					requestedTemplate,
					delegateArgs = Array.prototype.slice.call(arguments);

				function callOriginalGet () {
					return getProxy.apply(delegateContext, delegateArgs);
				}

				if (requestConfig && requestConfig.cache === $templateCache) {

					if(combinedTemplateDeferrend) {
						// already fetching the grouped template
						return combinedTemplateDeferrend.promise.then(function () {
							// base template loaded, execute http call normally
							return callOriginalGet();
						});

					} else {
						combinedTemplateDeferrend = $q.defer();
					}
					// save the requested template so we can return it after this call
					requestedTemplate = arguments[0];

					arguments[0] = templatePath;

					return getProxy.apply(this, arguments).then(function (response) {

						var htmlString = response.data,
							htmlStringTemplates = htmlString.split(providerContext.commentValues.startComment);

							htmlStringTemplates.shift() // remove the first item

						angular.forEach(htmlStringTemplates, function (templateDefinitionHtml) {

							var untilTemplateName = templateDefinitionHtml.match(/<!--[\s-]*angularTemplateStitch.template[\s-]*=[\s-]*"((.|\n|\r|\t)*)/)[1],
							    templateName = untilTemplateName.match(/[^"]*/)[0],
							    templateContent = untilTemplateName.match(/"[\s-]*-->((.|\n|\r|\t)*)/)[1];

							$templateCache.put(templateName, templateContent);

						});

						combinedTemplateDeferrend.resolve();

						return callOriginalGet();

					});

				} else {
					return callOriginalGet();
				}
			}

			return $delegate;

		});

	}

	this.$get = function () {
		return {};
	}

});
