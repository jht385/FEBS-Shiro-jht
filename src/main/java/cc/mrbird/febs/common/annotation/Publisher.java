package cc.mrbird.febs.common.annotation;

import org.springframework.core.annotation.AliasFor;
import org.springframework.stereotype.Component;

import cc.mrbird.febs.common.entity.Strings;

import java.lang.annotation.*;

/**
 * @author MrBird
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Publisher {
    @AliasFor(annotation = Component.class)
    String value() default Strings.EMPTY;
}
