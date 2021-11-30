module.exports = {
    multyUrls: [
        {
            url: 'https://www.baidu.com',
            filename: 'baidu-index',
            fileDir: './static',
            extraHTTPHeaders: {},
        },
        // {
        //     url: 'https://www.google.com/',
        //     filename: 'chrome-index',
        //     fileDir: './baidu-skeleton',
        //     extraHTTPHeaders: {},
        //     injectSelector: ''
        // },
    ],
    url: 'https://www.baidu.com',
    filename: 'baidu-index',
    fileDir: './skeleton',
    injectSelector: 'skeleton',
    backgroundColor: '#EEEFF7',
    sleepTime: 500,
    loadDestory: false,
    device: 'mobile',
    lineHeight: 22,
    disabledScript: true,
    createAll: false,
    isCDN: true,
    injectDOMNode: '',
    savePicture: true,
    pageShowContain: ['mobile'], // mobile, pc
}
