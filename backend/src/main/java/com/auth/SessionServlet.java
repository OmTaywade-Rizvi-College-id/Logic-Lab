
package com.auth;

import com.google.gson.JsonObject;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/api/auth/me")
public class SessionServlet extends HttpServlet {

    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);

        if (session == null
                || session.getAttribute("googleId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(
                "{\"authenticated\":false}"
            );
            return;
        }

        JsonObject user = new JsonObject();
        user.addProperty("authenticated", true);
        user.addProperty(
            "email",
            (String) session.getAttribute("email")
        );
        user.addProperty(
            "name",
            (String) session.getAttribute("name")
        );

        response.getWriter().write(user.toString());
    }
}