import React from "react";
import {
    LuShieldCheck, LuCreditCard,
    LuLock, LuArrowRight
} from "react-icons/lu";
import esewaImg from "../assets/images/esewa.png";
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

export function PaymentMain({ method, setMethod, cardData, setCardData }) {
    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'card_number') {
            const v = value.replace(/\s+/g, '').replace(/\D/g, '').substring(0, 16);
            const parts = [];
            for (let i = 0; i < v.length; i += 4) {
                parts.push(v.substring(i, i + 4));
            }
            formattedValue = parts.length > 0 ? parts.join(' ') : v;
        } else if (name === 'expiry') {
            const v = value.replace(/\D/g, '').substring(0, 4);
            if (v.length >= 3) {
                formattedValue = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
            } else {
                formattedValue = v;
            }
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').substring(0, 4); // some cards have 4 digit cvv
        } else {
            formattedValue = value;
        }

        if (setCardData) {
            setCardData({ ...cardData, [name]: formattedValue });
        }
    };
    return (
        <main className="payment-main">
            <div className="payment-card">
                <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <LuCreditCard style={{ color: "var(--payment-brand-blue)" }} /> Payment Method
                </h2>

                <div className="payment-methods">
                    <label
                        className={`method-option ${method === 'card' ? 'active' : ''}`}
                        onClick={() => setMethod('card')}
                    >
                        <LuCreditCard />
                        <span style={{ flex: 1, fontWeight: 500 }}>Credit / Debit Card</span>
                        <div className={`radio-custom ${method === 'card' ? 'checked' : ''}`}></div>
                    </label>
                    <label
                        className={`method-option ${method === 'esewa' ? 'active' : ''}`}
                        onClick={() => setMethod('esewa')}
                    >
                        <img src={esewaImg} alt="eSewa" style={{ width: '32px', height: 'auto', borderRadius: '4px' }} />
                        <span className="option-label">eSewa Wallet</span>
                        <div className={`radio-custom ${method === 'esewa' ? 'checked' : ''}`}></div>
                    </label>
                    <label
                        className={`method-option ${method === 'khalti' ? 'active' : ''}`}
                        onClick={() => setMethod('khalti')}
                    >
                        <img src={khaltiImg} alt="Khalti" style={{ width: '32px', height: 'auto', borderRadius: '4px' }} />
                        <span className="option-label">Khalti Digital</span>
                        <div className={`radio-custom ${method === 'khalti' ? 'checked' : ''}`}></div>
                    </label>
                </div>

                {method === 'card' ? (
                    <form id="cardPaymentForm" className="card-form" method="POST">
                        <div className="form-group">
                            <label>CARDHOLDER NAME</label>
                            <input type="text" name="cardholder_name" className="form-control" value={cardData?.cardholder_name || ''} onChange={handleCardChange} required />
                        </div>
                        <div className="form-group">
                            <label>CARD NUMBER</label>
                            <input type="text" name="card_number" className="form-control" placeholder="0000 0000 0000 0000" value={cardData?.card_number || ''} onChange={handleCardChange} pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}" title="Format: xxxx xxxx xxxx xxxx" required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>EXPIRY DATE</label>
                                <input type="text" name="expiry" className="form-control" placeholder="MM/YY" value={cardData?.expiry || ''} onChange={handleCardChange} pattern="\d{2}/\d{2}" title="Format: MM/YY" required />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input type="password" name="cvv" className="form-control" placeholder="•••" value={cardData?.cvv || ''} onChange={handleCardChange} pattern="\d{3,4}" title="3 or 4 digits" required />
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="digital-wallet-notice" style={{ padding: "32px", textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed var(--border-color)", margin: "24px 0" }}>
                        <img
                            src={method === 'esewa' ? esewaImg : khaltiImg}
                            alt={method}
                            style={{ height: "45px", margin: "0 auto 16px auto" }}
                        />
                        <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                            You will be redirected to {method === 'esewa' ? 'eSewa' : 'Khalti'} to complete your secure NPR transaction safely.
                        </p>
                    </div>
                )}
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
