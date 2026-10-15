"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { playMechanicalClick, playHoverTick, playUplinkChirp } from "@/lib/sound";

export default function Checkout() {
    const { cartItems, clearCart, loading: cartLoading } = useCart();
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const taxes = 0; // Simplified
    const total = subtotal + taxes;

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError("");

        if (!user) {
            router.push("/login");
            return;
        }

        if (cartItems.length === 0) {
            setError("Cart is empty. Cannot process transaction.");
            return;
        }

        playUplinkChirp();
        setIsProcessing(true);

        try {
            const userRef = doc(db, "users", user.uid);
            const timestamp = new Date();
            const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            // Get form data
            const formData = new FormData(e.target);
            const billingInfo = {
                firstName: formData.get('firstName') || '',
                lastName: formData.get('lastName') || '',
                email: formData.get('email') || user.email,
            };

            // Create order record
            const orderRecord = {
                orderId,
                timestamp: timestamp.toISOString(),
                status: 'completed',
                items: cartItems.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    cover: item.cover,
                    bg: item.bg,
                    developer: item.developer,
                    genres: item.genres || [],
                })),
                subtotal,
                taxes,
                total,
                billingInfo,
                paymentMethod: 'Credit Card',
            };

            // Store order in orders array
            await updateDoc(userRef, {
                orders: arrayUnion(orderRecord)
            });

            // Add items to purchased library
            for (const item of cartItems) {
                await updateDoc(userRef, {
                    purchased: arrayUnion({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        bg: item.bg,
                        cover: item.cover,
                        developer: item.developer,
                        purchaseDate: timestamp.toISOString()
                    })
                });
            }

            // Clear the cart
            await clearCart();

            // Redirect to order confirmation page
            router.push(`/order-confirmation?orderId=${orderId}`);

        } catch (err) {
            console.error("Checkout failed:", err);
            setError("Transaction failed. System error.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartLoading || authLoading) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-6 font-display">
                <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[10px_10px_0_#ff4500] max-w-md w-full">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neutral-900">
                        <div className="w-3 h-3 bg-primary animate-ping" />
                        <span className="text-xs font-mono font-black tracking-wider uppercase text-neutral-900">PREPARING SECURE CHECKOUT</span>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-neutral-200 animate-pulse border-2 border-neutral-900" />
                        <div className="h-12 bg-neutral-100 animate-pulse border-2 border-neutral-300" />
                        <div className="pt-4 flex items-center justify-between border-t border-neutral-200 text-xs font-mono text-neutral-500 uppercase tracking-wider">
                            <span>VERIFYING ORDER TOTALS...</span>
                            <span className="text-primary font-black animate-pulse">SECURE</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center font-display text-center p-6">
                <div className="bg-white border-4 border-neutral-900 p-10 md:p-14 shadow-[12px_12px_0_#ff4500] max-w-lg w-full">
                    <div className="w-16 h-16 bg-neutral-900 border-2 border-neutral-900 flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0_#ff4500]">
                        <span className="material-symbols-outlined text-3xl text-primary">lock</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 mb-3">Sign In Required</h2>
                    <p className="text-neutral-500 font-bold tracking-[0.15em] uppercase text-xs mb-8 leading-relaxed">
                        Please sign in to your GameVault account to complete your game purchase.
                    </p>
                    <button onClick={() => router.push("/login")} className="btn-tactile w-full bg-primary border-4 border-neutral-900 text-neutral-900 px-8 py-4 font-black tracking-[0.2em] uppercase text-xs shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717]">
                        Sign In to Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-36 px-6 md:px-12 pb-24 font-display max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-10 border-b-4 border-neutral-900 pb-4 inline-block">
                Checkout & Payment
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">

                {/* Left: Forms */}
                <div className="space-y-12">
                    {error && (
                        <div className="bg-red-50 border-4 border-red-500 p-4">
                            <p className="text-red-600 font-bold text-sm tracking-widest uppercase">{error}</p>
                        </div>
                    )}

                    <section className="bg-white border-4 border-neutral-900 p-8 shadow-[8px_8px_0_#171717]">
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b-4 border-neutral-900 text-neutral-900">
                            <div className="size-10 bg-neutral-900 text-white flex items-center justify-center text-[14px] font-black tracking-widest border-2 border-neutral-900">01</div>
                            <h2 className="text-2xl font-black tracking-[0.15em] uppercase">Billing Details</h2>
                        </div>
                        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold tracking-[0.2em] uppercase text-neutral-900 block border-l-4 border-primary pl-2">First Name</label>
                                    <input required name="firstName" type="text" className="w-full bg-white border-4 border-neutral-900 p-4 text-sm text-neutral-900 uppercase font-mono tracking-wider focus:outline-none focus:bg-neutral-100 transition-colors shadow-[4px_4px_0_#171717]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[12px] font-bold tracking-[0.2em] uppercase text-neutral-900 block border-l-4 border-primary pl-2">Last Name</label>
                                    <input required name="lastName" type="text" className="w-full bg-white border-4 border-neutral-900 p-4 text-sm text-neutral-900 uppercase font-mono tracking-wider focus:outline-none focus:bg-neutral-100 transition-colors shadow-[4px_4px_0_#171717]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold tracking-[0.2em] uppercase text-neutral-900 block border-l-4 border-primary pl-2">Email Address</label>
                                <input required name="email" defaultValue={user?.email || ""} type="email" className="w-full bg-white border-4 border-neutral-900 p-4 text-sm text-neutral-900 uppercase font-mono tracking-wider focus:outline-none focus:bg-neutral-100 transition-colors shadow-[4px_4px_0_#171717]" />
                            </div>
                        </form>
                    </section>

                    <section className="bg-white border-4 border-neutral-900 p-8 shadow-[8px_8px_0_#171717]">
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b-4 border-neutral-900 text-neutral-900">
                            <div className="size-10 bg-neutral-900 text-white flex items-center justify-center text-[14px] font-black tracking-widest border-2 border-neutral-900">02</div>
                            <h2 className="text-2xl font-black tracking-[0.2em] uppercase">Secure Payment</h2>
                        </div>
                        <div className="p-6 border-4 border-neutral-900 bg-neutral-100 space-y-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[14px] tracking-widest uppercase font-black text-neutral-900">Card Details</span>
                                <div className="flex gap-1 text-primary">
                                    <span className="material-symbols-outlined text-3xl">credit_card</span>
                                </div>
                            </div>
                            <input required form="checkout-form" type="text" maxLength={16} placeholder="CARD NUMBER" className="w-full bg-white border-4 border-neutral-900 p-4 text-sm text-neutral-900 uppercase tracking-widest focus:outline-none focus:bg-primary/10 transition-colors font-mono placeholder:text-neutral-400 shadow-[4px_4px_0_#171717]" />
                            <div className="grid grid-cols-2 gap-6">
                                <input required form="checkout-form" type="text" maxLength={5} placeholder="MM/YY" className="w-full bg-white border-4 border-neutral-900 p-4 text-sm text-neutral-900 uppercase tracking-widest focus:outline-none focus:bg-primary/10 transition-colors font-mono placeholder:text-neutral-400 shadow-[4px_4px_0_#171717]" />
                                <input required form="checkout-form" type="text" maxLength={4} placeholder="CVC" className="w-full bg-white border-4 border-neutral-900 p-4 text-sm text-neutral-900 uppercase tracking-widest focus:outline-none focus:bg-primary/10 transition-colors font-mono placeholder:text-neutral-400 shadow-[4px_4px_0_#171717]" />
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right: Order Summary */}
                <div>
                    <div className="sticky top-32 p-8 border-4 border-neutral-900 bg-neutral-900 text-white shadow-[8px_8px_0_#ff4500] relative">
                        {/* Corner Crosshairs */}
                        <span className="absolute top-2 left-3 text-neutral-600 font-mono text-xs pointer-events-none select-none z-10">+</span>
                        <span className="absolute top-2 right-3 text-neutral-600 font-mono text-xs pointer-events-none select-none z-10">+</span>

                        <h2 className="text-xl font-black tracking-[0.2em] uppercase mb-8 text-primary flex items-center justify-between border-b-4 border-white pb-4">
                            Order Summary
                            <span className="text-white font-mono text-3xl">${total.toFixed(2)}</span>
                        </h2>

                        <div className="space-y-6 mb-12 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Miniature item breakdown */}
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center border-b-2 border-neutral-700 pb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-black uppercase tracking-widest text-white">{item.title}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Qty: 1</span>
                                    </div>
                                    <span className="text-sm font-mono font-bold text-neutral-400">${(item.price || 0).toFixed(2)}</span>
                                </div>
                            ))}
                            {cartItems.length === 0 && (
                                <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs text-center">Cart is empty.</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={isProcessing || cartItems.length === 0}
                            onClick={() => playMechanicalClick(850, 0.2)}
                            onMouseEnter={() => playHoverTick()}
                            className="btn-tactile w-full bg-primary border-4 border-white text-neutral-900 flex items-center justify-center gap-3 py-6 text-[14px] font-black tracking-[0.3em] uppercase shadow-[4px_4px_0_#ffffff] hover:shadow-[8px_8px_0_#ffffff] disabled:opacity-50 disabled:shadow-none"
                        >
                            <span className="material-symbols-outlined text-xl font-black">
                                {isProcessing ? "hourglass_empty" : "lock"}
                            </span>
                            {isProcessing ? "PROCESSING..." : `PAY $${total.toFixed(2)}`}
                        </button>
                        <div className="bg-neutral-800 border-l-4 border-primary p-4 mt-8">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 leading-relaxed text-left">
                                By confirming this transaction, you agree to Vault&apos;s End User License Protocol. Your connection is secured via quantum encryption.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
