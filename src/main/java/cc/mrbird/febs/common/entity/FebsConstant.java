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
    String[] VALID_FILE_TYPE = {"xlsx", "zip"};

    /**
     * 异步线程池名称
     */
    String ASYNC_POOL = "febsAsyncThreadPool";

    /**
     * 异步线程名称前缀
     */
    String ASYNC_THREAD_NAME_PREFIX = "febs-async-thread-";

    /**
     * 任务调度线程前缀
     */
    String QUARTZ_THREAD_NAME_PREFIX= "febs-job-thread-";

    /**
     * 开发环境
     */
    String DEVELOP = "dev";

    /**
     * Windows 操作系统
     */
    String SYSTEM_WINDOWS = "windows";
}
