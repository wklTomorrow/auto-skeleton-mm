module.exports = {
    url: 'https://www.baidu.com',
    // url: 'http://localhost:3000/jobs/job_detail?fr=search_job&ejid=Ksy3RDNCNhyHT80KuTg71Q',
    output: {
        // filepath: '/Users/maimai/Desktop/maimai/React/skeleton/public/index.html',
        filepath: 'index.js',
        // filepath: '/Users/maimai/Desktop/maimai/skeleton/index.html',
        fileDir: 'vue-skeleton',
        injectSelector: 'skeleton'
    },
    pageName: 'baidu',
    sleepTime: 500,
    loadDestory: false,
    device: 'mobile',
    extraHTTPHeaders: {
        cookie: '_buuid=9295bd7d-914c-4d47-9637-b7810d43b38d; csrftoken=fjfhlnOT-qf_jfBN7I-LpOqtb5ZDlHQgeG4Q; Hm_lvt_125466a4193d3041720419bb940c71b9=1633658633,1635492017,1635906982; Hm_lpvt_125466a4193d3041720419bb940c71b9=1635907908; session=eyJzZWNyZXQiOiJnUWxFT1RJM3diS1VlNkxDMGo5WXppTU8iLCJ1IjotMSwiX2V4cGlyZSI6MTYzNTk5NDMwODY1MywiX21heEFnZSI6ODY0MDAwMDB9; session.sig=A3idK9IQnGnTRpyGTxSYf48lAIE'
    },
    pageShowContain: ['mobile'], // mobile, pc
}
