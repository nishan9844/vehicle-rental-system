const config = {
    publicKey: "YOUR_PUBLIC_KEY",
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