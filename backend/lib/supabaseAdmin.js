const { createClient } = require('@supabase/supabase-js');

let adminClient;

function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

function getBearerToken(req) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

async function getUserFromAuthorization(req) {
  const supabase = getSupabaseAdmin();
  const token = getBearerToken(req);

  if (!supabase) {
    return {
      user: null,
      error: new Error('Supabase admin credentials are missing on the backend.'),
    };
  }

  if (!token) {
    return {
      user: null,
      error: new Error('Missing bearer token.'),
    };
  }

  const { data, error } = await supabase.auth.getUser(token);

  return {
    user: data?.user || null,
    error,
  };
}

async function getUserRole(supabase, userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;

  return String(data?.role || 'user').toLowerCase();
}

async function requireAdmin(req, res, next) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: 'Supabase admin credentials are missing on the backend.',
      });
    }

    const { user, error } = await getUserFromAuthorization(req);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: error?.message || 'Authentication is required.',
      });
    }

    const role = await getUserRole(supabase, user.id);

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access is required.',
      });
    }

    req.user = user;
    req.supabaseAdmin = supabase;
    return next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to verify admin access.',
    });
  }
}

module.exports = {
  getSupabaseAdmin,
  getUserFromAuthorization,
  getUserRole,
  requireAdmin,
};
