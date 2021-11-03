module.exports = `
        <style>.skeleton{position:absolute;top:0;left:0;right:0;bottom:0;z-index:9998;background-repeat:no-repeat!important;background-size:100% auto!important;background-image:url(data:image/png;base64,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)!important;background-color:#fff!important;background-position:center 0!important}.skeleton-shadow{animation:flush 2s linear infinite;position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999;background-size:400% 100%;background-image:linear-gradient(90deg,rgba(255,255,255,0) 0,rgba(255,255,255,.6) 50%,rgba(255,255,255,0) 100%)}@keyframes flush{0%{background-position:100% 50%}100%{background-position:0 50%}}</style>
        <div class="skeleton-shadow"></div>
        <div class="skeleton"></div>
        <script></script>
        <script id="isMobileType">function isMobile(){return/phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|webOS|android/i.test(navigator.userAgent)}const pcShow=!1,mobileShow=!0;function removeDom(){var e=document.getElementById("skeleton");e&&document.body.removeChild(e)}function removeScript(){const e=document.getElementById("isMobileType");e&&e.parentNode.removeChild(e)}(mobileShow&&pcShow?removeScript:mobileShow&&!pcShow?isMobile()?removeScript:removeDom:isMobile()?removeDom:removeScript)()</script>
    `