"use server";

import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().max(200).optional(),
});

export async function login(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid email or password" };
  }

  const { email, password } = parsed.data;

  const user = await db.query.profiles.findFirst({
    where: eq(profiles.email, email),
  });

  if (!user || !user.passwordHash) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  await setSessionCookie({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });

  redirect("/");
}

export async function signup(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { email, password, fullName } = parsed.data;

  // Check if email already exists
  const existing = await db.query.profiles.findFirst({
    where: eq(profiles.email, email),
  });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(password);

  const [newUser] = await db
    .insert(profiles)
    .values({
      email,
      passwordHash,
      fullName: fullName || null,
      role: "user",
    })
    .returning();

  await setSessionCookie({
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role,
  });

  redirect("/");
}

export async function logout() {
  await clearSessionCookie();
  redirect("/");
}
