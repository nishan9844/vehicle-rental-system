import { supabase } from "../supabaseClient";

export const signUpUser = async ({ fullName, email, password }) => {
    // Step 1: Create Auth User
    const { data: userData, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        throw new Error(error.message);
    }

    // Step 2: Insert into profiles table
    const { error: profileError } = await supabase
        .from("profiles")
        .insert([
            {
                id: userData.user.id,
                full_name: fullName,
                email: email
            }
        ]);

    if (profileError) {
        throw new Error(profileError.message);
    }

    return userData;
};