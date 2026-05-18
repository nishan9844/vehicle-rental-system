const STORAGE_KEY = "vental_admin_data";
const DEMO_SESSION_KEY = "vental_demo_admin";

const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const nextWeek = new Date(now);
nextWeek.setDate(now.getDate() + 7);

const seedData = {
  vehicles: [
    {
      id: 1,
      name: "Hyundai Creta",
      brand: "Hyundai",
      type: "Petrol",
      category: "SUV",
      seats: 5,
      price: 6500,
      status: "AVAILABLE",
      image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=900&h=600&fit=crop",
      created_at: now.toISOString(),
    },
    {
      id: 2,
      name: "Honda Dio",
      brand: "Honda",
      type: "Petrol",
      category: "Bike",
      seats: 2,
      price: 1200,
      status: "IN RENTAL",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&h=600&fit=crop",
      created_at: now.toISOString(),
    },
    {
      id: 3,
      name: "Tata Nexon EV",
      brand: "Tata",
      type: "Electric",
      category: "EV",
      seats: 5,
      price: 7200,
      status: "MAINTENANCE",
      image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&h=600&fit=crop",
      created_at: now.toISOString(),
    },
  ],
  customers: [
    {
      id: 1,
      name: "Aarav Sharma",
      email: "aarav@example.com",
      phone: "+977 9841000001",
      address: "Kathmandu",
      license_number: "NP-01-554321",
      verification: "verified",
      status: "active",
      bookings: 3,
      revenue: 24500,
      created_at: now.toISOString(),
    },
    {
      id: 2,
      name: "Mira Gurung",
      email: "mira@example.com",
      phone: "+977 9841000002",
      address: "Pokhara",
      license_number: "NP-02-774411",
      verification: "pending_doc",
      status: "active",
      bookings: 1,
      revenue: 6500,
      created_at: now.toISOString(),
    },
  ],
  bookings: [
    {
      id: 1,
      booking_code: "BK-1001",
      customer_id: 1,
      customer_name: "Aarav Sharma",
      customer_email: "aarav@example.com",
      customer_phone: "+977 9841000001",
      vehicle_id: 2,
      vehicle_name: "Honda Dio",
      vehicle_image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&h=600&fit=crop",
      pickup_date: now.toISOString(),
      return_date: tomorrow.toISOString(),
      amount: 1200,
      subtotal: 1200,
      status: "active",
      payment_status: "paid",
      notes: "Helmet included.",
      created_at: now.toISOString(),
    },
    {
      id: 2,
      booking_code: "BK-1002",
      customer_id: 2,
      customer_name: "Mira Gurung",
      customer_email: "mira@example.com",
      customer_phone: "+977 9841000002",
      vehicle_id: 1,
      vehicle_name: "Hyundai Creta",
      vehicle_image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=900&h=600&fit=crop",
      pickup_date: tomorrow.toISOString(),
      return_date: nextWeek.toISOString(),
      amount: 39000,
      subtotal: 39000,
      status: "pending",
      payment_status: "pending",
      notes: "Airport pickup requested.",
      created_at: now.toISOString(),
    },
  ],
  payments: [
    {
      id: 1,
      payment_code: "PAY-1001",
      booking_id: 1,
      customer_name: "Aarav Sharma",
      customer_email: "aarav@example.com",
      method: "esewa",
      amount: 1200,
      status: "paid",
      transaction_id: "ESEWA-7788",
      paid_at: now.toISOString(),
    },
    {
      id: 2,
      payment_code: "PAY-1002",
      booking_id: 2,
      customer_name: "Mira Gurung",
      customer_email: "mira@example.com",
      method: "cash",
      amount: 39000,
      status: "pending",
      transaction_id: "",
      paid_at: tomorrow.toISOString(),
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function shouldUseLocalData() {
  return canUseStorage() && window.localStorage.getItem(DEMO_SESSION_KEY) === "true";
}

export function setDemoSession() {
  if (canUseStorage()) {
    window.localStorage.setItem(DEMO_SESSION_KEY, "true");
  }
}

export function clearDemoSession() {
  if (canUseStorage()) {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
  }
}

function readStore() {
  if (!canUseStorage()) return clone(seedData);

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const seeded = clone(seedData);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return { ...clone(seedData), ...JSON.parse(saved) };
  } catch {
    const seeded = clone(seedData);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function writeStore(store) {
  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

function sortRows(rows) {
  return [...rows].sort((a, b) => Number(b.id) - Number(a.id));
}

export async function localList(table) {
  const store = readStore();
  return sortRows(store[table] || []);
}

export async function localGet(table, id) {
  const rows = await localList(table);
  const row = rows.find((item) => String(item.id) === String(id));
  if (!row) throw new Error("Record not found.");
  return row;
}

export async function localCreate(table, payload) {
  const store = readStore();
  const rows = store[table] || [];
  const id = rows.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
  const row = {
    ...payload,
    id,
    created_at: payload.created_at || new Date().toISOString(),
  };

  store[table] = [row, ...rows];
  writeStore(store);
  return row;
}

export async function localUpdate(table, id, payload) {
  const store = readStore();
  const rows = store[table] || [];
  const index = rows.findIndex((item) => String(item.id) === String(id));

  if (index === -1) throw new Error("Record not found.");

  const updated = { ...rows[index], ...payload, id: rows[index].id };
  store[table] = rows.map((item, itemIndex) => (itemIndex === index ? updated : item));
  writeStore(store);
  return updated;
}

export async function localDelete(table, id) {
  const store = readStore();
  store[table] = (store[table] || []).filter((item) => String(item.id) !== String(id));
  writeStore(store);
  return true;
}
