"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function OrderConfirmation() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const router = useRouter();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        if (!orderId) {
            router.push("/profile?tab=orders");
            return;
        }

        async function fetchOrder() {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const orders = userDoc.data().orders || [];
                    const foundOrder = orders.find(o => o.orderId === orderId);
                    if (foundOrder) {
                        setOrder(foundOrder);
                    } else {
                        router.push("/profile?tab=orders");
                    }
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [user, orderId, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-6">
                <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[10px_10px_0_#22c55e] max-w-md w-full">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neutral-900">
                        <div className="w-3 h-3 bg-green-500 animate-ping" />
                        <span className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-neutral-900">FETCHING TRANSACTION VOUCHER</span>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 bg-neutral-200 animate-pulse border-2 border-neutral-900" />
                        <div className="h-10 bg-neutral-100 animate-pulse border border-neutral-300" />
                        <div className="pt-4 flex items-center justify-between border-t border-neutral-200 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                            <span>MINTING RECEIPT...</span>
                            <span className="text-green-600 font-black animate-pulse">VERIFIED</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-6">
                <div className="text-center border-4 border-neutral-900 bg-white p-12 shadow-[12px_12px_0_#171717] max-w-md w-full">
                    <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-900 flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0_#ff4500]">
                        <span className="material-symbols-outlined text-3xl text-primary">receipt_long</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight mb-2 text-neutral-900">Order Not Found</h1>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-8 leading-relaxed">
                        The requested order reference could not be located in your history.
                    </p>
                    <Link href="/profile?tab=orders" className="btn-tactile inline-flex items-center justify-center gap-2 w-full bg-primary border-4 border-neutral-900 px-6 py-3.5 font-black text-xs tracking-widest uppercase shadow-[4px_4px_0_#171717]">
                        View Orders
                    </Link>
                </div>
            </div>
        );
    }

    const orderDate = new Date(order.timestamp);

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 font-display pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
                
                {/* Success Banner */}
                <div className="bg-white border-4 border-neutral-900 p-8 mb-8 shadow-[12px_12px_0_#22c55e] relative overflow-hidden"
                    style={{ animation: "slideInUp 0.6s ease-out" }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rotate-45 translate-x-16 -translate-y-16" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary border-4 border-neutral-900 flex items-center justify-center shadow-[4px_4px_0_#171717]">
                                <span className="material-symbols-outlined text-2xl text-neutral-900">check_circle</span>
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                                    Order Complete
                                </h1>
                                <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mt-1">Transaction Confirmed</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t-4 border-neutral-900">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-bold tracking-widest uppercase text-neutral-500">Order ID</span>
                                <span className="text-sm font-black font-mono text-neutral-900 tracking-tight">{order.orderId}</span>
                            </div>
                            <div className="h-8 w-px bg-neutral-300" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-bold tracking-widest uppercase text-neutral-500">Date</span>
                                <span className="text-sm font-bold text-neutral-900">
                                    {orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="h-8 w-px bg-neutral-300" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-bold tracking-widest uppercase text-neutral-500">Total</span>
                                <span className="text-xl font-black font-mono text-primary tracking-tight">
                                    ${order.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] mb-8 overflow-hidden">
                    <div className="bg-neutral-900 px-6 py-4 border-b-4 border-neutral-900 flex items-center justify-between">
                        <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white">Purchased Games</h2>
                        <span className="text-[9px] font-bold font-mono text-neutral-400 bg-neutral-800 px-2 py-1 border-2 border-neutral-700">
                            {order.items.length} TITLE{order.items.length !== 1 ? 'S' : ''}
                        </span>
                    </div>
                    
                    <div className="divide-y-4 divide-neutral-900">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors group">
                                <div className="w-20 h-28 bg-neutral-200 border-4 border-neutral-900 shrink-0 overflow-hidden shadow-[3px_3px_0_#171717]">
                                    {item.cover && (
                                        <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    {item.developer && (
                                        <p className="text-[9px] font-bold tracking-widest uppercase text-neutral-500 mt-1">
                                            {item.developer}
                                        </p>
                                    )}
                                    {item.genres && item.genres.length > 0 && (
                                        <div className="flex gap-1.5 mt-2">
                                            {item.genres.slice(0, 2).map((genre, i) => (
                                                <span key={i} className="text-[7px] font-black tracking-wider uppercase text-neutral-600 bg-neutral-100 px-1.5 py-0.5 border border-neutral-300">
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-black font-mono text-neutral-900 tabular-nums">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border-4 border-neutral-900 p-6 shadow-[6px_6px_0_#171717]">
                        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-500 mb-4 pb-3 border-b-2 border-neutral-200">
                            Billing Information
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-600 font-bold text-[10px] tracking-wide uppercase">Name:</span>
                                <span className="font-black">{order.billingInfo?.firstName} {order.billingInfo?.lastName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 font-bold text-[10px] tracking-wide uppercase">Email:</span>
                                <span className="font-bold font-mono text-[11px]">{order.billingInfo?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-600 font-bold text-[10px] tracking-wide uppercase">Payment:</span>
                                <span className="font-black">{order.paymentMethod}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border-4 border-neutral-900 p-6 shadow-[6px_6px_0_#ff4500]">
                        <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-4 pb-3 border-b-2 border-neutral-700">
                            Order Summary
                        </h3>
                        <div className="space-y-2 text-white">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400 font-bold text-[10px] tracking-wide uppercase">Subtotal:</span>
                                <span className="font-mono font-black">${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400 font-bold text-[10px] tracking-wide uppercase">Taxes:</span>
                                <span className="font-mono font-black">${order.taxes.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-3 mt-3 border-t-2 border-neutral-700">
                                <span className="text-primary font-black text-xs tracking-widest uppercase">Total:</span>
                                <span className="font-mono font-black text-2xl text-primary tabular-nums">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4">
                    <Link href="/profile?tab=library" 
                        className="btn-tactile flex-1 bg-primary border-4 border-neutral-900 text-neutral-900 py-4 text-[11px] font-black tracking-[0.25em] uppercase text-center shadow-[6px_6px_0_#171717] hover:shadow-[8px_8px_0_#171717] flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base">videogame_asset</span>
                        View Library
                    </Link>
                    <Link href="/store" 
                        className="btn-tactile flex-1 bg-white border-4 border-neutral-900 text-neutral-900 py-4 text-[11px] font-black tracking-[0.25em] uppercase text-center shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base">storefront</span>
                        Continue Shopping
                    </Link>
                </div>

                {/* Download Notice */}
                <div className="mt-8 bg-neutral-100 border-2 border-dashed border-neutral-400 p-6 text-center">
                    <span className="material-symbols-outlined text-3xl text-neutral-400 mb-2">info</span>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-600">
                        Your games are now available in your library. Download and play anytime!
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
