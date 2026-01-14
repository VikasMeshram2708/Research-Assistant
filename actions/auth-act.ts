"use server";

import { db } from "@/db";
import { loginSchema, registerSchema } from "./auth-schema";
import bcrypt from "bcryptjs";
import { usersTable } from "@/db/schema";
import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { eq } from "drizzle-orm";

export async function newUser(data: unknown) {
  // sanitize
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid payload",
      //   errors: parsed.error.flatten().fieldErrors,
      errors: z.prettifyError(parsed.error),
    };
  }
  const { name, email, password } = parsed.data;

  try {
    //   check user exists
    const dbUser = await db.query.usersTable.findFirst({
      where: (d, { eq }) => eq(d.email, email),
    });

    if (dbUser) {
      // throw error
      return {
        success: false,
        message: "User already exists",
      };
    }

    //   hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // save to db
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    // send mail feedback
    // respond
    return {
      success: true,
      message: "Registered",
      metadata: {
        newUser,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong.",
      errors: (error as Error).message,
    };
  }
}

// custom sign in
export async function logUser(data: unknown) {
  try {
    // sanitize
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        message: "Invalid payload",
        //   errors: parsed.error.flatten().fieldErrors,
        errors: z.prettifyError(parsed.error),
      };
    }
    const { email, password } = parsed.data;
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      return {
        success: false,
        message: "Invalid credentials",
        errors: res?.error,
      };
    }
    console.log("log-res", res);
    // update the last login timestamp
    await db.update(usersTable).set({
      lastLogin: new Date().toLocaleDateString(),
    });
    return {
      success: true,
      message: "Success",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("auth-error", error);
      return {
        success: false,
        message: "Authentication failed",
        errors: `Error: ${error.type}`,
      };
    }
    return {
      success: false,
      message: "Something went wrong.",
      errors: (error as Error).message,
    };
  }
}
