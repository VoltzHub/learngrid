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

export const loginFormSchema = z
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
        rememberMe: z.boolean().optional(),
    });

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>;
