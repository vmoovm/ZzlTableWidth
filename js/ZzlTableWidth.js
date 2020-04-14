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
	
	function cdE (ele, eleSubType) {
		var NodeArr = []
		NodeArr[0] = []
		NodeArr[1] = []
		for (var s = 0; s < ele.length; s++) {
			for (var c = 0; c < ele[s].childNodes.length; c++) {
				if (eleSubType.type = 'name') {
					if (ele[s].childNodes[c].nodeType == 1 && (ele[s].childNodes[c].nodeName.toLowerCase() == eleSubType.value)) {
						NodeArr[0].push(ele[s].childNodes[c])
						NodeArr[1].push(ele[s].childNodes[c])
					} else if (ele[s].childNodes[c].nodeType == 1) {
						// NodeArr[0].push(null)
						NodeArr[1].push(ele[s].childNodes[c])
					}
					
				} else if (eleSubType.type = 'className') {
					var re = new RegExp("(^|\\s)" + eleSubType.value + "(\\s|$)");
					if (ele[s].childNodes[c].nodeType == 1 && re.test(ele[s].childNodes[c].className)) {
						NodeArr[0].push(ele[s].childNodes[c])
						NodeArr[1].push(ele[s].childNodes[c])
					} else if (ele[s].childNodes[c].nodeType == 1) {
						// NodeArr[0].push(null)
						NodeArr[1].push(ele[s].childNodes[c])
					}
				} else if (eleSubType.type = 'idName') {
					if (ele[s].childNodes[c].nodeType == 1 && re.test(ele[s].childNodes[c].id == eleSubType.value)) {
						NodeArr[0].push(ele[s].childNodes[c])
						NodeArr[1].push(ele[s].childNodes[c])
					} else if (ele[s].childNodes[c].nodeType == 1) {
						// NodeArr[0].push(null)
						NodeArr[1].push(ele[s].childNodes[c])
					}
				}
			}
		}
		return NodeArr
	}
	
	function userChildren (ele, eleChildren, eleSubType) {
		var tempArr = cdE(ele, eleSubType)
		if (!tempArr[0].length && !tempArr[1].length) {
			return eleChildren
		}
		if (tempArr.length && tempArr[0].length > 0) {
			eleChildren.mine.push(tempArr[0])
		}
		if (tempArr.length && tempArr[1].length > 0) {
			for (var r = 0; r < tempArr[1].length; r++) {
				eleChildren.all.push(tempArr[1][r])
			}
			return userChildren(tempArr[1], eleChildren, eleSubType)
		}
	}
	

 	var find = function (ele, eleSub) {
	 	var eleChildren = {
	 		all: [],  // 存放元素节点1总和
	 		mine: [] // 只存放我指定的元素节点
	 	} // 存所有子元素
	 	var eleSubType = null // 区分是样式名|是id名|是标签名
	 	if (!ele.childNodes) return eleChildren.all
		// 是找标签|class|id
		if (!eleSub) {
			eleSubType = null
	 	} else if (/^\./g.test(eleSub)) {
			eleSubType = {type: 'className', value: eleSub}
		} else if (/^\#/g.test(eleSub)) {
			eleSubType = {type: 'idName', value: eleSub}
		} else {
			eleSubType = {type: 'name', value: eleSub}
		}
		
		var eleArr = []
		eleArr.push(ele)
		var result = userChildren(eleArr, eleChildren, eleSubType)
		if (!eleSubType) return result.all
		// 如果是多个数组,将多个数组合并为一个数组
		if (result.mine.length > 1) {
			for (var a = 1; a < result.mine.length; a++) {
				for(var i in result.mine[a]){
				  result.mine[0].push(result.mine[a][i]);
				}
			}
		}
		return result.mine[0]
		
	}
	
	
	/**
	 * 设置表格的宽和定制的列宽
	 * @param {Object} _this
	 */
	function setWidth (_this) {
		var _this = _this
		// console.log(_this.children('table'))
		var table = find(_this, 'table')[0]
		var tableThs = find(table, 'th')
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

