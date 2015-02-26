# angular-template-stitch

> Allow loading of merge templates into a single HTML file.

```shell
bower install angular-template-stitch --save
```

Once the plugin has been installed, it may be enabled inside your application by adding the correpsonding module:

```js
angular.module('myApp', ['angularTemplateStitch']);
```

Then, configure the file that contains all of your merged templates.

```js
angular.module('myApp').config(function (angularTemplateStitchProvider) {
	angularTemplateStitchProvider.setTemplate('templates/views.html');
});
```
 
## Overview

angularTemplateStitch parses the generated template files by comments. This is beneficial over:

1) Registering the templates as strings with `ngtemplates`
2) Registering the templates as `<script type="text/ng-template"` with `angularCombine`

Because proxy services such as `Smartling` ignore html in `script` tags, and do not understand string templates registered in javascript, unless the javascript is decorated with tags (which even still does not work most of the time)

```html

<!-- angularTemplateStitch -->
<!-- angularTemplateStitch.template="first" -->
<div>This is first template</div>
<!-- angularTemplateStitch -->
<!-- angularTemplateStitch.template="second" -->
<div>This is second template</div>
```

It allows us to use first.html or first.html as partials without having an extra HTTP call.

*You will need to process your templates using `grunt-angular-template-stitch` first, before this module will work*

See: [grunt-angular-template-stitch](https://github.com/taylorcode/grunt-angular-template-stitch)

- 0.1.0 : initial version

