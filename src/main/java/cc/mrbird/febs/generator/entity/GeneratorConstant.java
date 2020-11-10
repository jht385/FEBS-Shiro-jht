package cc.mrbird.febs.generator.entity;

/**
 * 代码生成常量
 *
 * @author MrBird
 */
public interface GeneratorConstant {
    String DATABASE_TYPE = "mysql"; // 数据库类型
    String TEMP_PATH = "febs_gen_temp/"; // 生成代码的临时目录
    String JAVA_FILE_SUFFIX = ".java"; // java类型文件后缀
    String MAPPER_FILE_SUFFIX = "Mapper.java"; // mapper文件类型后缀
    String SERVICE_FILE_SUFFIX = "Service.java"; // service文件类型后缀
    String SERVICEIMPL_FILE_SUFFIX = "ServiceImpl.java"; // service impl文件类型后缀
    String CONTROLLER_FILE_SUFFIX = "Controller.java"; // controller文件类型后缀
    String MAPPERXML_FILE_SUFFIX = "Mapper.xml"; // mapper xml文件类型后缀
    String HTML_FILE_SUFFIX = ".html"; // list文件类型后缀
    String CSS_FILE_SUFFIX = ".css"; // list文件类型后缀
    String JS_FILE_SUFFIX = ".js"; // list文件类型后缀
    
    String ENTITY_TEMPLATE = "entity.ftl"; // entity模板
    String MAPPER_TEMPLATE = "mapper.ftl"; // mapper模板
    String SERVICE_TEMPLATE = "service.ftl"; // service接口模板
    String SERVICEIMPL_TEMPLATE = "serviceImpl.ftl"; // service impl接口模板
    String CONTROLLER_TEMPLATE = "controller.ftl"; // controller接口模板
    String MAPPERXML_TEMPLATE = "mapperXml.ftl"; // mapper xml接口模板
    String LIST_TEMPLATE = "list.ftl"; // list模板
    String ADD_TEMPLATE = "add.ftl"; // add模板
    String UPDATE_TEMPLATE = "update.ftl"; // update模板
    String LIST_JS_TEMPLATE = "list.js.ftl"; // list js模板
    String ADD_JS_TEMPLATE = "add.js.ftl"; // add js模板
    String UPDATE_JS_TEMPLATE = "update.js.ftl"; // update js模板
    String LIST_CSS_TEMPLATE = "list.css.ftl"; // list css模板
    String ADD_CSS_TEMPLATE = "add.css.ftl"; // add css模板
    String UPDATE_CSS_TEMPLATE = "update.css.ftl"; // update css模板
}
