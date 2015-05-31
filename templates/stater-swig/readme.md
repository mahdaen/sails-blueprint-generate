# **__REALNAME__ - HTML Template with NodeJS Server**

Stater is a HTML Template Blueprint including static web server based on node js. Stater help front-end developer to develop their template without headache.

**Why we (Front-End Developer) need it?**

Let's say *I have tired with changing all HTML files when changing small things on header or other shared blocks.* **or** *I have tired to pres CMD+R everytimes I change css or another files* **or** *I hate to wait grunt or gulp finished running the tasks for small things I made* **or** any headache that comes because our job is working with static web template.

Yes, I made Stater template to support my job, and then I share it to help another **me** who tired with static things.

**Example**

**`views/parts/main.html`**

Main html is the main layout, holding **`head`** and **`body`** tag.

```html
<html>
	<head>
    	<title>{{ meta.title }}</title>
        <meta name="description" content="{{ meta.description }}">
    </head>
    <body>
    	{% block content %}
        {% endblock %}
    </body>
</html>
```

**`views/home.html`**

home.html is homepage. Have custom title and content, extend the **`main.html`** for layout.

```html
<!-- extend layout -->
{% extends 'parts/main.html' %}

<!-- fill content -->
{% block content %}
	<p>{{ home.message }}</p>
{% endblock %}

```

**`model/home.js`**

home.js is data collections for home page.

```js
module.exports = {
	title: 'Home Page Sample',
    message: 'We\'re on Home Page'
}
```

**`views/about.html`**

about.html is About Page.

```html
<!-- extend layout -->
{% extends 'parts/main.html' %}

<!-- fill content -->
{% block content %}
	<p>{{ home.message }}</p>
{% endblock %}

```

**`model/about.js`**

home.js is data collections for home page.

```js
module.exports = {
	title: 'About Page Sample',
    description: 'Desc ipsum is lorem dolor sit amet'
    message: 'We\'re on Home Page'
}
```

When we visiting **`http://localhost/home`**, Stater serve homepage and the browser title will be **`Home Page Sampe`**, taken from **`model/home.js`**.

When we visiting **`http://localhost/about`**, Stater serve about and the browser title will be **`About Page Sampe`**, taken from **`model/about.js`**. And the meta description also changed (only for about page) since on **`about.js`** have title and description.


## **Features**

### **NodeJS Server**

Stater is nodejs based app. So we don't need to run our template on Apache, Nginx etc with setting up host before we use it. We can do many things with our template since the template is the server itself. We can start or stop it at anytime we need. Stater also comes with CLI support. So to start the server we can just run **`./stater.js start`**.

### **Automatic Routing**

I have set it up to automatically detecting routes. So we don't need to manually setting the router. Just add **`html`** files to **`views`** folder and its will become a router path. Example, we add **`home.html`** to views folder then we can visit it with **`http://localhost/home`**. Yes, we don't need the **`.html`** extension to visit the page. By default **`http://localhost/`** path is rendering **`home.html`**. So don't remove it.

### **Express and Swig**

Stater using **Express** as middleware and **Swig** as view engine, since Express is easy to use and **Swig** really makes our work done without any headache. I love the Swig layouting and feature. Thats why we don't need to compile the htmls (Usually using **`grunt-swig-templates`**) before we can access it or see the changes. Pages is served and rendered directly without need to render other pages (htmls) that we don't need to access it.

### **Model**

Stater is supporting data model, and I already set it up to automatically controll the model and views. Say it MVaC (Model View autoControll) :D just kidding. Since I've setting it, we don't need to manually setup the model, view and controller (except our template needs huge things). Everytimes we requesting page from browser, Stater will lookup to model collections. If model matched with requested page found, then Stater will use it to change global data (e.g meta-title and meta-description). Example, for **`home.html`** page, we add **`home.js`** model, **`about/company.html`** we add **`about.company.js`** model. Then we can use all data in 

### **Live Reload**

Templating without live reload is really painfully. But don't worry, Stater have done our job to setup livereload feature. Carefully configured, so we can forget about time to wait **grunt** or **gulp** finished the tasks. Usually (me) we watch for file changes and then run grunt/gulp tasks and finally trigger livereload. Thoose tasks will fast if don't have big data. But if we serve little big data, the tasks process will take time. Example, we change our javascript file but we set it up to concat and minify the jses (including libraries) to reduce http the request and quality code. Imagine if we concat Angular, jQuery, Modernizr, Gsap, D3JS, and our custom scripts. The concat and minify time is not make sense with our changes (e.g change **`data`** to **`info`** in our scripts). And actually, we really don't need it on development. We don't need to concat/minify javascripts on development to safe our time. And for that, Stater help us to ensure we don't lost our time on development and deliver high quality code on production.

### **Publish**

Yes, our job is delivering static HTML template. So don't worry about the server since we only use the server (or really needs the server) for development purpose (to get speed while working). Anytime we need to publish our work (whether finished or not), simply run **`./stater.js build`** and YIHHAA!! Our template compiled to **`build`** folder. All pages and assets will be there, and all pages will exact same with what we get on browser (direct render), since model and views automatically controlled.

## Installation

Before installing Stater, we need to ensure our machine already have NodeJS, Bower, Forever and Sails Blueprint Generator.

**Install Bower**

```bash
$ npm install -g bower
```

**Install Forever**

```bash
$ npm install -g forever
```

**Install Sails Blueprint Generator**

```bash
$ npm install -g sails-blueprint-generate
```

**Installing Stater**

```bash
$ sailsgen project-name
```

and fill then informations asked by **`sailsgen`**.

After installing Stater, you can start the server by:

```bash
$ cd project-name
$ ./stater.js start --verbose
```

After server started, you can try to visit your server by opening browser from terminal or directly from browser. Example:

```bash
$ open http://localhost:8042
```



***
**Documentation is not yet finished**





