import React from "react";
import {
    LuShieldCheck, LuCreditCard, LuSmartphone,
    LuWallet, LuLock, LuArrowRight
} from "react-icons/lu";
import { Link } from "react-router-dom";
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

export function PaymentMain({ method, setMethod }) {
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
                            <input type="text" name="cardholder_name" className="form-control" defaultValue="Johnathan Doe" required />
                        </div>
                        <div className="form-group">
                            <label>CARD NUMBER</label>
                            <input type="text" name="card_number" className="form-control" defaultValue="0000 0000 0000 0000" required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>EXPIRY DATE</label>
                                <input type="text" name="expiry" className="form-control" placeholder="MM / YY" required />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input type="password" name="cvv" className="form-control" placeholder="•••" required />
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

export function PaymentSidebar({ onConfirm }) {
    return (
        <aside className="payment-sidebar">
            <div className="payment-card sticky-sidebar">
                <h2 className="vehicle-name">Velocity GT-S 2024</h2>

                <div className="summary-rows">
                    <div className="summary-line">
                        <span className="summary-label">Daily Rate (3 Days)</span>
                        <strong className="summary-value">NPR700</strong>
                    </div>
                    <div className="summary-line">
                        <span className="summary-label">Subtotal</span>
                        <strong className="summary-value">NPR1000</strong>
                    </div>
                    <div className="summary-line">
                        <span className="summary-label">Taxes & Fees (15%)</span>
                        <strong className="summary-value">NPR 130</strong>
                    </div>
                    <div className="summary-line" style={{ paddingBottom: "24px", marginBottom: "24px" }}>
                        <span className="summary-label">Security Deposit</span>
                        <strong className="summary-value">NPR 500</strong>
                    </div>
                </div>

                <div className="total-amount-row">
                    <div>
                        <span className="total-amount-label">TOTAL AMOUNT</span>
                        <div className="total-amount-value">NPR 1,081.55</div>
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--payment-text-medium-gray)" }}>NPR Inclusive of all VAT</span>
                </div>

                <button 
                    onClick={onConfirm}
                    className="btn-confirm-payment"
                >
                    Confirm Payment NPR 1,081.55 <LuArrowRight style={{ width: "18px", marginLeft: "8px" }} />
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
