const Skeleton = require('../../index')
// const skeletonCode = require('./skeleton/index')
const skeletonConfig = require('./skeleton.config')
let filename = '', injectSelector, fileDir
if (skeletonConfig.multyUrls.length) {
    filename = skeletonConfig.multyUrls[0].filename
    injectSelector = skeletonConfig.multyUrls[0].injectSelector || 'skeleton'
    fileDir = skeletonConfig.multyUrls[0].fileDir
} else {
    filename = skeletonConfig.filename
    injectSelector = skeletonConfig.injectSelector
    fileDir = skeletonConfig.fileDir
}
const tagCode = require(`${fileDir}/${filename}.js`);

module.exports = {
    // 选项...
    configureWebpack: {
        plugins: [
            new Skeleton({
                headTags: [],
                bodyTags: [{
                    tagName: 'div',
                    closeTag: true,
                    attributes: {
                        id: injectSelector
                    },
                    tagCode: tagCode
                }]
            }),
        ]
    }
}