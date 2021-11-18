module.exports = {
    url: 'https://www.baidu.com',
    output: {
        filename: 'baidu-index',
        // filepath: '/Users/maimai/Desktop/maimai/skeleton/index.html',
        fileDir: './baidu-skeleton',
        injectSelector: 'skeleton'
    },
    backgroundColor: '#EEEFF7',
    sleepTime: 500,
    loadDestory: false,
    device: 'mobile',
    lineHeight: 24,
    extraHTTPHeaders: {
        cookie: ''
    },
    createAll: false,
    savePicture: true,
    pageShowContain: ['mobile'], // mobile, pc
}
