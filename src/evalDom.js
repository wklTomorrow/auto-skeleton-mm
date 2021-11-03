module.exports = function() {
    const win_w = window.innerWidth
    const win_h = window.innerHeight
    class EvalDom {
        constructor(options) {
            this.ELEMENT = [
                'img',
                'textarea',
                'button',
                'input',
                'canvas',
                'svg',
                'audio',
                'code',
                'pre',
                'video'
                // 'audio', 'button', 'canvas', 'code', 'IMG', 'input', 'pre', 'svg', 'textarea', 'video', 'xmp'
            ]
        
            this.shadowColor = '#EEEFF7'
        
            this.bgColors = '#fff'
        
            this.EXCLUDE = [
                'i'
            ]
            this.options = options
            this.blocks = []
            const classProp = {
                position: 'fixed',
                background: this.shadowColor,
                zIndex: 999
            }
            this.createCommonClass(classProp)
        }
    
        createCommonClass(props) {
            const inlineStyle = ['<style>body{overflow:hidden}._{'];
            for(let prop in props) {
                inlineStyle.push(`${prop === 'zIndex'? 'z-index': prop}:${props[prop]};`);
            }
            inlineStyle.push('}</style>');
            // inlineStyle.push('}.__{top:0%;left:0%;width:100%;}</style>');
            this.blocks.push(inlineStyle.join(''))
        }
    
        startDraw() {
            const dom = document.body
            let _this = this
            console.log(dom)
            function deepFindNode(nodes) {
                if (nodes.length) {
                    for (let i = 0; i < nodes.length; i++) {
                        const node = nodes[i]
                        if (_this.isHideStyle(node)) continue
                        let childNodes = node.childNodes || []
                        let hasChildText = false
                        let background = _this.getStyle(node, 'backgroundImage');
                        let backgroundHasurl = background.match(/url\(.+?\)/);
                        backgroundHasurl = backgroundHasurl && backgroundHasurl.length;
                        for (let j = 0; j < childNodes.length; j++) {
                            if (_this.isText(childNodes[j])) {
                                hasChildText = true
                                break
                            }
                        }
                        const tagName = node.tagName || ''
                        if (_this.ELEMENT.includes(tagName.toLowerCase()) || _this.isCustomCardBlock(node) || backgroundHasurl || _this.isText(node) || hasChildText) {
                            const {left, top, height, width} = _this.getRect(node)
                            if (height > 0 && width > 0 && left >= 0 && left <= win_w && win_h - top >= 20 && top >= 0) {
                                const {
                                    paddingTop,
                                    paddingBottom,
                                    paddingLeft,
                                    paddingRight,
                                    boxSizing
                                } = _this.getPadding(node)
                                const bdReg = /(0px)|(none)/;
                                const hasNoBorder = ['top', 'left', 'right', 'bottom'].some(item => {
                                    return bdReg.test(_this.getStyle(node, 'border-' + item));
                                  });
                                  !hasNoBorder && (node.style.borderColor = _this.shadowColor)
                                node.style.color = _this.bgColors
                                node.style.background = _this.bgColors
                                _this.drawBlock({
                                    top,
                                    width: boxSizing ? width : width - paddingLeft - paddingRight,
                                    height: boxSizing ? height : height - paddingTop - paddingBottom,
                                    left,
                                    radius: _this.getStyle(node, 'border-radius'),
                                    hasNoBorder: !hasNoBorder,
                                })
                                ;[...childNodes].map(ele => {
                                    const eleTageName = ele.tagName || ''
                                    _this.EXCLUDE.includes(eleTageName.toLowerCase()) && node.removeChild(ele)
                                })
                            }
                        } else if (childNodes && childNodes.length) {
                            if (!hasChildText) {
                                deepFindNode(childNodes)
                            }
                        }
                    }
                }
            }
            deepFindNode(dom.childNodes)
            return this.showBlock()
        }
    
        getStyle(node, attr) {
            return (node.nodeType === 1 ? getComputedStyle(node)[attr] : '') || '';
        }
    
        isHideStyle(node) {
            return this.getStyle(node, 'display') === 'none' || 
                this.getStyle(node, 'visibility') === 'hidden' || 
                this.getStyle(node, 'opacity') == 0 ||
                node.hidden;
        }
    
        isText(node) {
            return node.nodeType === 3 && node.textContent.trim().length
        }
    
        isCustomCardBlock(node) {
            const bgStyle = this.getStyle(node, 'background');
            const bgColorReg = /rgba\([\s\S]+?0\)/ig;
            const bdReg = /(0px)|(none)/;
            const hasBgColor = !bgColorReg.test(bgStyle) || ~bgStyle.indexOf('gradient');
            const hasNoBorder = ['top', 'left', 'right', 'bottom'].some(item => {
              return bdReg.test(this.getStyle(node, 'border-' + item));
            });
            const {width, height} = this.getRect(node);
            const customCardBlock = !!(hasBgColor && (!hasNoBorder || this.getStyle(node, 'box-shadow') != 'none') && width > 0 && height > 0 && width < 0.95*win_w && height < 0.3*win_h);
            return customCardBlock;
        }
    
        showBlock() {
            if (this.blocks.length) {
                const blockHtml = this.blocks.join('');
                const div = document.createElement('div');
                div.innerHTML = blockHtml
                document.body.appendChild(div)
                return blockHtml
            }
        }
    
        drawBlock({height, left, width, top, radius, hasNoBorder} = {}) {
            const styles = [
                `height: ${height}px`,
                `width: ${width}px`,
                `left: ${left}px`,
                `top: ${top}px`,
            ]
            radius && radius !== '0px' && styles.push(`border-radius: ${radius}`)
            hasNoBorder && styles.push(`border: 1px solid #eee`)
            this.blocks.push(`<div class="_" style="${styles.join(';')}"></div>`)
        }
    
        getPadding(node) {
            return {
                paddingBottom: parseInt(this.getStyle(node, 'padding-bottom')),
                paddingLeft: parseInt(this.getStyle(node, 'padding-left')),
                paddingTop: parseInt(this.getStyle(node, 'padding-top')),
                paddingRight: parseInt(this.getStyle(node, 'padding-right')),
                boxSizing: this.getStyle(node, 'box-sizing') === 'border-box'
            }
        }
    
        getRect(node) {
            if (node) {
                const {left, top, height, width} = node.getBoundingClientRect();
                return {left, top, height, width}
            }
            return {}
        }
    }
    return new Promise((resolve, reject) => {
        try {
            const html = new EvalDom().startDraw()
            resolve(html)
        } catch (e) {
            reject(e)
        }
    })
}