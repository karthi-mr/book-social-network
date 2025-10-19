package com.projects.book.security;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Service;

@Service
public class JwtAuthFilter extends UsernamePasswordAuthenticationFilter {
}
