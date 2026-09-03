import { z } from 'zod';

export const signUpOTPSchema = z.object({
     otpCode: z
            .string()
            .length(6, "OTP must be exactly 6 digits")
            .regex(/^\d{6}$/, "OTP must contain only digits"),
})


export type SignUpOTPSchemaType = z.infer<typeof signUpOTPSchema>;
