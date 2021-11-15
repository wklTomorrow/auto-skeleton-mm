module.exports = function ({skeletonDom, injectSelector, loadDestory, pageShowContain}) {
    return `
        <div id="${injectSelector}">
            <style>
            body {
                overflow: hidden;
            }
            .skeleton-shadow {
                animation: flush 2s linear infinite;
                position: fixed;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 9999;
                background-size: 400% 100%;
                background-image: linear-gradient( 
                    90deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, .6) 50%,
                    rgba(255, 255, 255, 0) 100%)
            }
        

            @keyframes flush {
                0% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0 50%;
                }
            }
            </style>
            <div class="skeleton-shadow"></div>
            ${skeletonDom}
            <script>
            ${loadDestory ? `window.addEventListener('load', function(){
                setTimeout(function(){
                    const dom = document.getElementById('${injectSelector}')
                    if (dom) {
                        document.body.removeChild(dom)
                    }
                }, 0);
            });` : ''}
            </script>
            <script id='isMobileType'>
                function isMobile() {
                    return (/phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|webOS|android/i.test(navigator.userAgent))
                }
                const pcShow = ${pageShowContain.includes('pc')}
                const mobileShow = ${pageShowContain.includes('mobile')}
                function removeDom() {
                    const dom = document.getElementById('${injectSelector}')
                    dom && document.body.removeChild(dom)
                }
                function removeScript() {
                    const dom = document.getElementById('isMobileType')
                    dom && dom.parentNode.removeChild(dom)
                }
                if (mobileShow && pcShow) {
                    removeScript()
                } else if (mobileShow && !pcShow) {
                    if (!isMobile()) {
                        removeDom()
                    } else {
                        removeScript()
                    }
                } else {
                    if (isMobile()) {
                        removeDom()
                    } else {
                        removeScript()
                    }
                }
            </script>
        </div>
    `
}
