
package com.logiclab.auth;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Set;

@WebFilter(urlPatterns = "/api/*")
public class CorsFilter implements Filter {

    private static final Set<String> ALLOWED_ORIGINS = Set.of(
        "http://localhost:5173",
        "https://logic-lab-iota.vercel.app"
    );

    @Override
    public void doFilter(
        ServletRequest req,
        ServletResponse res,
        FilterChain chain
    ) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String origin = request.getHeader("Origin");

        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type, X-CSRF-Token"
            );
            response.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
            );
            response.setHeader("Vary", "Origin");
        }

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        chain.doFilter(req, res);
    }
}