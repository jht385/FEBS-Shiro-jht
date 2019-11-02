package ${basePackage}.${module}.${entityPackage};

import java.util.Date;
import java.math.BigDecimal;

import lombok.Data;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@Data
@TableName("${tableName}")
public class ${className} {
	<#if columns??>
		<#list columns as column>
	<#if column.isKey = true>
	@TableId(value = "${column.name}", type = IdType.INPUT)
	<#else>
	</#if>
	<#if (column.type = 'varchar' || column.type = 'text' || column.type = 'uniqueidentifier'
		|| column.type = 'varchar2' || column.type = 'nvarchar' || column.type = 'VARCHAR2'
		|| column.type = 'VARCHAR'|| column.type = 'CLOB' || column.type = 'char')>
	private String ${column.classField?uncap_first}; // ${column.remark} 
	</#if>
	<#if column.type = 'timestamp' || column.type = 'date' || column.type = 'datetime'||column.type = 'TIMESTAMP' || column.type = 'DATE' || column.type = 'DATETIME'>
	private Date ${column.classField?uncap_first}; // ${column.remark} 
	</#if>
	<#if column.type = 'int' || column.type = 'smallint'>
	private Integer ${column.classField?uncap_first}; // ${column.remark} 
	</#if>
	<#if column.type = 'bigint'>
	private Long ${column.classField?uncap_first}; // ${column.remark} 
	</#if>
	<#if column.type = 'double'>
	private Double ${column.classField?uncap_first}; // ${column.remark} 
	</#if>
	<#if column.type = 'tinyint'>
	private Byte ${column.classField?uncap_first}; // ${column.remark} 
	</#if>
	<#if column.type = 'decimal' || column.type = 'numeric'>
	private BigDecimal ${column.classField?uncap_first}; // ${column.remark} 
	</#if>
		</#list>
	</#if>
}