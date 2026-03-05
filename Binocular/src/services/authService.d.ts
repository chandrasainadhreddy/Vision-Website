export declare const registerUser: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    confirm_password: string;
}) => Promise<{ status: boolean; message: string }>;

export declare const loginUser: (data: {
    email: string;
    password: string;
}) => Promise<{ status: boolean; message?: string; token?: string; user?: Record<string, any> }>;

export declare const forgotPassword: (
    email: string
) => Promise<{ status: boolean; message: string }>;

export declare const getProfile: (
    user_id: string | number
) => Promise<{ status: boolean; user?: { id: number; name: string; email: string; phone: string } }>;

export declare const updateProfile: (data: {
    user_id: string | number;
    name: string;
    email: string;
    phone: string;
}) => Promise<{ status: boolean; message: string }>;
