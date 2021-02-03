package cc.mrbird.febs.generator.entity;

import cc.mrbird.febs.common.utils.FebsUtil;
import lombok.Data;

/**
 * @author MrBird
 */
@Data
public class Column {
    private String name; // 名称
    private Boolean isKey; // 是否为主键
    private String type; // 类型
    private String remark; // 注释
    private String field; // 属性名称
    private String classField;
    
    public void setField(String field) {
    	this.field = field;
    	this.classField = FebsUtil.underscoreToCamel(field);
    }
}
