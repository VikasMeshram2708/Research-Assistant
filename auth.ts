/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "./app/env";
import { db } from "./db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const authRoutes = ["/login", "/register"];
export const adminRoute = ["/dashboard/admin(.*)"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          placeholder: "Email",
        },
        password: {
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) return null;

        let user = null;

        // if no email found throw error
        user = await db.query.usersTable.findFirst({
          where: (d, { eq }) => eq(d.email, credentials?.email as string),
        });

        if (!user) return null;

        //   compare the hash password
        const validPass = await bcrypt.compare(
          credentials?.password as string,
          user?.password
        );

        if (!validPass) return null;

        const { password: _, role, ...rest } = user;
        if (!role) return null;

        const userWithoutPassword = {
          ...rest,
          role: role as UserRole,
        };

        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth;
      const role = auth?.user?.role;

      const { pathname } = nextUrl;
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
      );

      const isAdminRoute = adminRoute.some((route) =>
        pathname.startsWith(route)
      );

      if (isLoggedIn) {
        if (isAuthRoute) {
          return NextResponse.redirect(new URL("/", nextUrl));
        }
        if (isAdminRoute && role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", nextUrl));
        }
      }

      // here the user is not logged in
      if (isAuthRoute) return true;

      return isLoggedIn;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});

type UserRole = "ADMIN" | "SUPER_ADMIN" | "MEMBER" | "MODERATOR";
declare module "next-auth" {
  interface User {
    role: UserRole;
  }
}
