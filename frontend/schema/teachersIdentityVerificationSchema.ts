import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export const teachersIdentityVerificationSchema = z.object({
    fullName: z.string()
        .nonempty({message: 'Field must not be empty'})
        .min(2, {message: 'Minimum number of characters must be 2'})
        .max(70, {message: 'Maximum number of characters must be 70'}),
    phoneNumber: z.string()
        .refine(isValidPhoneNumber, {message: 'Phone number is invalid'}),
    state: z.string()
        .nonempty()
        .min(2, {message: 'Minimum number of characters must be 2'})
        .max(70, {message: 'Maximum number of characters must be 70'}),
    city: z.string()
        .nonempty()
        .min(2, {message: 'Minimum number of characters must be 2'})
        .max(70, {message: 'Maximum number of characters must be 70'})
});