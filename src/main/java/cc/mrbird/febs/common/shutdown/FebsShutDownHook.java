package cc.mrbird.febs.common.shutdown;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

/**
 * @author MrBird
 */
@Slf4j
@Component
public class FebsShutDownHook implements DisposableBean {

    @Override
    public void destroy() {
        log.info("FEBS系统已关闭，Bye");
    }
}
