const express = require('express');
const { requireAdmin } = require('../lib/supabaseAdmin');

const router = express.Router();

router.use(requireAdmin);

const BOOKING_SELECT = `
  *,
  vehicles (name, image_url)
`;

const PAYMENT_SELECT = `
  *,
  bookings (
    id,
    full_name,
    email,
    total_price,
    pickup_date,
    return_date,
    vehicle_id,
    vehicles (name, image_url)
  )
`;

const VEHICLE_COLUMNS = [
  'name',
  'brand',
  'vehicle_type',
  'fuel_type',
  'category',
  'transmission',
  'seats',
  'price_per_day',
  'status',
  'image_url',
  'description',
  'is_published',
  'security_deposit',
];

async function selectWithFallback(queryFactory, columns) {
  const rich = await queryFactory(columns);

  if (!rich.error) {
    return rich;
  }

  return queryFactory('*');
}

async function writeWithColumnFallback(queryFactory, payload) {
  let nextPayload = { ...payload };
  let lastError = null;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const result = await queryFactory(nextPayload);
    lastError = result.error;

    if (!lastError) {
      return result;
    }

    const missingColumn = String(lastError.message || '').match(/'([^']+)' column/)?.[1];

    if (lastError.code === 'PGRST204' && missingColumn && nextPayload[missingColumn] !== undefined) {
      const { [missingColumn]: _removed, ...rest } = nextPayload;
      nextPayload = rest;
      continue;
    }

    break;
  }

  return { data: null, error: lastError };
}

function sanitizeStatus(value, allowed, fallback) {
  const normalized = String(value || fallback).trim().toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeVehiclePayload(body = {}) {
  const source = {
    ...body,
    image_url: body.image_url || body.image,
    category: body.category || body.vehicle_type,
    status: body.status || (body.available === false ? 'RENTED' : 'AVAILABLE'),
  };

  return VEHICLE_COLUMNS.reduce((payload, column) => {
    const value = source[column];

    if (value === undefined) return payload;

    if (['seats', 'price_per_day', 'security_deposit'].includes(column)) {
      payload[column] = value === '' || value === null ? null : Number(value);
      return payload;
    }

    if (column === 'is_published') {
      payload[column] = value !== false;
      return payload;
    }

    payload[column] = typeof value === 'string' ? value.trim() : value;
    return payload;
  }, {});
}

router.get('/bookings', async (req, res) => {
  try {
    const { data, error } = await selectWithFallback((columns) =>
      req.supabaseAdmin
        .from('bookings')
        .select(columns)
        .order('created_at', { ascending: false }), BOOKING_SELECT);

    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to load bookings.',
    });
  }
});

router.post('/bookings', async (req, res) => {
  try {
    const body = req.body || {};
    const fullName = String(body.full_name || body.customer_name || '').trim();
    const email = String(body.email || body.customer_email || '').trim().toLowerCase();
    const pickupDate = body.pickup_date || body.start_date;
    const returnDate = body.return_date || body.end_date;
    const totalPrice = Number(body.total_price || 0);

    if (!fullName || !email || !pickupDate || !returnDate || !Number.isFinite(totalPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, pickup date, return date, and total price are required.',
      });
    }

    const payload = {
      user_id: body.user_id || null,
      vehicle_id: body.vehicle_id || null,
      full_name: fullName,
      email,
      phone: body.phone || '',
      license_id: body.license_id || '',
      documentation: body.documentation || '',
      pickup_date: pickupDate,
      return_date: returnDate,
      subtotal: Number(body.subtotal || totalPrice),
      taxes: Number(body.taxes || 0),
      deposit: Number(body.deposit || 0),
      total_price: totalPrice,
      status: sanitizeStatus(body.status, ['pending', 'confirmed', 'active', 'completed', 'cancelled'], 'confirmed'),
      payment_status: sanitizeStatus(body.payment_status, ['unpaid', 'pending', 'paid', 'refunded'], 'unpaid'),
      notes: body.notes || '',
    };

    const { data, error } = await req.supabaseAdmin
      .from('bookings')
      .insert([payload])
      .select(BOOKING_SELECT)
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to create booking.',
    });
  }
});

router.patch('/bookings/:id', async (req, res) => {
  try {
    const allowedStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
    const update = {};

    if (req.body.status !== undefined) {
      update.status = sanitizeStatus(req.body.status, allowedStatuses, 'pending');
    }

    if (req.body.payment_status !== undefined) {
      update.payment_status = sanitizeStatus(req.body.payment_status, ['unpaid', 'pending', 'paid', 'refunded'], 'unpaid');
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No allowed booking fields were provided.',
      });
    }

    update.updated_at = new Date().toISOString();

    const { data, error } = await selectWithFallback((columns) =>
      req.supabaseAdmin
        .from('bookings')
        .update(update)
        .eq('id', req.params.id)
        .select(columns)
        .single(), BOOKING_SELECT);

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to update booking.',
    });
  }
});

