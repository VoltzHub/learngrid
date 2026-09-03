import { z } from "zod";

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, {
                message: "Your password must be a minimum of 8 characters",
            })
            .max(70, {
                message: "Your password must not be above 70 characters",
            }),
        passwordConfirm: z
            .string()
            .nonempty({ message: "Your password must not be empty" }),
        otpCode: z
            .string()
            .length(4, "OTP must be exactly 4 digits")
            .regex(/^\d{4}$/, "OTP must contain only digits"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
