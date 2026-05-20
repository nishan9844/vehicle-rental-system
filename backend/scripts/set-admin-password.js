require('dotenv').config({ quiet: true });

const { getSupabaseAdmin } = require('../lib/supabaseAdmin');

function getArg(name) {
    const prefix = `--${name}=`;
    const match = process.argv.find((arg) => arg.startsWith(prefix));
    return match ? match.slice(prefix.length) : undefined;
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function normalizeName(name, email) {
    const clean = String(name || '').trim().replace(/\s+/g, ' ');
    if (clean) return clean;
    return email.split('@')[0] || 'Admin User';
}

async function findUserByEmail(supabase, email) {
    let page = 1;
    const perPage = 1000;

    while (true) {
        const { data, error } = await supabase.auth.admin.listUsers({
            page,
            perPage,
        });

        if (error) throw error;

        const user = data.users.find((item) => normalizeEmail(item.email) === email);
        if (user) return user;

        if (data.users.length < perPage) return null;
        page += 1;
    }
}

async function upsertAdminProfile(supabase, { id, email, name }) {
    const now = new Date().toISOString();
    let profile = {
        id,
        name,
        full_name: name,
        email,
        role: 'admin',
        status: 'ACTIVE',
        verification: 'LICENSED',
        created_at: now,
        updated_at: now,
    };
    let profileError = null;

    for (let attempt = 0; attempt < 8; attempt += 1) {
        const result = await supabase
            .from('profiles')
            .upsert([profile], { onConflict: 'id' });

        profileError = result.error;

        if (!profileError) return;

        const missingColumn = String(profileError.message || '').match(/'([^']+)' column/)?.[1];

        if (
            profileError.code === 'PGRST204' &&
            missingColumn &&
            profile[missingColumn] !== undefined
        ) {
            const { [missingColumn]: _removed, ...nextProfile } = profile;
            profile = nextProfile;
            continue;
        }

        break;
    }

    if (profileError) throw profileError;
}

async function main() {
    const email = normalizeEmail(getArg('email') || process.env.ADMIN_EMAIL);
    const password = getArg('password') || process.env.ADMIN_PASSWORD;
    const name = normalizeName(getArg('name') || process.env.ADMIN_NAME, email);

    if (!email) {
        throw new Error('Missing admin email. Set ADMIN_EMAIL or pass --email=admin@example.com.');
    }

    if (!password || password.length < 6) {
        throw new Error('Missing admin password. Set ADMIN_PASSWORD or pass --password=your-password. Minimum length is 6.');
    }

    const supabase = getSupabaseAdmin();

    if (!supabase) {
        throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in backend/.env.');
    }

    const existingUser = await findUserByEmail(supabase, email);
    let user = existingUser;

    if (existingUser) {
        const { data, error } = await supabase.auth.admin.updateUserById(existingUser.id, {
            password,
            email_confirm: true,
            user_metadata: {
                ...(existingUser.user_metadata || {}),
                name,
                role: 'admin',
            },
        });

        if (error) throw error;
        user = data.user;
    } else {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name,
                role: 'admin',
            },
        });

        if (error) throw error;
        user = data.user;
    }

    await upsertAdminProfile(supabase, {
        id: user.id,
        email,
        name,
    });

    console.log(existingUser ? 'Admin password updated successfully.' : 'Admin user created successfully.');
    console.log(`Admin email: ${email}`);
}

main().catch((error) => {
    console.error(error.message || error);
    process.exit(1);
});