router.delete('/bookings/:id', async (req, res) => {
  try {
    const { error } = await req.supabaseAdmin
      .from('bookings')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to delete booking.',
    });
  }
});

router.get('/payments', async (req, res) => {
  try {
    const { data: paymentRows, error } = await selectWithFallback((columns) =>
      req.supabaseAdmin
        .from('payments')
        .select(columns)
        .order('created_at', { ascending: false }), PAYMENT_SELECT);

    if (error) throw error;

    const payments = paymentRows || [];
    const paymentBookingIds = new Set(
      payments
        .map((payment) => payment.booking_id)
        .filter(Boolean)
        .map(String)
    );

    const { data: paidBookings, error: paidBookingsError } = await selectWithFallback((columns) =>
      req.supabaseAdmin
        .from('bookings')
        .select(columns)
        .or('payment_status.eq.paid,status.in.(confirmed,active,completed)')
        .order('created_at', { ascending: false }), BOOKING_SELECT);

    if (paidBookingsError) throw paidBookingsError;

    const recoveredPayments = (paidBookings || [])
      .filter((booking) => !paymentBookingIds.has(String(booking.id)))
      .map((booking) => ({
        id: `booking-${booking.id}`,
        synthetic: true,
        payment_code: `BOOKING-${String(booking.id).slice(0, 8)}`,
        booking_id: booking.id,
        customer_name: booking.full_name || 'Customer',
        customer_email: booking.email || '',
        method: booking.payment_method || booking.method || 'khalti',
        amount: Number(booking.total_price || 0),
        status: 'paid',
        transaction_id: '',
        paid_at: booking.updated_at || booking.created_at,
        created_at: booking.created_at,
        bookings: booking,
      }));

    return res.json({
      success: true,
      data: [...payments, ...recoveredPayments].sort((a, b) =>
        new Date(b.paid_at || b.created_at || 0) - new Date(a.paid_at || a.created_at || 0)
      ),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to load payments.',
    });
  }
});

router.patch('/payments/:id', async (req, res) => {
  try {
    const update = {};

    if (req.body.status !== undefined) {
      update.status = sanitizeStatus(req.body.status, ['pending', 'paid', 'failed', 'refunded'], 'pending');
      if (update.status === 'paid') {
        update.paid_at = new Date().toISOString();
      }
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No allowed payment fields were provided.',
      });
    }

    update.updated_at = new Date().toISOString();

    const { data, error } = await selectWithFallback((columns) =>
      req.supabaseAdmin
        .from('payments')
        .update(update)
        .eq('id', req.params.id)
        .select(columns)
        .single(), PAYMENT_SELECT);

    if (error) throw error;

    if (data?.booking_id && update.status) {
      const bookingUpdate = {
        payment_status: update.status === 'paid' ? 'paid' : update.status,
        updated_at: new Date().toISOString(),
      };

      if (update.status === 'paid') {
        bookingUpdate.status = 'confirmed';
      }

      await req.supabaseAdmin
        .from('bookings')
        .update(bookingUpdate)
        .eq('id', data.booking_id);
    }

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to update payment.',
    });
  }
});

router.delete('/payments/:id', async (req, res) => {
  try {
    const { error } = await req.supabaseAdmin
      .from('payments')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to delete payment.',
    });
  }
});

router.get('/vehicles', async (req, res) => {
  try {
    const { data, error } = await req.supabaseAdmin
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ success: true, data: data || [] });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to load vehicles.',
    });
  }
});

router.get('/vehicles/:id', async (req, res) => {
  try {
    const { data, error } = await req.supabaseAdmin
      .from('vehicles')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to load vehicle.',
    });
  }
});

router.post('/vehicles', async (req, res) => {
  try {
    const payload = normalizeVehiclePayload(req.body);

    if (!payload.name || !payload.brand || payload.price_per_day === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle name, brand, and price per day are required.',
      });
    }

    const { data, error } = await writeWithColumnFallback((nextPayload) =>
      req.supabaseAdmin
        .from('vehicles')
        .insert([nextPayload])
        .select()
        .single(), payload);

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to add vehicle.',
    });
  }
});

router.patch('/vehicles/:id', async (req, res) => {
  try {
    const payload = {
      ...normalizeVehiclePayload(req.body),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await writeWithColumnFallback((nextPayload) =>
      req.supabaseAdmin
        .from('vehicles')
        .update(nextPayload)
        .eq('id', req.params.id)
        .select()
        .single(), payload);

    if (error) throw error;

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to update vehicle.',
    });
  }
});

router.delete('/vehicles/:id', async (req, res) => {
  try {
    const { error } = await req.supabaseAdmin
      .from('vehicles')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Unable to delete vehicle.',
    });
  }
});

module.exports = router;
