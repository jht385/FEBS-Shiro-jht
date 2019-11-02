package cc.mrbird.febs.system.entity;

import java.util.Date;
import java.math.BigDecimal;

import lombok.Data;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@Data
@TableName("t_dict")
public class Dict {
	@TableId(value = "id", type = IdType.INPUT)
	private String id; // 编号 
	private String name; // 标签名 
	private String value; // 数据值 
	private String type; // 类型 
	private String description; // 描述 
	private BigDecimal sort; // 排序 
	private String parentId; // 父级编号 
	private String createBy; // 创建者 
	private Date createDate; // 创建时间 
	private String updateBy; // 更新者 
	private Date updateDate; // 更新时间 
	private String remarks; // 备注信息 
	private String delFlag; // 删除标记 
	private String ex1; // 扩展字段1 
}