## **%%REALNAME%% - SailsJS Blueprint with Swig Template Engine**

This is **sails** app blueprint to work with **Swig** template and **Bootstrap** instead of **ejs**.
Read more informations about [Sails Js](http://sailsjs.org) and [Swig](http://paularmstrong.github.io/swig/)

***
## **Installation**

Ensure you have **`Sails`** installed globally.


```
$ npm install -g sails
```
**or**

```
$ sudo npm install -g sails
```

Clone this repo.

```
$ git clone https://github.com/mahdaen/sails-views-swig.git sails-swig
```

CD to the cloned repo and start the server.

```
$ cd sails-swig
$ sails lift
```

If you want to restart the app on file changes, you can use **`forever`** to start the app.
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

* **Bootstrap 3**


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

## **History**

2015/05/24          v1.1.5          "Adding www to gitignore, change grunt-watch config, and adding local data."
2015/05/24          v1.1.4          "Adding pattern to .foreverignore"
2015/05/24          v1.1.3          "Adding .foreverignore and updating readme"