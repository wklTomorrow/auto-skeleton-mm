const fs = require('fs')
const minify = require('html-minifier').minify;
const pp = require('./src/pp');
const EvalDom = require('./src/evalDom')
const base64Img = require('base64-img');
const defaultEval = require('./src/default.html')
const {Spinner} = require('./src/utils')

class AutoSkeleton {
    /**
     * url
     * backgroundColor
     * headless
     * @param {*} options 
     */
    constructor(options = {}) {
        this.options = options || {}
        this.headTags = options.headTags || []
        this.bodyTags = options.bodyTags || []
    }

    apply(compiler) {
        const self = this
        if (compiler.hooks) {
            // webpack 4 support
            compiler.hooks.compilation.tap('HtmlWebpackInlineCodePlugin', function (compilation) {
                if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
                    compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync('HtmlWebpackInlineCodePlugin', function (htmlPluginData, callback) {
                        self.processTags(htmlPluginData);
                        callback(null);
                    });
                } else {
                    // HtmlWebPackPlugin 4.x
                    var HtmlWebpackPlugin = require('html-webpack-plugin');
                    var hooks = HtmlWebpackPlugin.getHooks(compilation);
            
                    hooks.alterAssetTagGroups.tapAsync('HtmlWebpackInlineCodePlugin', function (htmlPluginData, callback) {
                        self.processTags(htmlPluginData);
                        callback(null);
                    });
                }
            });
        } else {
            // webpack 3 support
            compiler.plugin('compilation', function (compilation) {
                compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
                    self.processTags(htmlPluginData);
                    callback(null, htmlPluginData);
                });
            });
        }
    }

    processTags(htmlPluginData) {
        if (this.headTags.length) {
            this.onDealTag({
                position: 'head',
                tags: this.headTags,
                htmlPluginData
            })
        }
        if (this.bodyTags.length) {
            this.onDealTag({
                position: 'body',
                tags: this.bodyTags,
                htmlPluginData
            })
        }
    }
    /**
     * 
     * @param {position} head || body 
     */
    onDealTag({position, tags, htmlPluginData}) {
        if (tags.length) {
            tags.forEach(node => {
                htmlPluginData[position].push({
                    ...node,
                    innerHTML: node.tagCode
                })
            })
        }
    }

    async init(options = {}) {
        const {headless = true, url, pageName = '', output = {}} = options
        const spinner = Spinner('magentaBright');
        spinner.text = '启动浏览器...';
        const browser = await pp({headless})
        spinner.text = `正在打开页面：${url}...`;
        const page = await browser.openPage(url)
        await this.dealPage({page, options, spinner});
        await browser.browser.close();
        process.exit(0);
    }

    async dealPage({page, options, spinner}) {
        const {pageName = '', output = {}, loadDestory} = options
        const {filepath, fileDir, injectSelector} = output
        const defaultName = 'skeleton'
        spinner.text = '正在生成骨架屏...';
        await page.evaluate(EvalDom)
        if (!fileDir) {
            fs.mkdirSync(defaultName, function(e) {
                console.log(e)
            })
        } else if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, function(e) {
                console.log(e)
            })
        }
        const defaultPage = `${fileDir}/${pageName || defaultName}-skeleton.png`
        const defaultFile = `${fileDir}/${pageName || defaultName}-${filepath}`
        await page.screenshot({ path: defaultPage });
        const images = base64Img.base64Sync(defaultPage)
        const defaultHtml = defaultEval({images, injectSelector, loadDestory})
        this.writeFile(defaultFile, defaultHtml)
        spinner.clear().succeed(`skeleton screen has created and output to ${fileDir}}`);
    }

    writeFile(filepath, html) {
        try {
            fs.writeFileSync(filepath, minify(`module.exports = \`${html}\``, {
                minifyCSS: true,
                minifyJS: true,
                removeComments: true,
              }))
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = AutoSkeleton
