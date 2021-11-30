module.exports = function({defaultHtml, loadDestory, injectDOMNode, injectSelector}) {
    return `(function() {
        let dom = document.createElement('div')
        dom.innerHTML = \`${defaultHtml}\`
        if (${!!injectDOMNode}) {
            let node = document.getElementById('${injectDOMNode}')
            node.append(dom)
        } else {
            document.body.append(dom)
        }
        ${!!loadDestory} && window.addEventListener('load', function(){
            setTimeout(function(){
                const skeletonDom = document.getElementById('${injectDOMNode || injectSelector}')
                if (skeletonDom) {
                    skeletonDom.parentNode.removeChild(skeletonDom)
                }
            }, 0);
        })
    })()`
}
