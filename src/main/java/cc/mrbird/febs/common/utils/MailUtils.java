package cc.mrbird.febs.common.utils;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class MailUtils {
	private static JavaMailSender mailSender;

	public MailUtils(JavaMailSender mailSender) {
		MailUtils.mailSender = mailSender;
	}

	/**
	 * 发送简单文字email
	 * 
	 * @param from    谁发出
	 * @param to      发送给谁，多人用‘;’分割邮箱
	 * @param subject 主题
	 * @param text    内容
	 * @return
	 */
	public static void SimpleEmail(String from, String to, String subject, String text) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(from);

		if (to.contains(";")) {
			String[] addresses = to.split(";");
			message.setTo(addresses);
		} else {
			message.setTo(to);
		}

		message.setSubject(subject);
		message.setText(text);
		mailSender.send(message);
	}
	
	public static void fileEmail(String from, String to, String subject, String text, String... filePaths) throws Exception {
		MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "utf-8");
        mimeMessageHelper.setFrom(from);
        mimeMessageHelper.setTo(to);
        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(text);
        
        MimeMultipart multipart = new MimeMultipart();
        BodyPart contentPart = new MimeBodyPart();
        contentPart.setContent(text, "text/html;charset=UTF-8");
        multipart.addBodyPart(contentPart);
        
        for (String filePath : filePaths) {
            MimeBodyPart part = new MimeBodyPart();
            FileDataSource fds = new FileDataSource(filePath);
            part.setFileName(MimeUtility.encodeWord(fds.getName()));// MimeUtility.encodeWord文件名解决中文乱码
            part.setDataHandler(new DataHandler(fds));
            multipart.addBodyPart(part);
        }
        mimeMessage.setContent(multipart);
        mailSender.send(mimeMessage);//发送
	}

	// 更多的从MailTest参照，适当调整
}
