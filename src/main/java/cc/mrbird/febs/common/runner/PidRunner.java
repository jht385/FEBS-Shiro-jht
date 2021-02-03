package cc.mrbird.febs.common.runner;

import java.io.File;
import java.lang.management.ManagementFactory;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class PidRunner implements ApplicationRunner {

	@Override
	public void run(ApplicationArguments args) throws Exception {
		String pid = ManagementFactory.getRuntimeMXBean().getName().split("@")[0];
		File dir = new File(".");
		File[] files = dir.listFiles();
		for (File file : files) {
			if (file.isDirectory()) {
				continue;
			}

			if (file.getName().endsWith(".pid")) {
				file.delete();
			}
		}
		File file = new File(pid + ".pid");
		file.createNewFile();
	}

}
