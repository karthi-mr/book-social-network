package com.projects.book.auth;

import com.projects.book.email.EmailService;
import com.projects.book.role.Role;
import com.projects.book.role.RoleRepository;
import com.projects.book.security.JwtService;
import com.projects.book.user.Token;
import com.projects.book.user.TokenRepository;
import com.projects.book.user.User;
import com.projects.book.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

import static com.projects.book.email.EmailTemplateName.ACTIVATE_ACCOUNT;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${application.security.activation-code-length}")
    private int activationCodeLength;
    @Value("${application.security.mailing.frontend.activation-url}")
    private String activationUrl;

    public void register(RegistrationRequest request) throws MessagingException {
        Role userRole = this.roleRepository.findByName("USER")
                // TODO: better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initialized"));
        User user = User.builder()
                .firstname(request.firstname())
                .lastname(request.lastname())
                .email(request.email())
                .password(this.passwordEncoder.encode(request.password()))
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(userRole))
                .build();
        this.userRepository.save(user);
        sendValidationEmail(user);
    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        this.emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );

    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode();
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        this.tokenRepository.save(token);
        return token.getToken();

    }

    private String generateActivationCode() {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < this.activationCodeLength; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }

    public AuthenticationResponse authenticate(@Valid AuthenticationRequest authRequest) {
        var auth = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.email(),
                        authRequest.password()
                )
        );

        var claims = new HashMap<String, Object>();
        var user = (User) auth.getPrincipal();
        claims.put("fullName", user.fullName());
        var jwtToken = this.jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    // @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = this.tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            this.sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token expired. New token has been sent");
        }

        var user = this.userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
        user.setEnabled(true);
        this.userRepository.save(user);
        savedToken.setValidatedAt(LocalDateTime.now());
        this.tokenRepository.save(savedToken);
    }
}
