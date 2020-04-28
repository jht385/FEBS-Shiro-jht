package cc.mrbird.febs.common.entity;

/**
 * 常量
 *
 * @author MrBird
 */
public interface FebsConstant {
	/**
	 * 注册用户角色ID
	 */
	Long REGISTER_ROLE_ID = 2L;

	/**
	 * 排序规则：降序
	 */
	String ORDER_DESC = "desc";
	/**
	 * 排序规则：升序
	 */
	String ORDER_ASC = "asc";

	/**
	 * 前端页面路径前缀
	 */
	String VIEW_PREFIX = "febs/views/";

	/**
	 * 验证码 Session Key
	 */
	String CODE_PREFIX = "febs_captcha_";

	/**
     * 允许下载的文件类型，根据需求自己添加（小写）
     */
	String[] VALID_FILE_TYPE = { "xlsx", "zip" };

	/**
	 * {@link cc.mrbird.febs.common.controller.BaseController} getDataTable 中
	 * HashMap 默认的初始化容量
	 */
	int DATA_MAP_INITIAL_CAPACITY = 4;
	/**
	 * 异步线程池名称
	 */
	String ASYNC_POOL = "febsAsyncThreadPool";

    /**
     * 开发环境
     */
    String DEVELOP = "dev";

    /**
     * Windows 操作系统
     */
    String SYSTEM_WINDOWS = "windows";
}
