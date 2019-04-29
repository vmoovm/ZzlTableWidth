function TableScroll (CName, yourConfig) {
	var self = this;
	this.CName = CName;
	
	this.config = {
	}
	// 合并参数配置
	if (yourConfig) {
		for (v in this.config) {
			for (b in yourConfig) {
				if (v == b) {
					this.config[v] = yourConfig[b];
				} else {
					// 不相等时，增加新参数
					this.config[b] = yourConfig[b];
				}
			}
		}
	} else {
		this.config = yourConfig
	}
	// 将字符串html转为dom
	function parseToDOM(str) {
	   var div = document.createElement("div");
	   if(typeof str == "string")
	       div.innerHTML = str;
	   return div.childNodes;
	}
	
	
	/**
	 * 将样式追加页面中
	 */
	function initTable () {
		var styleStr = '<style id="tableStyle">\n\
			.table-scroll-js { overflow: auto;}\n\
			.table-scroll-js::-webkit-scrollbar { height: 8px;}\n\
			.table-scroll-js::-webkit-scrollbar-track { height: 8px;}\n\
			.table-scroll-js::-webkit-scrollbar-thumb { height: 8px; border-radius: 4px; background-color: #ddd;}\n\
		</style>'
		var styleDom = parseToDOM(styleStr)
		var headDom = document.getElementsByTagName('head')[0]
		for(var i = 0; i < styleDom.length; i++) {
			var dom = styleDom[i].cloneNode(true);
			headDom.appendChild(dom)
		}
	}
	
	/**
	 * 获取子元素
	 * @param {oHTMLObjectElement} ele
	 * @param {HTMLDocument} eleName
	 */
	function children(ele, eleName) {
		var arr = []
		var hasEle = eleName ? eleName : false
		for (var c = 0; c < ele.childNodes.length; c++) {
			if (ele.childNodes[c].nodeType == 1) {
				if (hasEle == false) {
					arr.push(ele.childNodes[c])
				} else {
					if (ele.childNodes[c].nodeName.toLocaleLowerCase() == hasEle) {
						arr.push(ele.childNodes[c])
					}
					
				}
			}
		}
		return arr
	}
	
	
	/**
	 * 设置表格的宽和定制的列宽
	 * @param {Object} _this
	 */
	function setWidth (_this) {
		var _this = _this
		// console.log(_this.children('table'))
		var table = children(_this, 'table')[0]
		var tableThs = children(children(children(table, 'thead')[0], 'tr')[0], 'th')
		var tdWidth = table.getAttribute('data-td') > 0 ? table.getAttribute('data-td') : 100
		var privateWidthArr = [] // 存放私有宽度
		var wide = 0
		for (var i = 0; i < tableThs.length; i++) {
			var itemWidth = tableThs[i].getAttribute('data-width') * 1
			if (itemWidth) {
				privateWidthArr.push(tableThs[i])
				tableThs[i].style.width = itemWidth + 'px'
				wide += itemWidth
			}
		}
		// 若有私有宽度,排除私有宽度,否则会计算双份列
		if (privateWidthArr.length) {
			wide += (tableThs.length - privateWidthArr.length) * tdWidth
		} else {
			wide = tableThs.length * tdWidth
		}
		// 计算后表格本身宽 若比 表格父元素宽,将计算后宽赋于表格本身
		if (wide > _this.clientWidth) {
			table.style.width = wide + 'px'
		} else {
			table.style.width = wide + '%'
		}
	}
	
	function resetWidth (CName) {
		var CNameDom = document.getElementsByClassName(CName.substring(1))
		for (var i = 0; i < CNameDom.length; i++) {
			setWidth (CNameDom[i])
		}
	}
	
	
	function hasClass (el, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
        return re.test(el.className);
	}
	function addClass (el, c) {
		if (hasClass (el, c)) return
		var newClass = el.className.split(' ')
		newClass.push(c)
		el.className = newClass.join(' ')
	}
			
	this.tableScroll = function (CName) {
		initTable()
		resetWidth(CName)
		var CNameDom = document.getElementsByClassName(CName.substring(1))
		for (var i = 0; i < CNameDom.length; i++) {
			addClass(CNameDom[i], 'table-scroll-js')
		}
		if(window.addEventListener){
			window.addEventListener('resize', function(){ resetWidth(CName); });
		}else if(window.attachEvent){
			window.attachEvent('onresize', function(){ resetWidth(CName); });
		}
	}
	this.tableScroll(this.CName)
}

