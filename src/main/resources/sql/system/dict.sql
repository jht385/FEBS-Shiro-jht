-- 参考菜单语句，添加后需要配置角色对应权限
INSERT INTO `t_menu` (`PARENT_ID`, `MENU_NAME`, `URL`, `PERMS`, `ICON`, `TYPE`, `ORDER_NUM`, `CREATE_TIME`)
select t1.MENU_ID, '字典表', '/system/dict/', 'dict:view', '', '0', t2.cnt + 1, now()
from t_menu t1
	LEFT JOIN (
		select PARENT_ID, count(1) cnt from t_menu where url like '%/system/%' group by PARENT_ID
	) t2 on t1.MENU_ID = t2.PARENT_ID
where t2.PARENT_ID is not null;

INSERT INTO `t_menu` (`PARENT_ID`, `MENU_NAME`, `PERMS`, `TYPE`, `ORDER_NUM`, `CREATE_TIME`)
select MENU_ID, '新增', 'dict:add', '1', 1, now() from t_menu where MENU_NAME = '字典表'
union
select MENU_ID, '修改', 'dict:update', '1', 2, now() from t_menu where MENU_NAME = '字典表'
union
select MENU_ID, '删除', 'dict:delete', '1', 3, now() from t_menu where MENU_NAME = '字典表';