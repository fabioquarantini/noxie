# Noxie #

## A web development starter kit  ##

**Noxie** is a web development starter kit, provides project architecture, it's goal is to ease the web developers job.



## Who needs this ##

You may need this project if you need a simple and powerful starting kit for your web projects.


## What is noxie made of ##

**Noxie** in it's core uses:

- [Grunt](http://gruntjs.com)
- [Html5Boilerplate](http://html5boilerplate.com)
- [Sass](http://sass-lang.com)
- [Bower](http://bower.io)
- [Weinre](http://people.apache.org/~pmuellr/weinre/docs/latest)

## Installation ##

Download [zip file](https://github.com/noxie/noxie/archive/master.zip)

or 

```
git clone https://github.com/noxie/noxie.git
```

## Requirements 

- [Nodejs](http://nodejs.org/)
- [Gruntjs](http://gruntjs.com/)

Make sure you have the latest versions of these software. 

## Usage 


#### Manual install
With your terminal of choice go to your directory where you have downloaded Noxie and:
```
npm install
```

#### Automatic install
If you're on Windows run:
```
noxie.bat
```

If you're on OSX then run:
```
noxie.command
```

## Structure

The basic structure of the project is given in the following way:

```
├── app
│   ├── css/
│   │	└── main.css
│   ├── fonts/
│   ├── img/
│   ├── js/
│   │ 	├── plugins
│   │   │ 		└── console.js
│   │	├──vendor
│   │   │	├── jquery-1.10.2.min.js
│   │   │	└── modernizr-2.6.2.min.js
│   │ 	├──main.js
│   │ 	└──plugins.js
│   │
│	├── scss/
│   │	├─ partials/
│   │   │	├── _base.scss
│   │   │	├── _forms.scss
│   │   │	├── _grids.scss
│   │   │	├── _helpers.scss
│   │   │	├── _normalize.scss
│   │   │	└── _typography.scss
│   │	├── vendor/
│   │	├── main.scss
│   │	└── print.scss
│	├── .htaccess
│	├── apple-touch-icon-precomposed.png
│	├── favicon.ico
│	└── index.html
│	└── robots.txt
├── .bowerrc
├── .editorconfig
├── .gitignore
├── .jshintrc
├── bower.json
├── Gruntfile.js
├── noxie.bat
├── noxie.command
├── LICENSE.md
├── package.json
└── README.md
```

## Credits

[Fabio Quarantini](http://www.fabioquarantini.com), [Daniel Duches](https://twitter.com/ildaniel8)


## License

[MIT License](http://opensource.org/licenses/MIT)
