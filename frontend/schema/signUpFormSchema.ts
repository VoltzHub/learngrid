import { z } from "zod";
import { isValidEmail } from "@/lib/utils";

const emailVerificationSchema = z.email().superRefine(async (email, ctx) => {
    const isAvailable = await isValidEmail(email);
    if (!isAvailable) {
        ctx.addIssue({
            code: "custom",
            message: "Email is not valid",
        });
    }

    if (email) {
        const hasAddSign = email.includes("+");
        if (hasAddSign) {
            ctx.addIssue({
                code: "custom",
                message: "Email can not have a '+' symbol",
            });
        }
    }

    const subDomainEmail = email.split("@")[1].split(".").length > 2;

    if (subDomainEmail) {
        ctx.addIssue({
            code: "custom",
            message: "Email should not be a subdomain email",
        });
    }
});

export const signUpFormSchema = z
    .object({
        email: emailVerificationSchema,
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
            .length(6, "OTP must be exactly 6 digits")
            .regex(/^\d{6}$/, "OTP must contain only digits"),
        })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });

export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>;
