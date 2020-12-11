package cc.mrbird.febs.generator.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import cc.mrbird.febs.common.util.DateUtil;
import lombok.Data;

/**
 * @author MrBird
 */
@Data
@TableName("t_generator_config")
public class GeneratorConfig {
	public static final String TRIM_YES = "1";
	public static final String TRIM_NO = "0";

	@TableId(value = "ID", type = IdType.AUTO)
	private String id;
	private String author;
	private String basePackage;
	private String module;
	private String controllerPackage;
	private String servicePackage;
	private String serviceImplPackage;
	private String entityPackage;
	private String mapperPackage;
	private String mapperXmlPackage;
	private String htmlRoot;
	private String jsRoot;
	private String cssRoot;
	private String isTrim;
	private String trimValue;

	private transient String javaPath = "/src/main/java/";
	private transient String resourcesPath = "src/main/resources";
	private transient String date = DateUtil.formatFullTime(LocalDateTime.now(), DateUtil.FULL_TIME_SPLIT_PATTERN);

	private transient String tableName;
	private transient String tableComment;
	private transient String className;
	private transient boolean hasDate;
    private transient boolean hasBigDecimal;
    private transient List<Column> columns;

}