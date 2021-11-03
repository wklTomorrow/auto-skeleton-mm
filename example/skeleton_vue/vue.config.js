const Skeleton = require('../../index')
// const skeletonCode = require('./skeleton/index')
const skeletonConfig = require('./skeleton.config')

const {output} = skeletonConfig
const {fileDir = './skeleton', filename = 'skeleton', injectSelector} = output
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