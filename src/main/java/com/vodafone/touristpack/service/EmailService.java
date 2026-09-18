package com.vodafone.touristpack.service;

import com.vodafone.touristpack.config.MailSendingProperties;
import com.vodafone.touristpack.entity.ActivePackage;
import com.vodafone.touristpack.entity.Order;
import com.vodafone.touristpack.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Sends the purchase-confirmation email with the inline QR code.
 *
 * FLAGGED: no email provider is configured anywhere in the project (see
 * application.yml's spring.mail.* placeholders). While mail-sending.mock-
 * enabled=true (the default), this logs the email instead of sending it, so
 * local dev/tests don't need real SMTP credentials. Provide real SMTP/API
 * credentials and flip the flag before relying on this in production.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private static final String QR_CONTENT_ID = "qrcode";

    private final JavaMailSender mailSender;
    private final QrCodeService qrCodeService;
    private final MessageSource emailMessageSource;
    private final MailSendingProperties mailSendingProperties;

    public void sendActivationEmail(ActivePackage activePackage) {
        Order order = activePackage.getOrder();
        User user = order.getUser();
        Locale locale = Locale.forLanguageTag(
                user.getPreferredLocale() == null ? "en" : user.getPreferredLocale());

        String subject = msg("email.subject", locale);
        String html = buildHtml(activePackage, order, user, locale);

        if (mailSendingProperties.isMockEnabled()) {
            log.info(
                    "[mail-sending.mock-enabled=true] Would send activation email to {} (subject: \"{}\"). "
                            + "Set real SMTP credentials and disable the flag to actually send.",
                    user.getEmail(), subject);
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(html, true);
            helper.addInline(QR_CONTENT_ID, () -> new java.io.ByteArrayInputStream(
                    qrCodeService.generatePng(activePackage.getRedemptionToken())), "image/png");
            mailSender.send(mimeMessage);
            log.info("Sent activation email to {}", user.getEmail());
        } catch (MessagingException e) {
            // Deliberately not rethrown as a fatal error: the order is already
            // PAID and the ActivePackage/token already exist, so the customer
            // can still be helped manually. A real integration should push
            // this to a retry queue / alerting instead of only logging.
            log.error("Failed to send activation email to {}", user.getEmail(), e);
        }
    }

    private String buildHtml(ActivePackage activePackage, Order order, User user, Locale locale) {
        String greeting = msg("email.greeting", locale, user.getFirstName());
        String summaryIntro = msg("email.summaryIntro", locale);
        String packageLabel = msg("email.packageLabel", locale);
        String priceLabel = msg("email.priceLabel", locale);
        String durationLabel = msg("email.durationLabel", locale);
        String durationValue = msg("email.durationValue", locale, order.getTravelPackage().getDurationDays());
        String scanInstructions = msg("email.scanInstructions", locale);
        String footer = msg("email.footer", locale);

        return """
                <html>
                  <body style="font-family: Arial, sans-serif; color: #1a1a1a;">
                    <p>%s</p>
                    <p>%s</p>
                    <table style="border-collapse: collapse;">
                      <tr><td style="padding: 4px 12px 4px 0; color: #666;">%s</td><td><strong>%s</strong></td></tr>
                      <tr><td style="padding: 4px 12px 4px 0; color: #666;">%s</td><td><strong>%s %s</strong></td></tr>
                      <tr><td style="padding: 4px 12px 4px 0; color: #666;">%s</td><td><strong>%s</strong></td></tr>
                    </table>
                    <p style="margin-top: 24px;">%s</p>
                    <img src="cid:%s" alt="QR code" width="240" height="240" />
                    <p style="margin-top: 24px; color: #888; font-size: 12px;">%s</p>
                  </body>
                </html>
                """
                .formatted(
                        greeting,
                        summaryIntro,
                        packageLabel, order.getTravelPackage().getName(),
                        priceLabel, order.getAmount().toPlainString(), order.getCurrency(),
                        durationLabel, durationValue,
                        scanInstructions,
                        QR_CONTENT_ID,
                        footer);
    }

    private String msg(String key, Locale locale, Object... args) {
        return emailMessageSource.getMessage(key, args, locale);
    }
}
