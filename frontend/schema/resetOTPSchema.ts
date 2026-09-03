import { z } from 'zod';

export const resetOTPSchema = z.object({
     otpCode: z
            .string()
            .length(4, "OTP must be exactly 4 digits")
            .regex(/^\d{4}$/, "OTP must contain only digits"),
})


export type ResetOTPSchemaType = z.infer<typeof resetOTPSchema>;
