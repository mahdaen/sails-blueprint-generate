## **%%REALNAME%% - SailsJS Blueprint with Swig Template Engine**

This is **sails** app blueprint to work with **swig** template and **Foundation**.
Read more informations about [Sails Js](http://sailsjs.org), [Swig](http://paularmstrong.github.io/swig/), and [Foundation](http://foundation.zurb.com)

***
## **Usage**

CD to the project folder and start the server.

```
$ cd %%NAME%%
$ sails lift
```

If you want to restart the app on file changes, you can use **`forever -w`** to start the app.
We've added **`.tmp`** and **`www`** folder to forever ignore list.

```
$ forever -w start app.js
```

***
## **Configurations**

**Non-Sails Dependencies**

* **Swig**
* **Grunt**
* **Grunt Contrib Watch**
* **Grunt Contrib Clean**
* **Grunt SASS**
* **Grunt Sync**
* **Grunt Export**
* **Node Import**

**Bower Packages**

* **jQuery**
* **jQuery Cookie**
* **jQuery Placeholder**
* **JQPatch**
* **Modernizr**
* **Fastclick**
* **Foundation**
* **Short SASS**


### **Configuring Swig**

Swig configuration is located at **`config/swig.js`**. You can change the swig configs there, adding scripts and styles
to automatically injected to the layout.

### **Configuring Grunt**

You can add/change/remove tasks configs by editing files inside **`grunt/configs/`**.
You can add/change/remove tasks by editing **`/grunt/init.js`**
 
### **Adding bower components**

Installed **`bower`** libs located at **`library`** folder.
You can add the installed libraries to the **`public/scripts/com.libs.js`** to makes the libraries compiled in one file, and
automatically switched to **`minified`** version on **`production`** environtment. Example:

**Installing Libraries**

```
bower install --save jquery short-sass
```

**Importing Libraries**

**`public/scripts/com.libs.js`**

```js
(function(global) {
	'@import $root/library/jquery/dist/jquery.js';
	
	$(document).ready(function() {
		console.log('Document is ready');
	});
})(window);
```

**`public/styles/main.scss`**

```scss
@import '../../library/short-sass/dist/short-sass';

@include normalize;
@include reset;
```
