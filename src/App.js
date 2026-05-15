import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import ListingPage from "./pages/ListingPage";
import DetailsPage from "./pages/DetailsPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import OrdersPage from "./pages/OrdersPage";
import ChatPage from "./pages/ChatPage";
import KhaltiCallbackPage from "./pages/KhaltiCallbackPage";

function App() {
  useEffect(() => {
    console.log("Vental app loaded");
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/listing" element={<ListingPage />} />
      <Route path="/details/:id" element={<DetailsPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment/khalti-callback" element={<KhaltiCallbackPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
