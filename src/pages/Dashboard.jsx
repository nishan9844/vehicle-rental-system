import { createBooking } from "../services/bookingService";
import { supabase } from "../lib/supabase";
import { payWithKhalti } from "../components/KhaltiButton";
import ReviewsSection from "../components/ReviewsSection";

<button onClick={() => payWithKhalti(booking.id, booking.total_price * 100)}>
  Pay Now
</button>

const handleBooking = async (vehicle) => {
  const { data } = await supabase.auth.getUser();

  await createBooking({
    user_id: data.user.id,
    vehicle_id: vehicle.id,
    start_date,
    end_date,
    total_price: vehicle.price_per_day * days,
  });

  alert("Booking successful");
};