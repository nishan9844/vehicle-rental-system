const express = require('express');
const { getSupabaseAdmin, getUserFromAuthorization } = require('../lib/supabaseAdmin');

const router = express.Router();

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function normalizeName(name) {
    return String(name || '').trim().replace(/\s+/g, ' ');
}

function validateSignup({ fullName, email, password }) {
    const cleanName = normalizeName(fullName);
    const cleanEmail = normalizeEmail(email);

    if (cleanName.length < 2) {
        return { error: 'Please enter your full name.' };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { error: 'Please enter a valid email address.' };
    }

    if (String(password || '').length < 8) {
        return { error: 'Password must be at least 8 characters.' };
    }

    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        return { error: 'Password must include at least one letter and one number.' };
    }

    return { cleanName, cleanEmail };
}

async function upsertUserProfile(supabase, { userId, cleanName, cleanEmail }) {
    const now = new Date().toISOString();
    let profilePayload = {
        id: userId,
        name: cleanName,
        full_name: cleanName,
        email: cleanEmail,
        role: 'user',
        status: 'ACTIVE',
        verification: 'PENDING DOC',
        created_at: now,
        updated_at: now,
    };
    let profileError = null;

    for (let attempt = 0; attempt < 8; attempt += 1) {
        const result = await supabase
            .from('profiles')
            .upsert([profilePayload], { onConflict: 'id' });

        profileError = result.error;

        if (!profileError) break;

        const missingColumn = String(profileError.message || '').match(/'([^']+)' column/)?.[1];

        if (
            profileError.code === 'PGRST204' &&
            missingColumn &&
            profilePayload[missingColumn] !== undefined
        ) {
            const { [missingColumn]: _removed, ...nextPayload } = profilePayload;
            profilePayload = nextPayload;
            continue;
        }

        break;
    }

    if (profileError) throw profileError;
}

router.post('/signup', async (req, res) => {
    try {
        const validation = validateSignup(req.body || {});

        if (validation.error) {
            return res.status(400).json({
                success: false,
                message: validation.error,
            });
        }

        const supabase = getSupabaseAdmin();

        if (!supabase) {
            return res.status(500).json({
                success: false,
                message: 'Supabase admin credentials are missing on the backend.',
            });
        }

        const { cleanName, cleanEmail } = validation;
        const { password } = req.body;

        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', cleanEmail)
            .maybeSingle();

        if (existingProfile) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists. Please sign in instead.',
            });
        }

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: cleanEmail,
            password,
            email_confirm: true,
            user_metadata: {
                name: cleanName,
                role: 'user',
            },
        });

        if (authError) {
            return res.status(400).json({
                success: false,
                message: authError.message,
            });
        }

        const user = authData?.user;

        if (!user?.id) {
            return res.status(202).json({
                success: true,
                userId: null,
                needsEmailConfirmation: true,
                message: 'Signup request received. Please check your email.',
            });
        }

        try {
            await upsertUserProfile(supabase, {
                userId: user.id,
                cleanName,
                cleanEmail,
            });
        } catch (profileError) {
            return res.status(500).json({
                success: false,
                message: `Account was created, but profile creation failed: ${profileError.message}`,
            });
        }

        return res.status(201).json({
            success: true,
            userId: user.id,
            needsEmailConfirmation: false,
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Unable to create account.',
        });
    }
});

router.post('/signup/complete', async (req, res) => {
    try {
        const validation = validateSignup(req.body || {});

        if (validation.error) {
            return res.status(400).json({
                success: false,
                message: validation.error,
            });
        }

        const supabase = getSupabaseAdmin();

        if (!supabase) {
            return res.status(500).json({
                success: false,
                message: 'Supabase admin credentials are missing on the backend.',
            });
        }

        const { user, error: userError } = await getUserFromAuthorization(req);

        if (userError || !user) {
            return res.status(401).json({
                success: false,
                message: userError?.message || 'Please verify the email OTP first.',
            });
        }

        const { cleanName, cleanEmail } = validation;
        const { password } = req.body;
        const verifiedEmail = normalizeEmail(user.email);

        if (verifiedEmail !== cleanEmail) {
            return res.status(403).json({
                success: false,
                message: 'Verified email does not match this signup request.',
            });
        }

        const { data: existingProfile, error: profileLookupError } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('email', cleanEmail)
            .maybeSingle();

        if (profileLookupError) {
            return res.status(500).json({
                success: false,
                message: profileLookupError.message,
            });
        }

        if (existingProfile && existingProfile.id !== user.id) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists. Please sign in instead.',
            });
        }

        const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
            password,
            email_confirm: true,
            user_metadata: {
                name: cleanName,
                role: 'user',
            },
        });

        if (updateError) {
            return res.status(400).json({
                success: false,
                message: updateError.message,
            });
        }

        await upsertUserProfile(supabase, {
            userId: user.id,
            cleanName,
            cleanEmail,
        });

        return res.status(201).json({
            success: true,
            userId: user.id,
            message: 'Email verified and account created successfully.',
        });
    } catch (err) {
        console.error('Complete signup error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Unable to complete signup.',
        });
    }
});

module.exports = router;
