"use server";

import { db } from "@/db";
import { loginSchema, registerSchema } from "./auth-schema";
import bcrypt from "bcryptjs";
import { usersTable } from "@/db/schema";
import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function newUser(prevState: unknown, formData: FormData) {
  // sanitize
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  // console.log("raw", raw);
  const parsed = registerSchema.safeParse(raw);
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
export async function logUser(prevState: unknown, formData: FormData) {
  try {
    const raw = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };
    // sanitize
    const parsed = loginSchema.safeParse(raw);
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
    // console.log("log-res", res);
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
      // console.log("auth-error", error);
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
