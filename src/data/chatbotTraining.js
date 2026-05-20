export const chatbotTraining = {
  assistantName: "Vental Chatter",
  businessName: "Vental",
  fallback:
    "I can help with Vental vehicle rentals, bookings, payments, Khalti, orders, required documents, deposits, cancellations, and availability.",
  safetyFallback:
    "I cannot help with passwords, OTPs, full card numbers, secret keys, or admin access. Please use the official login, payment, or Orders page for private account help.",
  topics: [
    {
      id: "greeting",
      keywords: ["hello", "hi", "hey", "namaste", "help", "support"],
      answer:
        "Hi! I am Vental Chatter. I can help you choose a vehicle, understand booking steps, payment options, documents, deposits, and order status.",
    },
    {
      id: "booking",
      keywords: ["book", "booking", "reserve", "rent", "reservation", "confirm"],
      answer:
        "To book a vehicle, open Listings, choose a vehicle, select pickup and return dates, enter your personal and document details, then complete payment. Your booking is confirmed only after successful payment.",
    },
    {
      id: "availability",
      keywords: ["available", "availability", "dates", "pickup", "return", "already booked"],
      answer:
        "Availability is checked when you select dates and again before payment. If another booking already exists for those dates, choose another vehicle or different pickup and return dates.",
    },
    {
      id: "payment",
      keywords: ["payment", "pay", "card", "paid", "checkout", "transaction"],
      answer:
        "You can pay from the Payment page. After a successful payment, your booking becomes confirmed and appears in Orders. Never share passwords, OTPs, or full card details in chat.",
    },
    {
      id: "khalti",
      keywords: ["khalti", "wallet", "pidx", "verify", "verification"],
      answer:
        "For Khalti, select Khalti on the Payment page and complete the payment on Khalti's secure checkout. After Khalti confirms the transaction, Vental verifies it and marks your booking as paid.",
    },
    {
      id: "orders",
      keywords: ["order", "orders", "status", "my booking", "history"],
      answer:
        "You can view your booking status from the Orders page after signing in. Paid bookings should show as confirmed or active depending on the rental stage.",
    },
    {
      id: "documents",
      keywords: ["document", "license", "citizenship", "id", "verification"],
      answer:
        "For booking, Vental asks for your full name, email, phone number, driver's license ID, and citizenship/document verification details.",
    },
    {
      id: "deposit",
      keywords: ["deposit", "security", "refund", "fees", "tax", "taxes"],
      answer:
        "The total price can include rental subtotal, taxes and fees, and a security deposit. The deposit amount depends on the selected vehicle and booking details.",
    },
    {
      id: "cancellation",
      keywords: ["cancel", "cancellation", "refund", "change booking", "modify"],
      answer:
        "For cancellation or booking changes, check your Orders page or contact Vental support. Refund eligibility can depend on payment status, pickup date, and rental policy.",
    },
    {
      id: "vehicles",
      keywords: ["vehicle", "car", "bike", "ev", "suv", "brand", "model", "listing"],
      answer:
        "You can browse cars, bikes, and EVs from the Listings page. Vehicle cards show price, category, image, and key details before booking.",
    },
    {
      id: "account",
      keywords: ["signup", "sign up", "login", "signin", "account", "email", "otp"],
      answer:
        "Create an account from Sign Up, then sign in before booking. If email OTP is enabled, enter the verification code sent to your email before continuing.",
    },
  ],
};

export const blockedChatbotKeywords = [
  "password",
  "otp",
  "secret",
  "api key",
  "service role",
  "hack",
  "bypass",
  "admin login",
  "credit card number",
  "cvv",
];
