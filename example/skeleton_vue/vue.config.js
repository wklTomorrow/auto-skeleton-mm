const Skeleton = require('../../index')
// const skeletonCode = require('./skeleton/index')
const skeletonConfig = require('./skeleton.config')

const {output, pageName = 'skeleton'} = skeletonConfig
const {fileDir = 'skeleton', filepath = 'index.js', injectSelector} = output

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
                    tagCode: require(`./${fileDir}/${pageName}-${filepath}`)
                }]
            }),
        ]
    }
}