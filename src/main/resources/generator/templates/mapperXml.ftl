<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${basePackage}.${module}.${mapperPackage}.${className}Mapper">

	<resultMap id="${className?uncap_first}" type="${basePackage}.${module}.${entityPackage}.${className}">
		<#if columns??>
		<#list columns as column>
			<#if column.isKey = true>
		<id column="${column.name}" jdbcType="${column.type?upper_case}" property="${column.classField?uncap_first}"/>
			<#else>
		<result column="${column.name}" jdbcType="${column.type?upper_case}" property="${column.classField?uncap_first}"/>
			</#if>
		</#list>
		</#if>
	</resultMap>
	
	<sql id="find${className}Sql">
		select <#list columns as column>${column.name}<#if column_has_next>, </#if></#list>
		from ${tableName}
		where 1=1
		<#list columns as column>
		<if test="${className?uncap_first}.${column.classField?uncap_first} != null and ${className?uncap_first}.${column.classField?uncap_first} != ''"> AND ${column.name} = ${"#{"}${className?uncap_first}.${column.classField?uncap_first}}</if>
		</#list>
	</sql>
	
	<select id="find${className}Page" parameterType="${className?uncap_first}" resultType="${className?uncap_first}">
		<include refid="find${className}Sql"/>
	</select>
</mapper>