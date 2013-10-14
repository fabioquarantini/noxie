# Hangar #

## A web development starter kit  ##

**Hangar** is a web development starter kit, provides project architecture, it's goal is to ease the web developers job.
**Hangar** also provides useful [Grunt]("http://gruntjs.com/") tasks specifically made for performance optimization.


## Who needs this ##

You may need this project if you need a simple and powerful starting kit for your web projects.


## What is hangar made of ##

**Hangar** in it's core uses:

- [Grunt](http://gruntjs.com/)
- [Html5Boilerplate](http://html5boilerplate.com/)
- [Sass](http://sass-lang.com/)
- [Weinre](http://people.apache.org/~pmuellr/weinre/docs/latest/)


## Structure

The basic structure of the project is given in the following way:

```
├── dev
│   ├─── css/
│   │	└── main.css
│   ├── js/
│   │ 	├── plugins
│   │   │ 		├── console.js
│   │   │ 	 	├── livereload.js
│   │   │		└── weinre.js
│   │	├──vendor
│   │   │	├── jquery-1.10.2.min.js
│   │   │	└── modernizr-2.6.2.min.js
│   │ 	├──main.js
│   │ 	└──plugins.js
│   │
│	├── scss/
│   │	├─ partials/
│   │   │	├── _base.scss
│   │   │	├── _grids.scss
│   │   │	├── _helpers.scss
│   │   │	├── _normalize.scss
│   │   │	├── _forms.scss
│   │   │	└── _typography.scss
│   │	├── vendor/
│   │	├── main.scss
│   │	└── print.scss
│	├── robots.txt
│	├── .htaccess
│	├── favicon.ico
│	├── humans.txt
│	└── index.html
├── .editorconfig
├── .gitignore
├── .jshintrc
├── Gruntfile.js
├── hangar.bat
├── LICENSE.md
├── package.json
└── README.md
```

## Credits

[Fabio](http://www.fabioquarantini.com), [danielhq](https://twitter.com/ildaniel8)


## License

[MIT License](http://opensource.org/licenses/MIT)
