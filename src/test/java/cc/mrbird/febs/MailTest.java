package cc.mrbird.febs;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.test.context.junit4.SpringRunner;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MailTest {
	@Autowired
	private JavaMailSender mailSender;

	@Test // 简单邮件
	public void sendSimpleEmail() {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("xxx@qq.com"); // 发送者
		message.setTo("xxx@qq.com"); // 接收者
		message.setSubject("测试邮件（邮件主题）"); // 邮件主题
		message.setText("这是邮件内容");// 邮件内容.
		mailSender.send(message);// 发送邮件
	}

	@Test // 带附件的邮件
	public void sendAttachmentsEmail() throws MessagingException {
		javax.mail.internet.MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
		helper.setFrom("412887952@qq.com");
		helper.setTo("1473773560@qq.com");
		helper.setSubject("测试附件（邮件主题）");
		helper.setText("这是邮件内容（有附件哦.）");// 邮件内容.
		org.springframework.core.io.FileSystemResource file1 = new FileSystemResource(
				new File("D:/test/head/head1.jpg"));
		// 添加附件，这里第一个参数是在邮件中显示的名称，也可以直接是head.jpg，但是一定要有文件后缀，不然就无法显示图片了
		helper.addAttachment("头像1.jpg", file1);
		FileSystemResource file2 = new FileSystemResource(new File("D:/test/head/head2.jpg"));
		helper.addAttachment("头像2.jpg", file2);
		mailSender.send(mimeMessage);
	}

	@Test // 邮件中使用静态资源
	public void sendInlineMail() throws Exception {
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
		helper.setFrom("412887952@qq.com");
		helper.setTo("1473773560@qq.com");
		helper.setSubject("测试静态资源（邮件主题）");
		// 邮件内容，第二个参数指定发送的是HTML格式
		// 说明：嵌入图片<img src='cid:head'/>，其中cid:是固定的写法，而aaa是一个contentId。
		helper.setText("<body>这是图片：<img src='cid:head' /></body>", true);
		FileSystemResource file = new FileSystemResource(new File("D:/test/head/head1.jpg"));
		helper.addInline("head", file);
		mailSender.send(mimeMessage);
	}

	@Autowired
	private TemplateEngine templateEngine;

	@Test // 使用模板发送邮件
	public void sendThymeleafTemplateMail() throws Exception {
		String[] filePath = new String[] { "C:\\01.jpg" };

		Map<String, Object> valueMap = new HashMap<>();
		valueMap.put("to", new String[] { "接收邮箱1", "接收邮箱2" });
		valueMap.put("title", "邮件标题");
		valueMap.put("content", "邮件内容");
		valueMap.put("filePathList", filePath);

		MimeMessage mimeMessage = null;
		try {
			mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
			helper.setFrom("412887952@qq.com");
			helper.setTo((String[]) valueMap.get("to"));
			helper.setSubject(valueMap.get("title").toString());

			// 添加正文（使用thymeleaf模板）
			Context context = new Context();
			context.setVariables(valueMap);
			String content = this.templateEngine.process("email", context);
			helper.setText(content, true);

			// 添加附件
			if (valueMap.get("filePathList") != null) {
				String[] filePathList = (String[]) valueMap.get("filePathList");
				for (String tempPath : filePathList) {
					FileSystemResource fileSystemResource = new FileSystemResource(new File(tempPath));
					String fileName = tempPath.substring(tempPath.lastIndexOf(File.separator));
					helper.addAttachment(fileName, fileSystemResource);
				}
			}
			mailSender.send(mimeMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

}
