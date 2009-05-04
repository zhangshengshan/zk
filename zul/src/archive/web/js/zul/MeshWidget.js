/* MeshWidget.js

	Purpose:
		
	Description:
		
	History:
		Sat May  2 09:36:31     2009, Created by tomyeh

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under GPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
*/
zul.MeshWidget = zk.$extends(zul.Widget, {
	_pgpos: "bottom",

	//ROD Mold
	_innerWidth: "100%",
	_innerHeight: "100%",
	_innerTop: "height:0px;display:none",
	_innerBottom: "height:0px;display:none",

	setPagingPosition: function (pagingPosition) {
		if(this._pgpos != pagingPosition) {
			this._pgpos = pagingPosition;
			this.rerender();
		}
	},
	getPagingPosition: function () {
		return this._pgpos;
	},
	getPageSize: function () {
		return this.paging.getPageSize();
	},
	setPageSize: function (pgsz) {
		this.paging.setPageSize(pgsz);
	},
	getPageCount: function () {
		return this.paging.getPageCount();
	},
	getActivePage: function () {
		return this.paging.getActivePage();
	},
	setActivePage: function (pg) {
		this.paging.setActivePage(pg);
	},
	inPagingMold: function () {
		return "paging" == this.getMold();
	},

	getAlign: function () {
		return this._align;
	},
	setAlign: function (align) {
		if (this._align != align) {
			this._align = align;
			var n = this.getNode();
			if (n) n.align = align;
		}
	},

	isVflex: function () {
		return this._vflex;
	},
	setVflex: function (vflex) {
		if (this._vflex != vflex) {
			this._vflex = vflex;
			var n = this.getNode();
			if (n) {
				if (vflex) {
					// added by Jumper for IE to get a correct offsetHeight so we need 
					// to add this command faster than the this._calcSize() function.
					var hgh = n.style.height;
					if (!hgh || hgh == "auto") n.style.height = "99%"; // avoid border 1px;
				}
				this.onSize();
			}
		}
	},

	setFixedLayout: function (fixedLayout) {
		if(this._fixedLayout != fixedLayout) {
			this._fixedLayout = fixedLayout;
			this.rerender();
		}
	},
	isFixedLayout: function () {
		return this._fixedLayout;
	},

	isModel: function () {
		return this._model;
	},
	setModel: function (model) {
		if (this._model != model) {
			this._model = model;
		}
	},

	setInnerWidth: function (innerWidth) {
		if (innerWidth == null) innerWidth = "100%";
		if (this._innerWidth != innerWidth) {
			this._innerWidth = innerWidth;
			if (this.eheadtbl) this.eheadtbl.style.width = innerWidth;
			if (this.ebodytbl) this.ebodytbl.style.width = innerWidth;
			if (this.efoottbl) this.efoottbl.style.width = innerWidth;
		}
	},
	getInnerWidth: function () {
		return this._innerWidth;
	},
	setHeight: function (height) {
		this.$supers('setHeight', arguments);
		if (this.desktop) {
			if (zk.ie6Only && this.ebody) 
				this.ebody.style.height = height;
			// IE6 cannot shrink its height, we have to specify this.body's height to equal the element's height. 
			this._setHgh(height);
			this.onSize();
		}
	},
	setWidth: function (width) {
		this.$supers('setWidth', arguments);
		if (this.eheadtbl) this.eheadtbl.style.width = "";
		if (this.efoottbl) this.efoottbl.style.width = "";
	},
	setStyle: function (style) {
		if (this._style != style) {
			this.$supers('setStyle', arguments);
			this.onSize();
		}
	},

	bind_: function () {
		this.$supers('bind_', arguments);
		if (this.isVflex()) {
			// added by Jumper for IE to get a correct offsetHeight so we need 
			// to add this command faster than the this._calcSize() function.
			var hgh = this.getNode().style.height;
			if (!hgh || hgh == "auto") this.getNode().style.height = "99%"; // avoid border 1px;
		}
		this._bindDomNode();
		this._fixHeaders();
		if (this.ebody) {
			this.domListen_(this.ebody, 'scroll');
			this.ebody.style.overflow = ''; // clear
		}
		zWatch.listen("onSize", this);
		zWatch.listen("onShow", this);
		zWatch.listen("beforeSize", this);
	},
	unbind_: function () {
		if (this.ebody)
			this.domUnlisten_(this.ebody, 'scroll');
			
		this.ebody = this.ehead = this.efoot = this.ebodytbl
			= this.eheadtbl = this.efoottbl = null;
		
		zWatch.unlisten("onSize", this);
		zWatch.unlisten("onShow", this);
		zWatch.unlisten("beforeSize", this);
		
		this.$supers('unbind_', arguments);
	},
	_fixHeaders: function () {
		var headers = this.getHeadersWidget();
		if (headers && this.ehead) {
			var empty = true;
			for (var w = headers.firstChild; w; w = w.nextSibling) 
				if (w.getLabel() || w.getImage()) {
					empty = false;
					break;
				}
			this.ehead.style.display = empty ? 'none' : '';
		}
	},
	_bindDomNode: function () {
		for (var n = this.getNode().firstChild; n; n = n.nextSibling)
			switch(n.id) {
			case this.uuid + '$head':
				this.ehead = n;
				this.eheadtbl = zDom.firstChild(n, 'TABLE');
				break;
			case this.uuid + '$body':
				this.ebody = n;
				this.ebodytbl = zDom.firstChild(n, 'TABLE');
				break;
			case this.uuid + '$foot':
				this.efoot = n;
				this.efoottbl = zDom.firstChild(n, 'TABLE');
				break;
			}

		if (this.ebody) {
			if (this.ebodytbl.tBodies && this.ebodytbl.tBodies[this.ehead ? 1 : 0])
				this.ebodyrows = this.ebodytbl.tBodies[this.ehead ? 1 : 0].rows;
				//Note: bodyrows is null in FF if no rows, so no err msg
		}
		if (this.ehead) {
			this.ehdfaker = this.eheadtbl.tBodies[0].rows[0];
			this.ebdfaker = this.ebodytbl.tBodies[0].rows[0];
			if (this.efoottbl)
				this.eftfaker = this.efoottbl.tBodies[0].rows[0];
		}
	},
	fireOnRender: function (timeout) {
		if (!this._pendOnRender) {
			this._pendOnRender = true;
			setTimeout(this.proxy(this._onRender), timeout ? timeout : 100);
		}
	},
	domScroll_: function () {
		if (this.ehead)
			this.ehead.scrollLeft = this.ebody.scrollLeft;
		if (this.efoot)
			this.efoot.scrollLeft = this.ebody.scrollLeft;
		if (!this.paging) this.fireOnRender(zk.gecko ? 200 : 60);
	},
	_onRender: function () {
		this._pendOnRender = false;

		var rows = this.ebodyrows;
		if (!this._model || !rows || !rows.length) return;

		//Note: we have to calculate from top to bottom because each row's
		//height might diff (due to different content)
		var items = [],
			min = this.ebody.scrollTop, max = min + this.ebody.offsetHeight;
		for (var j = 0, it = this.getBodyWidgetIterator(), w; (w = it.next()); j++) {
			if (w.isVisible()) {
				var row = rows[j],
					top = zDom.offsetTop(row);
				if (top + zDom.offsetHeight(row) < min) continue;
				if (top > max) break; //Bug 1822517
				if (!w._loaded)
					items.push(w);
			}
		}
		if (items.length)
			this.fire('onRender', {items: items});
	},

	//derive must override
	//getHeadersWidget
	//getBodyWidgetIterator

	//watch//
	beforeSize: function () {
		// IE6 needs to reset the width of each sub node if the width is a percentage
		var wd = zk.ie6Only ? this.getWidth() : this.getNode().style.width;
		if (!wd || wd == "auto" || wd.indexOf('%') >= 0) {
			if (this.ebody) this.ebody.style.width = "";
			if (this.ehead) this.ehead.style.width = "";
			if (this.efoot) this.efoot.style.width = "";
		}
	},
	onSize: _zkf = function () {
		if (this.isRealVisible()) {
			var n = this.getNode();
			if (n._lastsz && n._lastsz.height == n.offsetHeight && n._lastsz.width == n.offsetWidth)
				return; // unchanged
				
			this._calcSize();// Bug #1813722
			this.fireOnRender(155);
			if (zk.ie7) zDom.redoCSS(this.getNode()); // Bug 2096807
		}
	},
	onShow: _zkf,
	_vflexSize: function (hgh) {
		var n = this.getNode();
		if (zk.ie6Only) { 
			// ie6 must reset the height of the element,
			// otherwise its offsetHeight might be wrong.
			n.style.height = "";
			n.style.height = hgh;
		}
		return n.offsetHeight - 2 - (this.ehead ? this.ehead.offsetHeight : 0)
			- (this.efoot ? this.efoot.offsetHeight : 0); // Bug #1815882 and Bug #1835369
	},
	/* set the height. */
	_setHgh: function (hgh) {
		if (this.isVflex() || (hgh && hgh != "auto" && hgh.indexOf('%') < 0)) {
			var h =  this._vflexSize(hgh); 
			if (this.paging) {
				/** TODO 
				 * var pgit = $e(this.id + "!pgit"), pgib = $e(this.id + "!pgib");
				if (pgit) h -= pgit.offsetHeight;
				if (pgib) h -= pgib.offsetHeight;*/
			}
			if (h < 0) h = 0;

			this.ebody.style.height = h + "px";
			
			//2007/12/20 We don't need to invoke the body.offsetHeight to avoid a performance issue for FF. 
			if (zk.ie && this.ebody.offsetHeight) {} // bug #1812001.
			// note: we have to invoke the body.offestHeight to resolve the scrollbar disappearing in IE6 
			// and IE7 at initializing phase.
		} else {
			//Bug 1556099: it is strange if we ever check the value of
			//body.offsetWidth. The grid's body's height is 0 if init called
			//after grid become visible (due to opening an accordion tab)
			this.ebody.style.height = "";
			this.getNode().style.height = hgh;
		}
	},
	/** Calculates the size. */
	_calcSize: function () {
		var n = this.getNode();
		this._setHgh(n.style.height);
		//Bug 1553937: wrong sibling location
		//Otherwise,
		//IE: element's width will be extended to fit body
		//FF and IE: sometime a horizontal scrollbar appear (though it shalln't)
		//note: we don't solve this bug for paging yet
		var wd = n.style.width;
		if (!wd || wd == "auto" || wd.indexOf('%') >= 0) {
			wd = zDom.revisedWidth(n, n.offsetWidth);
			if (wd < 0) wd = 0;
			if (wd) wd += "px";
		}
		if (wd) {
			this.ebody.style.width = wd;
			if (this.ehead) this.ehead.style.width = wd;
			if (this.efoot) this.efoot.style.width = wd;
		}
		//Bug 1659601: we cannot do it in init(); or, IE failed!
		var tblwd = this.ebody.clientWidth;
		if (zk.ie) //By experimental: see zk-blog.txt
			if (this.eheadtbl && this.eheadtbl.offsetWidth
					!= this.ebodytbl.offsetWidth)
				this.ebodytbl.style.width = ""; //reset 
			if (tblwd && this.ebody.offsetWidth == this.ebodytbl.offsetWidth
					&& this.ebody.offsetWidth - tblwd > 11) { //scrollbar
				if (--tblwd < 0) tblwd = 0;
				this.ebodytbl.style.width = tblwd + "px";
			}
				
		if (this.ehead) {
			if (tblwd) this.ehead.style.width = tblwd + 'px';
			if (!this.isFixedLayout() && this.ebodyrows && this.ebodyrows.length)
				this.$class._adjHeadWd(this);
		} else if (this.efoot) {
			if (tblwd) this.efoot.style.width = tblwd + 'px';
			if (this.efoottbl.rows.length && this.ebodyrows && this.ebodyrows.length)
				this.$class.cpCellWidth(this);
		}
		n._lastsz = {height: n.offsetHeight, width: n.offsetWidth}; // cache for the dirty resizing.
	},
	domFaker_: function (out, fakeId, zcls) { //used by mold
		var headers = this.getHeadersWidget();
		out.push('<tbody style="visibility:hidden;height:0px"><tr id="',
				headers.uuid, fakeId, '" class="', zcls, '-faker">');
		for (var w = headers.firstChild; w; w = w.nextSibling)
			out.push('<th id="', w.uuid, fakeId, '"', w.domAttrs_(),
				 	'><div style="overflow:hidden"></div></th>');
		out.push('</tr></tbody>');
	},

	//ROD
	setInnerHeight: function (innerHeight) {
		if (innerHeight == null) innerHeight = "100%";
		if (this._innerHeight != innerHeight) {
			this._innerHeight = innerHeight;
			// TODO for ROD Mold
		}
	},
	getInnerHeight: function () {
		return this._innerHeight;
	},
	setInnerTop: function (innerTop) {
		if (innerTop == null) innerTop = "height:0px;display:none";
		if (this._innerTop != innerTop) {
			this._innerTop = innerTop;
			// TODO for ROD Mold
		}
	},
	getInnerTop: function () {
		return this._innerTop;
	},
	setInnerBottom: function (innerBottom) {
		if (innerBottom == null) innerBottom = "height:0px;display:none";
		if (this._innerBottom != innerBottom) {
			this._innerBottom = innerBottom;
			// TODO for ROD Mold
		}
	},
	getInnerBottom: function () {
		return this._innerBottom;
	}
}, {
	_adjHeadWd: function (wgt) {
		// function (hdfaker, bdfaker, ftfaker, rows) {
		var hdfaker = wgt.ehdfaker,
			bdfaker = wgt.ebdfaker,
			ftfaker = wgt.eftfaker;
		if (!hdfaker || !bdfaker || !hdfaker.cells.length
		|| !bdfaker.cells.length || !zDom.isRealVisible(hdfaker)
		|| !wgt.getBodyWidgetIterator().hasNext()) return;
		
		var hdtable = wgt.ehead.firstChild, head = wgt.columns.getNode();
		if (!head) return; 
		if (zk.opera) {
			if (!hdtable.style.width) {
				var isFixed = true, tt = wgt.ehead.offsetWidth;
				for(var i = hdfaker.cells.length; --i >=0;) {
					if (!hdfaker.cells[i].style.width || hdfaker.cells[i].style.width.indexOf("%") >= 0) {
						isFixed = false; 
						break;
					}
					tt -= zk.parseInt(hdfaker.cells[i].style.width);
				}
				if (!isFixed || tt >= 0) hdtable.style.tableLayout = "auto";
			}
		}
		
		// Bug #1886788 the size of these table must be specified a fixed size.
		var bdtable = wgt.ebody.firstChild,
			total = Math.max(hdtable.offsetWidth, bdtable.offsetWidth), 
			tblwd = Math.min(bdtable.parentNode.clientWidth, bdtable.offsetWidth);
			
		if (total == wgt.ebody.offsetWidth && 
			wgt.ebody.offsetWidth > tblwd && wgt.ebody.offsetWidth - tblwd < 20)
			total = tblwd;
			
		var count = total;
		hdtable.style.width = total + "px";	
		
		if (bdtable) bdtable.style.width = hdtable.style.width;
		if (wgt.efoot) wgt.efoot.firstChild.style.width = hdtable.style.width;
		
		for (var i = bdfaker.cells.length; --i >= 0;) {
			if (!zDom.isVisible(hdfaker.cells[i])) continue;
			var wd = i != 0 ? bdfaker.cells[i].offsetWidth : count;
			bdfaker.cells[i].style.width = zDom.revisedWidth(bdfaker.cells[i], wd) + "px";
			hdfaker.cells[i].style.width = bdfaker.cells[i].style.width;
			if (ftfaker) ftfaker.cells[i].style.width = bdfaker.cells[i].style.width;
			var cpwd = zDom.revisedWidth(head.cells[i], zk.parseInt(hdfaker.cells[i].style.width));
			head.cells[i].style.width = cpwd + "px";
			var cell = head.cells[i].firstChild;
			cell.style.width = zDom.revisedWidth(cell, cpwd) + "px";
			count -= wd;
		}
		
		// in some case, the total width of this table may be changed.
		if (total != hdtable.offsetWidth) {
			total = hdtable.offsetWidth;
			tblwd = Math.min(wgt.ebody.clientWidth, bdtable.offsetWidth);
			if (total == wgt.ebody.offsetWidth && 
				wgt.ebody.offsetWidth > tblwd && wgt.ebody.offsetWidth - tblwd < 20)
				total = tblwd;
				
			hdtable.style.width = total + "px";	
			if (bdtable) bdtable.style.width = hdtable.style.width;
			if (wgt.efoot) wgt.efoot.firstChild.style.width = hdtable.style.width;
		}
	},
	cpCellWidth: function (wgt) {
		var dst = wgt.efoot.firstChild.rows[0],
			srcrows = wgt.ebodyrows;
		if (!dst || !srcrows || !srcrows.length || !dst.cells.length)
			return;
		var ncols = dst.cells.length,
			src, maxnc = 0;
		for (var j = 0, it = wgt.getBodyWidgetIterator(), w; (w = it.next());) {
			if (!w.isVisible() || !w._loaded) continue;

			var row = srcrows[j++],
				cells = row.cells, nc = zDom.ncols(row),
				valid = cells.length == nc && zDom.isVisible(row);
				//skip with colspan and invisible
			if (valid && nc >= ncols) {
				maxnc = ncols;
				src = row;
				break;
			}
			if (nc > maxnc) {
				src = valid ? row: null;
				maxnc = nc;
			} else if (nc == maxnc && !src && valid) {
				src = row;
			}
		}
		if (!maxnc) return;
	
		var fakeRow = !src;
		if (fakeRow) { //the longest row containing colspan
			src = document.createElement("TR");
			src.style.height = "0px";
				//Note: we cannot use display="none" (offsetWidth won't be right)
			for (var j = 0; j < maxnc; ++j)
				src.appendChild(document.createElement("TD"));
			srcrows[0].parentNode.appendChild(src);
		}
	
		//we have to clean up first, since, in FF, if dst contains %
		//the copy might not be correct
		for (var j = maxnc; --j >=0;)
			dst.cells[j].style.width = "";
	
		var sum = 0;
		for (var j = maxnc; --j >= 0;) {
			var d = dst.cells[j], s = src.cells[j];
			if (zk.opera) {
				sum += s.offsetWidth;
				d.style.width = zDom.revisedWidth(s, s.offsetWidth);
			} else {
				d.style.width = s.offsetWidth + "px";
				if (maxnc > 1) { //don't handle single cell case (bug 1729739)
					var v = s.offsetWidth - d.offsetWidth;
					if (v != 0) {
						v += s.offsetWidth;
						if (v < 0) v = 0;
						d.style.width = v + "px";
					}
				}
			}
		}
	
		if (zk.opera && !wgt.isFixedLayout())
			dst.parentNode.parentNode.style.width = sum + "px";
	
		if (fakeRow)
			src.parentNode.removeChild(src);
	}
});