# ZzlTableWidth
定制底部出现滚动条，可定制列宽
原生javascript 没有依赖
兼容ie8及以上浏览器


# 使用方法：
// 设置表格列宽，并加滚动条
	
	<script src="js/ZzlTableWidth.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript">
	// 设置表格列宽，并加滚动条
		new TableScroll(".ztable-js", {})
	</script>
  
      
      	<div class="div_table bgWhite ztable-js">
		<table border="0" cellspacing="0" cellpadding="0" data-td="20">
			<thead>
				<tr>
					<th data-width="150">专业</th>
					<th data-width="100">院系</th>
					<th data-width="80">签到次数</th>
					<th data-width="90">签到率</th>
					<th>缺勤次数</th>
					<th>缺勤率</th>
					<th>专业</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>大学物理</td>
					<td>文学院</td>
					<td>120</td>
					<td>245</td>
					<td>李百万</td>
					<td>365</td>
					<td>大学物理</td>
				</tr>
			</tbody>
		</table>
	</div>
      	<div class="div_table bgWhite ztable-js">
		<table border="0" cellspacing="0" cellpadding="0" data-td="20">
			.....
		</table>
	</div>
      
   # 支持多表
      
   # 自定义列宽th
     <th data-width="150">
   #   定义默认列宽
      <table data-td="20">
      
       
       
