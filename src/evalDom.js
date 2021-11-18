module.exports = function({backgroundColor, ignoreClass, lineHeight, createAll}) {
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
        
            this.shadowColor = backgroundColor || '#EEEFF7'
        
            this.bgColors = '#fff'
        
            this.EXCLUDE = [
                'i',
                'script',
                'style'
            ]
            this.options = options
            this.blocks = []
        }
    
        getNodeStyle(node) {
            const {
                backgroundColor,
                border,
                borderTop,
                borderBottom,
                borderLeft,
                borderRight,
                borderRadius,
                display,
                zIndex,
                flex,
                flexDirection,
                alignItems,
                justifyContent,
            } = getComputedStyle(node)
            return {
                'background-color': backgroundColor,
                border,
                'border-top': borderTop,
                'border-bottom': borderBottom,
                'border-left': borderLeft,
                'border-right': borderRight,
                'border-radius': borderRadius,
                display,
                flex,
                'flex-direction': flexDirection,
                'align-items': alignItems,
                'justify-content': justifyContent,
            }
        }

        getComputedStyleMap(node, attr = []) {
            let attrs = {}
            if (Array.isArray(attr)) {
                attr.forEach(a => {
                    let {unit, value = 0} = node.computedStyleMap().get(a)
                    if (unit === 'percent') {
                        attrs[a] = value.toFixed(2) + '%'
                    }
                    if (unit === 'px') {
                        attrs[a] = value.toFixed(2) + unit
                    }
                    if (!unit) {
                        attrs[a] = value
                    }
                })
            } else {
                let {unit, value = 0} = node.computedStyleMap().get(attr)
                if (unit === 'precent') {
                    attrs[attr] = value.toFixed(2) + '%'
                }
                if (unit === 'px') {
                    attrs[attr] = value.toFixed(2) + unit
                }
                if (!unit) {
                    attrs[a] = value
                }
            }
            return attrs
        }
        
        filterNodeDefaultStyle(attrs, defaultFilter, tagName) {
            let attrsObj = {}
            let filterTemplate = {
                position: 'static',
                'background-color': 'rgba(0, 0, 0, 0)',
                'border-radius': '0px',
                'border': '0px',
                'border-top': '0px',
                'border-bottom': '0px',
                'border-left': '0px',
                'border-right': '0px',
                'min-width': ['0.00px', 'auto', 'none'],
                'width': ['0.00px', 'auto', 'none'],
                'height': ['0.00px', 'auto', 'none'],
                'max-width': ['0.00px', 'auto', 'none'],
                'min-height': ['0.00px', 'auto', 'none'],
                'max-height': ['0.00px', 'auto', 'none'],
                // display: 'block',
                'z-index': 'auto',
                flex: '0 1 auto',
                'flex-direction': 'row',
                'align-items': 'normal',
                'justify-content': 'normal',
                'margin-top': '0',
                'margin-left': '0',
                'margin-bottom': '0',
                'margin-right': '0',
                'padding-left': '0',
                'padding-right': '0',
                'padding-bottom': '0',
                'padding-top': '0',
                left: 'auto',
                top: 'auto',
                right: 'auto',
                bottom: 'auto',
                margin: '0',
                padding: '0'
            }
            let displays = {
                div: 'block',
                span: 'inline'
            }
            let keys = Object.keys(attrs) || []
            let tags = tagName && tagName.toLowerCase()
            let filterObj = defaultFilter || filterTemplate
            keys.forEach(key => {
                let keysStr = this.toCamelCaseStr(key) || ''
                if (Array.isArray(filterObj[keysStr])) {
                    if (!filterObj[keysStr].includes(attrs[key])) {
                        attrsObj[key] = attrs[key]
                    }
                } else if ((attrs[key] && !attrs[key].startsWith(filterObj[keysStr]))) {
                    attrsObj[key] = attrs[key]
                }
            })
            if (Object.keys(displays).includes(tags)) {
                if (attrs.display && attrs.display === displays[tags]) {
                    delete attrsObj.display
                }
            }
            return attrsObj
        }

        toCamelCaseStr(str = '') {
            return str.replace(/([A-Z])/g, function(r) {
                return `-${r.toLocaleLowerCase()}`
            })
        }

        copyObjFromOtherObjAttr(taget, ...styles) {
            styles.forEach(style => {
                Object.assign(taget, {
                    ...style
                })
            })
        }

        setAttributes(node, attrs) {
            Object.keys(attrs).forEach(key => {
                node.setAttribute(key, attrs[key])
            })
        }

        startDraw() {
            const dom = document.body
            let _this = this
            const rootNode = document.createElement('div')
            _this.setAttributes(rootNode, {
                id: 'skeleton-view',
                style: `
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 999;
                `
            })
            function deepFindNode(nodes, root) {
                if (nodes.length) {
                    for (let i = 0; i < nodes.length; i++) {
                        const node = nodes[i]
                        const {offsetTop} = node
                        if (!createAll && offsetTop && offsetTop > win_h * 1.4) {
                            continue
                        }
                        let childNodes = node.childNodes || []
                        if (_this.isHideStyle(node)) continue
                        let nodeCopy
                        const nodeCopyTagName = node.tagName || ''
                        let background = _this.getStyle(node, 'backgroundImage');
                        let backgroundHasurl = background.match(/url\(.+?\)/);
                        backgroundHasurl = backgroundHasurl && backgroundHasurl.length;
                        let hasChildText = false
                        for (let j = 0; j < childNodes.length; j++) {
                            if (_this.isText(childNodes[j])) {
                                hasChildText = true
                                break
                            }
                        }
                        if (!_this.EXCLUDE.includes(nodeCopyTagName.toLowerCase()) && node.tagName) {
                            nodeCopy = document.createElement(nodeCopyTagName.toLowerCase() === 'img' ? 'span' : nodeCopyTagName )
                            let attrs = _this.getComputedStyleMap(node, [
                                'width',
                                'max-width',
                                'min-width',
                                'height',
                                'max-height',
                                'min-height',
                                'margin',
                                'margin-top',
                                'margin-left',
                                'margin-bottom',
                                'margin-right',
                                'padding',
                                'padding-left',
                                'padding-right',
                                'padding-bottom',
                                'padding-top',
                                'left',
                                'top',
                                'right',
                                'bottom',
                                'position',
                                'z-index'
                            ])
                            _this.copyObjFromOtherObjAttr(nodeCopy.style, {
                                ..._this.filterNodeDefaultStyle({
                                    ..._this.getNodeStyle(node),
                                }, null, nodeCopy.tagName)
                            }, {
                                ..._this.filterNodeDefaultStyle(attrs, null, nodeCopy.tagName)
                            })
                            // 处理图片
                            if (nodeCopyTagName.toLowerCase() === 'img' ) {
                                const textAlign = _this.getStyle(node.parentNode, 'text-align');
                                _this.copyObjFromOtherObjAttr(nodeCopy.style, {
                                    border: '0px',
                                    display: 'block',
                                }, textAlign === 'center' ? {
                                    margin: '0 auto'
                                } : {})
                            }
                            if (_this.getStyle(node, 'position') === 'fixed') {
                               nodeCopy.style.background = _this.bgColors
                            }
                            if (root) {
                                root.appendChild(nodeCopy)
                            }
                        }
                        if (nodeCopy && (_this.ELEMENT.includes(nodeCopyTagName.toLowerCase()) || _this.isCustomCardBlock(node) || backgroundHasurl)) {
                            _this.copyObjFromOtherObjAttr(nodeCopy.style, {
                                background: _this.shadowColor,
                                color: _this.bgColors,
                                border: '0px'
                            })
                        } else if (nodeCopy && childNodes && childNodes.length) {
                            if (childNodes.length === 1 && _this.isText(childNodes[0])) {
                                let innerSpan = document.createElement('span')
                                innerSpan.textContent = node.textContent
                                // const lineHeight = _this.getStyle(node, 'line-height')
                                // let height = _this.getStyle(node, 'height')
                                let {
                                    lineHeight,
                                    height
                                } = _this.getStyles(node, ['lineHeight', 'height'])
                                _this.copyObjFromOtherObjAttr(innerSpan.style, {
                                    visibility: 'hidden'
                                })
                                console.log(node, nodeCopy, lineHeight, height)
                                if (parseInt(height) / parseInt(lineHeight) > 1.1) {
                                    _this.copyObjFromOtherObjAttr(nodeCopy.style, {
                                        height,
                                        backgroundImage: `linear-gradient(transparent 20%, ${_this.shadowColor} 0%, ${_this.shadowColor} 80%, transparent 0%)`,
                                        backgroundSize: `100% ${lineHeight}`
                                    })
                                } else {
                                    const fontHeight = _this.getStyle(node, 'font-size')
                                    _this.copyObjFromOtherObjAttr(nodeCopy.style, {
                                        height: fontHeight,
                                        backgroundColor: _this.shadowColor,
                                        fontSize: fontHeight
                                    })
                                }
                                if (node.parentNode.childNodes && node.parentNode.childNodes.length > 1) {
                                    nodeCopy.parentNode.style.backgroundColor =  _this.bgColors
                                }
                                nodeCopy.appendChild(innerSpan)
                            } else if (childNodes.length > 1 && hasChildText) {
                                node.childNodes.forEach(n => {
                                    if (n.nodeType === 3 && n.textContent) {
                                        let spanElement = document.createElement('span')
                                        spanElement.innerHTML = n.textContent
                                        n.parentNode.replaceChild(spanElement, n)
                                    }
                                })
                                deepFindNode(node.childNodes, nodeCopy)
                            } else if(!hasChildText) {
                                deepFindNode(node.childNodes, nodeCopy)
                            }
                        }
                    }
                }
            }
            deepFindNode(dom.childNodes, rootNode)
            const childs = document.body.childNodes
            // 替换之前的 body
            ;[...childs].forEach(n => {
                document.body.removeChild(n)
            })
            document.body.appendChild(rootNode)
            return rootNode;
        }

        getStyle(node, attr) {
            return (node.nodeType === 1 ? getComputedStyle(node)[attr] : '') || '';
        }

        getStyles(node, attrs = []) {
            const attrsResult = {}
            attrs.forEach(attr => {
                attrsResult[attr] = this.getStyle(node, attr)
            })
            return attrsResult
        }
    
        isHideStyle(node) {
            const {display, visibility, opacity} = this.getStyles(node, [
                'display',
                'visibility',
                'opacity'
            ])
            return display === 'none' || 
                visibility === 'hidden' || 
                opacity == 0 ||
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
            resolve(document.body.innerHTML)
        } catch (e) {
            reject(e)
        }
    })
}
