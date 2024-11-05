package com.foodproject.fooddelivery.security;

import com.foodproject.fooddelivery.entity.Users;
import com.foodproject.fooddelivery.repository.UsersRepository;
import com.foodproject.fooddelivery.utils.JwtUtilHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class CustomJwtFilter extends OncePerRequestFilter {

    private final JwtUtilHelper jwtUtilHelper;
    private final UsersRepository usersRepository;

    public CustomJwtFilter(JwtUtilHelper jwtUtilHelper, UsersRepository usersRepository) {
        this.jwtUtilHelper = jwtUtilHelper;
        this.usersRepository = usersRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromHeader(request);
        if(token!=null){
            if(jwtUtilHelper.verifyToken(token)){
                String username = jwtUtilHelper.extractUsername(token);
                if(username!=null) {
                    Users users = usersRepository.findByUserName(username);
                    if(users!= null){
                        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + users.getRoles().getRoleName()));
                        Authentication authentication = new UsernamePasswordAuthenticationToken(
                                username,
                                users.getPassword(),
                                authorities);
                        SecurityContext securityContext = SecurityContextHolder.getContext();
                        securityContext.setAuthentication(authentication);
                    }
                }
            }
        }
        filterChain.doFilter(request,response);
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String token=null;
        if(StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            token = header.substring(7);
        }
        return token;
    }
}
