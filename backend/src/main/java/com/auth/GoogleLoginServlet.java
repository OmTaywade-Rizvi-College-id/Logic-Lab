
package com.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.Collections;

@WebServlet("/api/auth/google")
public class GoogleLoginServlet extends HttpServlet {

    private GoogleIdTokenVerifier verifier;

    @Override
    public void init() {
        String clientId = System.getenv("GOOGLE_CLIENT_ID");

        if (clientId == null || clientId.isBlank()) {
            throw new IllegalStateException(
                "GOOGLE_CLIENT_ID environment variable is missing"
            );
        }

        verifier = new GoogleIdTokenVerifier.Builder(
            new NetHttpTransport(),
            GsonFactory.getDefaultInstance()
        )
            .setAudience(Collections.singletonList(clientId))
            .build();
    }

    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            JsonObject body = JsonParser.parseReader(
                request.getReader()
            ).getAsJsonObject();

            String credential = body.has("credential")
                ? body.get("credential").getAsString()
                : "";

            if (credential.isBlank()) {
                response.sendError(
                    HttpServletResponse.SC_BAD_REQUEST,
                    "Missing Google credential"
                );
                return;
            }

            GoogleIdToken token = verifier.verify(credential);

            if (token == null) {
                response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid Google ID token"
                );
                return;
            }

            GoogleIdToken.Payload payload = token.getPayload();

            String googleId = payload.getSubject();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            Boolean emailVerified = payload.getEmailVerified();

            if (googleId == null || email == null
                    || !Boolean.TRUE.equals(emailVerified)) {
                response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Google account verification failed"
                );
                return;
            }

            HttpSession oldSession = request.getSession(false);

            if (oldSession != null) {
                oldSession.invalidate();
            }

            HttpSession session = request.getSession(true);
            session.setMaxInactiveInterval(30 * 60);

            session.setAttribute("googleId", googleId);
            session.setAttribute("email", email);
            session.setAttribute(
                "name",
                name == null ? "" : name
            );

            JsonObject result = new JsonObject();
            result.addProperty("authenticated", true);
            result.addProperty("email", email);
            result.addProperty("name", name == null ? "" : name);

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(result.toString());

        } catch (IllegalStateException exception) {
            response.sendError(
                HttpServletResponse.SC_BAD_REQUEST,
                "Invalid request body"
            );
        } catch (Exception exception) {
            getServletContext().log(
                "Google login verification failed", exception
            );

            response.sendError(
                HttpServletResponse.SC_UNAUTHORIZED,
                "Google login failed"
            );
        }
    }
}