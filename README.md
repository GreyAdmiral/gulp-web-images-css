# gulp-web-images-css

> This is a modified version of the plugin [gulp-avif-css](https://www.npmjs.com/package/gulp-avif-css). Generates additional expressions with `.webp` & `.avif` classes and appropriate extension.

## Install

Install `gulp-web-images-css` as a development dependency:

```shell
npm i -D gulp-web-images-css
```

## Options

Type: `object`

### mode

Type: `string`<br>
Default: `all`<br>
Possible values:
   -  «avif» — Add only support «AVIF»
   -  «webp» — Add only support «Webp»
   -  «all» — Add support «AVIF» and «Webp»

### localMode
Type: `boolean`<br>
Default: `true`

Make only local paths.

### unregister

Type: `boolean`<br>
Default: `true`

Do not distinguish between lowercase and uppercase letters in extensions

### avifClass

Type: `string`<br>
Default: `avif`

Sets a class for AVIF-picture

### webpClass

Type: `string`<br>
Default: `webp`

Sets a class for Webp-picture

### extensions

Type: `array`<br>
Default: `['png', 'jpg', 'jpeg']`

Expansion subject to processing.

## Usage

Add it to your `gulpfile.js`

```javascript
const gulp = require("gulp");
const webImagesCSS = require("gulp-web-images-css");

gulp.src("./src/css/*.css").pipe(webImagesCSS()).pipe(gulp.dest("./dist"));
```

or

```javascript
const gulp = require("gulp");
const webImagesCSS = require("gulp-web-images-css");

gulp
   .src("./src/css/*.css")
   .pipe(webImagesCSS({mode: "all"}))
   .pipe(gulp.dest("./dist"));
```

Include special plugin adds `.avif` and `.webp` classes to body (if it supports) into your JavaScript file (add it into head tag)

```javascript
import "gulp-web-images-css/plugin";
```

## Examples

#### Input:

```css
.box {
   background-image: url("image.png");
}
```

#### Output:

```css
.box {
   background-image: url("image.png");
}

.webp .box {
   background-image: url("image.webp");
}

.avif .box {
   background-image: url("image.avif");
}
```
