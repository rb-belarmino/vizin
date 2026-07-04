"use server";

import { RegisterSchema, LoginSchema, RegisterSchemaType, LoginSchemaType } from "./schemas/auth-schema";
import { ResidentRepository } from "../infrastructure/database/resident-repository";
import bcrypt from "bcryptjs";
import { signIn } from "../infrastructure/auth/auth";
import { AuthError } from "next-auth";

export async function registerAction(data: RegisterSchemaType) {
  const repository = new ResidentRepository();
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid data" };
  }

  const { email, password, fullName, apartmentId } = parsed.data;

  try {
    const existingUser = await repository.findResidentByEmail(email);
    if (existingUser) {
      return { error: "Email already in use." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await repository.createResident({
      email,
      fullName,
      apartmentId,
      passwordHash,
    });

    return { success: "User registered successfully!" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong during registration." };
  }
}

export async function loginAction(data: LoginSchemaType) {
  const repository = new ResidentRepository();
  const parsed = LoginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid credentials" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: "Logged in successfully!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}
