package com.dh.canchas365.service.mail;

import com.dh.canchas365.dto.auth.UsuarioDto;
import com.dh.canchas365.exceptions.CustomFieldException;
import com.dh.canchas365.model.auth.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService extends CustomFieldException implements IEmailService{

    @Value("${email.sender}")
    private String emailSender;

    @Value("${app.url}")
    private String appUrl;

    @Autowired
    private JavaMailSender mailSender;
    @Override
    public ResponseEntity<?> sendEmail(String toUser, String subject, String message) {
        try {
            var mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(emailSender);
            mailMessage.setTo(toUser);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);

            mailSender.send(mailMessage);

            return ResponseEntity.status(HttpStatus.OK).body("Correo electrónico enviado con éxito");

        } catch (Exception ex) {
            return customResponseError(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String buildMessage(Usuario usuario) {
        return String.format(
                "Hola %s %s su cuenta ha sido asociada al mail %s ha sido creada de forma exitosa, para ir al login por favor haga click en el siguiente enlace %s",
                usuario.getName(), usuario.getLastname(), usuario.getUsername(), appUrl
        );
    }

}
