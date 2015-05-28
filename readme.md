## **Interactive Wizard to generate Sails Blueprint**

This generator was made to help users to setup **Sails** project with interactive wizard and ready to use templates.
So users doesn't need to manually setup the template to get working (E.g: **Swig + Bootstrap**), configuring **`packages.json`**, **`bower.json`** and etc.

Generator will automatically install the **NPM Packages** and **Bower Packages** at the final step.
So users doesn't need to manually run **`npm install`** and **`bower install`**, and the generator also giving 
prompt to install additional bower and npm packages.

Each template is ready to use. So users doesn't need to manually add **`grunt-task`** to compile and sync the assets,
adding scripts and styles to HTML Layout, and so on.

Each template also ready for environment use.
For example, in **Development** environment, template will using non minified javascript and css,
but will use minfied version on **Production** environment.
 
Generator also will promt users to choose which port to be used in **Development** and **Production** environment, including which
databse driver that will be used.

***
## **Installation**

Sails Blueprint Generator requires NodeJS, NPM, and Bower installed on your machine.
To install Sails Blueprint Generator, run:

```bash
$ npm install -g sails-blueprint-generate
```

***
## **Install External Templates**

To install external templates, templates must be registered on bower registry.
After installing, external templates will vailable on **Select Template** list

```bash
$ sailsgen install template-name
```

**Example**

```bash
$ sailsgen install sails-swig-angular sails-jade-bootstrap
```

***
## **Usage**

To generate new blueprint, run:

```bash
$ sailsgen project-name
```

and follow the instructions.

***
## **Default Prompts**

When running the **`sails-blueprint-generate project-name`**, users will be asked for few questions to setup the project.
The prompts will be used by templates to setup the template requirements, e.g **Project Name** will be used in **`package.json`** and **`bower.json`** for field **`name`**.
Where will be the informations used is depend on the templates requirements.

* **Project Name** - **`required`**
* **Full Name** - **`optional`**
* **Description** - **`optional`**
* **Version** - **`optional`**
* **Repository** - **`optional`**
* **Select Template** - **`required`**
* **Author** - **`optional`**
* **License** - **`optional`**
* **Additional NPM Packages** - **`optional`**
* **Additional Bower Packages** - **`optional`**

Each template will also have their own prompts to fits with the template requirements.

***
## **Example**

**Setup**

```bash
macbook:projects euser$ sails-blueprint-generate sails-app
Welcome to interactive Sails Blueprint generator

? Project Name: sails-app
? Full Name: Sails Application
? Description: The web framework of your dreams.
? Version: 1.0.0
? Repository: https://github.com/user/reponame
? Select Template: sails-swig-foundation
? Author: Your Name <name@mail.com>
? License: MIT
? Install Additional NPM Packages? Separated by space: 
? Install Additional Bower Packages? separated by space: gsap angular
? Development Port: 1337
? Production Port: 80
? Development Database Driver: sails-disk
? Production Database Driver: sails-disk
{ name: 'sails-app',
  realname: 'Sails Application',
  description: 'The web framework of your dreams.',
  version: '1.0.0',
  repository: 'https://github.com/user/reponame',
  template: 'sails-swig-foundation',
  author: 'Your Name <name@mail.com>',
  license: 'MIT',
  npmdep: '',
  bowdep: 'gsap angular',
  devport: '1337',
  prodport: '80',
  devdriver: 'sails-disk',
  proddriver: 'sails-disk' }
? Check the settings. Continue? yes/no: yes
Generating Sails Blueprint for sails-app with template sails-swig-foundation ...

Sails Blueprint successfully generated.
Project path: /Users/euser/projects/sails-app
Run the application by executing sails lift or forever -w app.js

Installing NPM Packages...
Installing Bower Packages...
Bower Packages installed.
NPM Packages installed.
macbook:projects euser$ 
```

**bower.json** result:
```json
{
  "name": "sails-app",
  "version": "1.0.0",
  "description": "The web framework of your dreams.",
  "ignore": [
    "**/.*",
    "node_modules",
    "bower_components",
    "library",
    "test",
    "tests"
  ],
  "keywords": [
    "sails",
    "swig",
    "foundation",
    "template"
  ],
  "author": "Your Name <name@mail.com>",
  "license": "MIT",
  "homepage": "https://github.com/user/reponame",
  "main": "app.js",
  "dependencies": {
    "foundation": "~5.5.2",
    "short-sass": "~2.1.1",
    "jquery": "~2.1.4",
    "jqpatch": "~1.1.1",
    "gsap": "~1.16.1",
    "angular": "~1.4.0"
  }
}
```

***
## **Available Templates**

* **`sails-swig`** - Sails Blueprint with Swig Template Engine
* **`sails-swig-bootstrap`** - Sails Blueprint with Swig Template Engine and Bootstrap
* **`sails-swig-foundation`** - Sails Blueprint with Swig Template Engine and Foundation

***
## **Creating Template**

You can create new template and publish it to bower, since this generator only can install template from bower.
To add custom prompts to your template, add file **`prompts.js`** to your template directory. Then you can add
your custom prompts pattern to your files, wherever you need it. Pattern format is **`%%NAME%%`**.

**Example**

**`prompts.json`**

```json
[
    {
        "name"    : "pets",
        "type"    : "input",
        "message" : "Favourite Pet",
        "default" : "Cat"
    }
]
```

**`readme.md`**

```
Project owner love %%PETS%%
```

Generator will iterate all prompts and apply to all files inside template folder.

***
## **Notes**

Generator will embedding [NativeJS](https://github.com/mahdaen/native-js) to the generated template. You can remove it 
in the template main file (e.g **`app.js`**) at the first line if you don't want it.

Please open new issue for suggestions, template request or input prompts request.