import KhaltiCheckout from "khalti-checkout-web";
import axios from "axios";
import { supabase } from "../lib/supabase";

export const payWithKhalti = (bookingId, amount) => {
  const config = {
    productIdentity: bookingId,
    productName: "Vehicle Booking",

    eventHandler: {
      async onSuccess(payload) {
        const res = await axios.post("http://localhost:5000/verify-payment", {
          token: payload.token,
          amount: payload.amount,
        });

        if (res.data.success) {
          await supabase
            .from("bookings")
            .update({ payment_status: "paid" })
            .eq("id", bookingId);

          alert("Payment successful");
        }
      },
    },
  };

  const checkout = new KhaltiCheckout(config);
  checkout.show({ amount });
};