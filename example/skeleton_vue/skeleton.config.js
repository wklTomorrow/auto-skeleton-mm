module.exports = {
    multyUrls: [
        {
            url: 'https://www.baidu.com',
            filename: 'baidu-index',
            extraHTTPHeaders: {},
            injectSelector: ''
        },
        {
            url: 'https://www.google.com/',
            filename: 'chrome-index',
            extraHTTPHeaders: {},
            injectSelector: ''
        }
    ],
    url: 'https://www.baidu.com',
    filename: 'baidu-index',
    fileDir: './baidu-skeleton',
    injectSelector: 'skeleton',
    backgroundColor: '#EEEFF7',
    sleepTime: 500,
    loadDestory: false,
    device: 'mobile',
    lineHeight: 22,
    disabledScript: true,
    createAll: false,
    savePicture: true,
    pageShowContain: ['mobile'], // mobile, pc
}
