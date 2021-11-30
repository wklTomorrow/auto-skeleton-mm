const fs = require('fs')
const path = require('path')
const minify = require('html-minifier').minify;
const pp = require('./src/pp');
const EvalDom = require('./src/evalDom')
const base64Img = require('base64-img');
const defaultEval = require('./src/default.html')
const {Spinner, sleep} = require('./src/utils')
const pluginName = 'AutoSkeletonPlugin'

const cwd = process.cwd()

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
            compiler.hooks.compilation.tap(pluginName, function (compilation) {
                if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
                    compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(pluginName, function (htmlPluginData, callback) {
                        self.processTags(htmlPluginData);
                        callback(null);
                    });
                } else {
                    // HtmlWebPackPlugin 4.x
                    var HtmlWebpackPlugin = require('html-webpack-plugin');
                    var hooks = HtmlWebpackPlugin.getHooks(compilation);
            
                    hooks.alterAssetTagGroups.tapAsync(pluginName, function (htmlPluginData, callback) {
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
                    innerHTML: this.isFunction(node.tagCode) ? node.tagCode() : node.tagCode
                })
            })
        }
    }

    isFunction(fn) {
        return typeof fn === 'function'
    }

    async init(options = {}) {
        const {
            headless = true, url, device, sleepTime = 100, extraHTTPHeaders, multyUrls,
            filename, fileDir, disabledScript = false, injectSelector, loadDestory,
            pageShowContain, savePicture, backgroundColor, ignoreClass, lineHeight, createAll,
        } = options
        const spinner = Spinner('magentaBright');
        spinner.text = '启动浏览器...';
        const browser = await pp({device, headless})
        const targetSkeletonUrl = multyUrls && Array.isArray(multyUrls) ? multyUrls : [{
            url: url,
            filename: filename
        }]
        multyUrls && delete options.multyUrls
        this.createSkeleton({
            targetSkeletonUrl: targetSkeletonUrl.map(skeleton => ({
                ...options,
                ...skeleton
            })),
            spinner,
            sleepTime,
            options,
            browser,
        })
    }

    async createSkeleton({
        targetSkeletonUrl,
        spinner,
        sleepTime,
        options,
        browser,
    }) {
        for await (let urls of targetSkeletonUrl) {
            spinner.text = `正在打开页面：${urls.url}...`;
            const page = await browser.openPage(urls.url, urls.extraHTTPHeaders)
            await sleep(sleepTime)
            await this.dealPage({
                page,
                options: {...options, output: {
                    ...urls,
                    injectSelector: urls.injectSelector || 'skeleton',
                    disabledScript: urls.disabledScript
                }},
                spinner
            });
        }
        spinner.clear().succeed(`skeleton screen has created and output to ${targetSkeletonUrl[0].fileDir}}`);
        await browser.browser.close();
        process.exit(0);
    }

    async dealPage({page, options, spinner}) {
        const { 
            output = {},
            loadDestory,
            pageShowContain,
            savePicture,
            backgroundColor,
            ignoreClass,
            lineHeight,
            createAll,
            disabledScript
        } = options
        const {filename, fileDir, injectSelector} = output
        const defaultName = 'skeleton'
        const defaultDir = path.join(cwd, defaultName)
        spinner.text = '正在生成骨架屏...';
        if (!fileDir) {
            if (!fs.existsSync(defaultDir)) {
                fs.mkdirSync(defaultDir, function(e) {
                    console.log(e)
                })
            }
        } else if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, function(e) {
                console.log(e)
            })
        }
        const skeletonDom = await page.evaluate.call(page, EvalDom, {
            backgroundColor,
            ignoreClass,
            lineHeight,
            createAll
        })
        const defaultPage = `${fileDir || defaultName}/${filename || defaultName}.png`
        const defaultFile = [fileDir || defaultName, '/', filename || defaultName, '.js'].join('')
        await page.screenshot({ path: defaultPage });
        base64Img.base64Sync(defaultPage)
        const defaultHtml = defaultEval({skeletonDom, injectSelector, loadDestory, pageShowContain, disabledScript})

        this.writeFile(defaultFile, defaultHtml)
        if (!savePicture && fs.existsSync(defaultPage)) {
            fs.unlink(defaultPage, function (err) {
                if (err) {
                    return console.error(err)
                }
            })
        }  
    }
   
    writeFile(filepath, html) {
        try {
            // fs.writeFileSync(filepath, html)
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
