const through = require('through2');
const css = require('css');

class WebImagesCSS {
	constructor() {
		this.mode = "all";
		this.localMode = true;
		this.unregister = true;
		this.extensions = ['png', 'jpg', 'jpeg'];
		this.webpClass = "webp";
		this.avifClass = "avif";
	}

	init = (options = {}) => {
		Object.assign(this, options);
		if (this.unregister) {
			this.avaibleExtensions = [...new Set(this.extensions.concat(this.extensions.map((it) => it.toUpperCase())))];
		} else {
			this.avaibleExtensions = this.extensions;
		}
		if (this.mode == "avif") {
			this.webExt = [this.avifClass];
		} else if (this.mode == "webp") {
			this.webExt = [this.webpClass];
		} else {
			this.webExt = [this.avifClass, this.webpClass];
		}
		return through.obj((buffer, _, callback) => {
			if (buffer.isNull()) {
			return callback(null, buffer);
			} else if (buffer.isStream()) {
			return callback(null, buffer);
			}

			this.buffer = buffer;
			this.fileData = buffer.contents.toString();
			this.transform();

			callback(null, this.buffer);
		})
	}

	transform(rules = this.parseCSS()) {
		rules.forEach((expression) => {
			if (expression.type === 'media') {
			return this.transform(expression.rules);
			} else if (expression.type === 'rule') {
			expression.declarations
			.forEach((rule) => {
				if (!this.isBackground(rule)) return;

				const imageExtension = this.getExtension(rule);

				if (!imageExtension) return;

				this.createExpressions({
					rule,
					selectors: expression.selectors,
					position: expression.type === 'media'
					? rule.position
					: expression.position,
					imageExtension
				})
			})
			}
		})

		this.buffer.contents = new Buffer.from(this.fileData);
	}

	parseCSS() {
		return css.parse(this.fileData).stylesheet.rules;
	}

	isBackground({property, value}) {
		if (
			property === 'background' ||
			property === 'background-image' &&
			value.indexOf("." + this.webpClass) < 0 &&
			value.indexOf("." + this.avifClass) < 0
		) {
			return true;
		}
	}

	getExtension({value}) {
		return this.avaibleExtensions.find((extension) => {
			if (value.indexOf(extension) > 0) {
				if (this.localMode) {
					if (!~value.search(/^url\((["'])?http(s)?\:\/\//i)) {
						return extension;
					}
				} else {
					return extension;
				}
			}
		})
	}

	createExpressions({ rule, selectors, position, imageExtension }) {
		const splitedData = this.fileData.split(/\n/);

		const rowIndex = position.end.line - 1;
		const columnIndex = position.end.column - 1;

		;this.webExt.forEach((modernExtension) => {
			splitedData.splice(rowIndex, 1, this.changeString(
			splitedData[rowIndex],
			columnIndex,
			`
				.${modernExtension} ${selectors.join('')} {
					${rule.property}: ${rule.value.replace(imageExtension, modernExtension)}
				}
			`.replaceAll('\n', '')
			)
			)
		})

		this.fileData = splitedData.join('\n');
	}

	changeString(string, changeIndex, changeText) {
		return string.substring(0, changeIndex) + changeText + string.substring(changeIndex);
	}
}

const webImagesCSS = new WebImagesCSS();

module.exports = webImagesCSS.init;
