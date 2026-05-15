import React from "react";
import {
    LuShieldCheck,
    LuLock, LuArrowRight, LuWallet
} from "react-icons/lu";
import khaltiImg from "../assets/images/khalti.jpg";

export function PaymentHeader() {
    return (
        <header className="payment-header">
            <div className="encrypted-badge">
                <LuShieldCheck /> ENCRYPTED ENVIRONMENT
            </div>
            <h1 className="page-title">Secure Payment</h1>
            <p className="description-text">Complete your reservation with safe and encrypted payment method</p>
        </header>
    );
}

export function PaymentMain({ method }) {

    return (
        <main className="payment-main">
            <div className="payment-card">
                <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <LuWallet style={{ color: "var(--payment-brand-blue)" }} /> Payment Method
                </h2>

                <div className="payment-methods">
                    <label
                        className="method-option active"
                    >
                        <img src={khaltiImg} alt="Khalti" style={{ width: '32px', height: 'auto', borderRadius: '4px' }} />
                        <span className="option-label">Khalti Digital</span>
                        <div className="radio-custom checked"></div>
                    </label>
                </div>

                <div className="digital-wallet-notice" style={{ padding: "32px", textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed var(--border-color)", margin: "24px 0" }}>
                    <img
                        src={khaltiImg}
                        alt="Khalti"
                        style={{ height: "45px", margin: "0 auto 16px auto" }}
                    />
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                        You will be redirected to Khalti to complete your secure NPR transaction safely.
                    </p>
                </div>
            </div>

            <div className="encryption-notice">
                <LuLock style={{ width: "24px", height: "24px", color: "var(--primary-blue)", flexShrink: 0 }} />
                <p>
                    Your data is encrypted using 256-bit SSL security protocols. We do not store your full card details on our servers.
                    All transactions are processed through our secure PCI-DSS compliant partner.
                </p>
            </div>
        </main>
    );
}

export function PaymentSidebar({ onConfirm, booking, processing }) {
    const vehicle = booking?.vehicles || { name: "Velocity GT-S 2024" };
    const total = booking?.total_price || 1081.55;
    const deposit = booking?.deposit || 500;

    // Reverse calculating subtotal and taxes based on the 15% rule
    const taxesAndSubtotal = total - deposit;
    const subtotal = taxesAndSubtotal / 1.15;
    const taxes = taxesAndSubtotal - subtotal;

    // Approximate days
    const dailyRate = vehicle?.price_per_day || 299;
    const days = Math.round(subtotal / dailyRate) || 1;

    return (
        <aside className="payment-sidebar">
            <div className="payment-card sticky-sidebar">
                <h2 className="vehicle-name">{vehicle.name}</h2>

                <div className="summary-rows">
                    <div className="summary-line">
                        <span className="summary-label">Daily Rate ({days} Days)</span>
                        <strong className="summary-value">NPR {dailyRate.toFixed(2)}</strong>
                    </div>
                    <div className="summary-line">
                        <span className="summary-label">Subtotal</span>
                        <strong className="summary-value">NPR {subtotal.toFixed(2)}</strong>
                    </div>
                    <div className="summary-line">
                        <span className="summary-label">Taxes & Fees (15%)</span>
                        <strong className="summary-value">NPR {taxes.toFixed(2)}</strong>
                    </div>
                    <div className="summary-line" style={{ paddingBottom: "24px", marginBottom: "24px" }}>
                        <span className="summary-label">Security Deposit</span>
                        <strong className="summary-value">NPR {deposit.toFixed(2)}</strong>
                    </div>
                </div>

                <div className="total-amount-row">
                    <div>
                        <span className="total-amount-label">TOTAL AMOUNT</span>
                        <div className="total-amount-value">NPR {total.toFixed(2)}</div>
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--payment-text-medium-gray)" }}>NPR Inclusive of all VAT</span>
                </div>

                <button
                    onClick={onConfirm}
                    className="btn-confirm-payment"
                    disabled={processing}
                >
                    {processing ? "Processing..." : `Confirm Payment NPR ${total.toFixed(2)}`} <LuArrowRight style={{ width: "18px", marginLeft: "8px" }} />
                </button>

                <p style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center", marginTop: "16px" }}>
                    BY CLICKING CONFIRM, YOU AGREE TO OUR RENTAL TERMS & INSURANCE POLICY.
                </p>
            </div>
        </aside>
    );
}

export default function PaymentPageComponents() {
    return (
        <div className="payment-layout">
            <PaymentMain />
            <PaymentSidebar />
        </div>
    );
}
