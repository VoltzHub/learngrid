import { z } from "zod";
import { isValidEmail } from "@/lib/utils";

const emailVerificationSchema = z
    .email({ message: "Please enter a valid email address" })
    .superRefine(async (email, ctx) => {
        const isAvailable = await isValidEmail(email);
        if (!isAvailable) {
            ctx.addIssue({
                code: "custom",
                message: "Email is not valid",
            });
            return;
        }

        if (email.includes("+")) {
            ctx.addIssue({
                code: "custom",
                message: "Email can not have a '+' symbol",
            });
        }

        const domain = email.split("@")[1];

        if (domain) {
            const isSubDomainEmail = domain.split(".").length > 2;

            if (isSubDomainEmail) {
                ctx.addIssue({
                    code: "custom",
                    message: "Email should not be a subdomain email",
                });
            }
        }
    });

export const resetEmailSchema = z
    .object({
        email: emailVerificationSchema,
    })

export type ResetEmailSchemaType = z.infer<typeof resetEmailSchema>;
