package cc.mrbird.febs.common.authentication;

import cc.mrbird.febs.common.entity.FebsConstant;
import cc.mrbird.febs.common.service.RedisService;
import cc.mrbird.febs.system.entity.User;
import com.baomidou.mybatisplus.core.toolkit.StringPool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.subject.PrincipalCollection;
import org.crazycake.shiro.RedisCacheManager;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * @author MrBird
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ShiroLogoutService {

    private final RedisService redisService;

    @Async(FebsConstant.ASYNC_POOL)
    public void cleanCacheFragment(PrincipalCollection principals) {
        User principal = (User) principals.getPrimaryPrincipal();
        String key = RedisCacheManager.DEFAULT_CACHE_KEY_PREFIX
                + ShiroRealm.class.getName()
                + StringPool.DOT + "authenticationCache" + StringPool.COLON + principal.getId();
        redisService.del(key);
        log.info("async clean up user cache fragment,cache key: [{}]", key);
    }
}