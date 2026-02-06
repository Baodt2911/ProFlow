// app/lib/session.server.ts
import { createCookieSessionStorage } from "react-router";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: process.env.SESSION_NAME,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET!],
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
