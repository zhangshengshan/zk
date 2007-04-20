<%--
vbox.dsp

{{IS_NOTE
	Purpose:
		
	Description:
		
	History:
		Tue Jun 21 08:48:47     2005, Created by tomyeh
}}IS_NOTE

Copyright (C) 2005 Potix Corporation. All Rights Reserved.

{{IS_RIGHT
	This program is distributed under GPL Version 2.0 in the hope that
	it will be useful, but WITHOUT ANY WARRANTY.
}}IS_RIGHT
--%><%@ taglib uri="/WEB-INF/tld/web/core.dsp.tld" prefix="c" %>
<%@ taglib uri="/WEB-INF/tld/zk/core.dsp.tld" prefix="z" %>
<%@ taglib uri="/WEB-INF/tld/zul/core.dsp.tld" prefix="u" %>
<c:set var="self" value="${requestScope.arg.self}"/>
<table id="${self.uuid}" z.type="zul.box.Box"${self.outerAttrs}${self.innerAttrs} cellpadding="0" cellspacing="0">
	<c:forEach var="child" items="${self.children}">
	<tr id="${child.uuid}!chdextr"${u:getBoxChildOuterAttrs(child)}><td${u:getBoxChildInnerAttrs(child)}>${z:redraw(child, null)}</td></tr>
	</c:forEach>
</table>