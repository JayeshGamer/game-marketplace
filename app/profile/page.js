"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { playMechanicalClick, playHoverTick } from "@/lib/sound";

export default function Profile() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [purchasedGames, setPurchasedGames] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "library");
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        async function fetchUserData() {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setPurchasedGames(data.purchased || []);
                        setOrders((data.orders || []).sort((a, b) => 
                            new Date(b.timestamp) - new Date(a.timestamp)
                        ));
                    }
                } catch (error) {
                    console.error("Error fetching user profile data:", error);
                } finally {
                    setLoadingData(false);
                }
            }
        }

        if (user) {
            fetchUserData();
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    if (authLoading || loadingData) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center p-6 font-display">
                <div className="bg-white border-4 border-neutral-900 p-8 md:p-12 shadow-[10px_10px_0_#ff4500] max-w-md w-full">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neutral-900">
                        <div className="w-3 h-3 bg-primary animate-ping" />
                        <span className="text-xs font-mono font-black tracking-widest uppercase text-neutral-900">LOADING GAME LIBRARY...</span>
                    </div>
                    <div className="space-y-4">
                        <div className="h-10 bg-neutral-200 animate-pulse border-2 border-neutral-900" />
                        <div className="h-6 bg-neutral-100 animate-pulse border border-neutral-300 w-2/3" />
                        <div className="pt-4 flex items-center justify-between border-t border-neutral-200 text-xs font-mono text-neutral-500 uppercase tracking-wider">
                            <span>SYNCING WITH CLOUD...</span>
                            <span className="text-primary font-black animate-pulse">CONNECTING</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 pt-36 px-4 sm:px-6 md:px-12 pb-24 max-w-7xl mx-auto relative overflow-x-hidden">
            
            {/* Decorative background patterns */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle, #cbd5e1 2px, transparent 2px)`,
                    backgroundSize: '32px 32px',
                    opacity: 0.35
                }}></div>
            </div>

            {/* Header Profile Info */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-6 border-b-4 border-neutral-900 relative">
                <span className="absolute -top-3 left-0 font-mono text-xs text-neutral-400 select-none pointer-events-none">+</span>
                <span className="absolute -top-3 right-0 font-mono text-xs text-neutral-400 select-none pointer-events-none">+</span>

                <div className="relative group">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white border-4 border-neutral-900 shadow-[4px_4px_0_#171717] flex items-center justify-center transition-all hover:shadow-[6px_6px_0_#ff4500] hover:-translate-y-0.5 relative">
                        <span className="absolute top-0.5 left-1 font-mono text-xs text-neutral-400 select-none">+</span>
                        <span className="absolute top-0.5 right-1 font-mono text-xs text-neutral-400 select-none">+</span>
                        <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl md:text-5xl text-neutral-900">sports_esports</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 bg-primary border-2 border-neutral-900 px-2 py-0.5 text-[9px] font-mono font-black tracking-widest uppercase">
                        LV {purchasedGames.length || 1}
                    </div>
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="inline-flex items-center gap-1.5 bg-primary text-neutral-900 px-2.5 py-0.5 font-display font-black tracking-wider uppercase text-[10px] border-2 border-neutral-900">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            VERIFIED PLAYER
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase leading-none mb-1.5 text-neutral-900">
                        {user.displayName || user.email.split('@')[0]}
                    </h1>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 font-mono font-bold tracking-wider">
                        <span className="material-symbols-outlined text-sm">mail</span>
                        {user.email}
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white border-4 border-neutral-900 px-5 py-2.5 shadow-[3px_3px_0_#171717] text-center relative">
                        <span className="absolute top-0.5 left-1 font-mono text-xs text-neutral-400 select-none">+</span>
                        <div className="text-2xl font-black font-mono text-primary leading-none">{purchasedGames.length}</div>
                        <div className="text-[10px] font-display font-black tracking-wider uppercase text-neutral-600 mt-1">GAMES OWNED</div>
                    </div>
                    <div className="bg-white border-4 border-neutral-900 px-5 py-2.5 shadow-[3px_3px_0_#171717] text-center relative">
                        <span className="absolute top-0.5 right-1 font-mono text-xs text-neutral-400 select-none">+</span>
                        <div className="text-2xl font-black font-mono text-primary leading-none">{orders.length}</div>
                        <div className="text-[10px] font-display font-black tracking-wider uppercase text-neutral-600 mt-1">ORDERS</div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b-2 border-neutral-900 pb-0" style={{ animation: 'slideInRight 0.5s ease-out' }}>
                <button 
                    onClick={() => { playMechanicalClick(); setActiveTab("library"); }}
                    onMouseEnter={() => playHoverTick()}
                    className={`btn-tactile group relative flex items-center gap-2 px-4 py-2.5 font-display font-black tracking-[0.15em] uppercase text-xs border-2 border-neutral-900 ${
                        activeTab === "library" 
                            ? "bg-primary text-neutral-900 shadow-[2px_2px_0_#171717] -mb-0.5 z-10" 
                            : "bg-white text-neutral-600 hover:bg-neutral-100 -mb-0.5"
                    }`}>
                    <span className="material-symbols-outlined text-base">grid_view</span>
                    Library
                    <span className={`text-[9px] px-1.5 py-0.5 border font-black ${
                        activeTab === "library" ? "bg-neutral-900 text-primary border-neutral-900" : "bg-neutral-200 text-neutral-600 border-neutral-400"
                    }`}>
                        {purchasedGames.length}
                    </span>
                </button>
                <button 
                    onClick={() => { playMechanicalClick(); setActiveTab("orders"); }}
                    onMouseEnter={() => playHoverTick()}
                    className={`btn-tactile group relative flex items-center gap-2 px-4 py-2.5 font-display font-black tracking-[0.15em] uppercase text-xs border-2 border-neutral-900 ${
                        activeTab === "orders" 
                            ? "bg-primary text-neutral-900 shadow-[2px_2px_0_#171717] -mb-0.5 z-10" 
                            : "bg-white text-neutral-600 hover:bg-neutral-100 -mb-0.5"
                    }`}>
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    Orders
                    <span className={`text-[9px] px-1.5 py-0.5 border font-black ${
                        activeTab === "orders" ? "bg-neutral-900 text-primary border-neutral-900" : "bg-neutral-200 text-neutral-600 border-neutral-400"
                    }`}>
                        {orders.length}
                    </span>
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "library" && (
                <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <h2 className="text-xl font-display font-black tracking-wide uppercase">Game Library</h2>
                        <div className="flex items-center gap-2 border-2 border-neutral-900 bg-white px-3 py-1.5 shadow-[2px_2px_0_#171717]">
                            <span className="material-symbols-outlined text-neutral-900 text-base">search</span>
                            <input type="text" placeholder="SEARCH" className="bg-transparent text-[11px] font-bold tracking-wider text-neutral-900 uppercase outline-none w-40 placeholder:text-neutral-400 font-mono" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {purchasedGames.length > 0 ? (
                            purchasedGames.map((game, idx) => (
                                <GameLibraryCard key={`${game.id}-${idx}`} game={game} idx={idx} />
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center border-2 border-dashed border-neutral-300 bg-white/50">
                                <span className="material-symbols-outlined text-5xl text-neutral-300 mb-3 block">inventory_2</span>
                                <p className="text-neutral-500 font-display font-bold tracking-widest uppercase text-xs mb-5">No Games Yet</p>
                                <Link href="/store" className="inline-block bg-primary border-2 border-neutral-900 px-6 py-2 font-display font-black tracking-[0.2em] uppercase text-xs shadow-[2px_2px_0_#171717] hover:shadow-[4px_4px_0_#171717] hover:-translate-y-0.5 transition-all">
                                    Browse Store
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "orders" && (
                <div className="space-y-6" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <h2 className="text-xl font-display font-black tracking-wide uppercase">Order History</h2>
                        <div className="flex items-center gap-2 border-2 border-neutral-900 bg-neutral-900 text-primary px-3 py-1.5 shadow-[2px_2px_0_#ff4500]">
                            <span className="material-symbols-outlined text-base">receipt</span>
                            <span className="text-[10px] font-display font-black tracking wider uppercase">{orders.length} Total</span>
                        </div>
                    </div>

                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order, idx) => (
                                <OrderCard 
                                    key={order.orderId} 
                                    order={order} 
                                    idx={idx}
                                    isExpanded={expandedOrder === order.orderId}
                                    onToggle={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center border-2 border-dashed border-neutral-300 bg-white/50">
                            <span className="material-symbols-outlined text-5xl text-neutral-300 mb-3 block">receipt_long</span>
                            <p className="text-neutral-500 font-display font-bold tracking-widest uppercase text-xs mb-5">No Orders Yet</p>
                            <Link href="/store" className="inline-block bg-primary border-2 border-neutral-900 px-6 py-2 font-display font-black tracking-[0.2em] uppercase text-xs shadow-[2px_2px_0_#171717] hover:shadow-[4px_4px_0_#171717] hover:-translate-y-0.5 transition-all">
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function GameLibraryCard({ game, idx }) {
    const bgImage = game.cover || game.bg || 'linear-gradient(135deg, #171717 0%, #404040 100%)';
    const isGradient = bgImage.startsWith('linear-gradient') || bgImage.startsWith('radial-gradient');
    
    return (
        <Link href={`/store/${game.id}`}
            onClick={() => playMechanicalClick()}
            onMouseEnter={() => playHoverTick()}
            className="card-lift group cursor-pointer flex flex-col h-full bg-white border-4 border-neutral-900 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#ff4500] overflow-hidden relative"
            style={{ animation: `slideInUp 0.5s ease-out ${idx * 0.05}s both` }}>
            
            {/* Blueprint corner crosshairs */}
            <span className="absolute top-1 left-2 font-mono text-[10px] text-neutral-400 select-none pointer-events-none z-20">+</span>
            <span className="absolute top-1 right-2 font-mono text-[10px] text-neutral-400 select-none pointer-events-none z-20">+</span>

            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200 border-b-4 border-neutral-900">
                {isGradient ? (
                    <div className="absolute inset-0" style={{ background: bgImage }}></div>
                ) : (
                    <img 
                        src={bgImage} 
                        alt={game.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="btn-tactile bg-primary border-2 border-neutral-900 px-4 py-2 text-xs font-display font-black tracking-wider uppercase text-neutral-900 shadow-[2px_2px_0_#171717] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">play_arrow</span>
                        PLAY NOW
                    </div>
                </div>
                
                {/* Purchase date badge */}
                {game.purchaseDate && (
                    <div className="absolute top-2 right-2 bg-neutral-900 border border-primary px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider text-primary shadow-[2px_2px_0_#000]">
                        {new Date(game.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                    </div>
                )}
            </div>
            
            <div className="flex flex-col p-3.5 flex-grow justify-between">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">GAME #{idx + 1}</span>
                    </div>
                    <h3 className="text-neutral-900 font-display font-black uppercase tracking-tight text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {game.title}
                    </h3>
                    {game.developer && (
                        <p className="text-neutral-500 text-xs font-medium uppercase">{game.developer}</p>
                    )}
                </div>
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t-2 border-neutral-900">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] font-mono font-black tracking-wider uppercase text-neutral-900">INSTALLED & READY</p>
                    </div>
                    <span className="text-neutral-500 text-[10px] font-mono font-bold">DRM-FREE</span>
                </div>
            </div>
        </Link>
    );
}

function OrderCard({ order, idx, isExpanded, onToggle }) {
    const orderDate = new Date(order.timestamp);
    const formattedDate = orderDate.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric' 
    });
    const formattedTime = orderDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <div 
            className="bg-white border-4 border-neutral-900 shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#ff4500] transition-all overflow-hidden relative"
            style={{ animation: `slideInUp 0.5s ease-out ${idx * 0.08}s both` }}>
            
            {/* Blueprint corner crosshairs */}
            <span className="absolute top-1 left-2 font-mono text-[10px] text-neutral-400 select-none pointer-events-none z-20">+</span>
            <span className="absolute top-1 right-2 font-mono text-[10px] text-neutral-400 select-none pointer-events-none z-20">+</span>

            {/* Order Header */}
            <div className="p-4 bg-gradient-to-r from-neutral-900 to-neutral-800 border-b-4 border-neutral-900">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className="bg-primary border-2 border-white p-2 shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                            <span className="material-symbols-outlined text-xl text-neutral-900">receipt</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-mono font-black tracking-wider uppercase text-base">
                                    {order.orderId}
                                </h3>
                                <span className="bg-green-500 border border-white text-neutral-900 px-2 py-0.5 text-[9px] font-mono font-black tracking-wider uppercase">
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400 text-xs font-mono font-bold tracking-wider uppercase">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                                    {formattedDate}
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">schedule</span>
                                    {formattedTime}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 mb-0.5">TOTAL PAID</div>
                            <div className="text-2xl font-black font-mono text-primary">${order.total.toFixed(2)}</div>
                        </div>
                        <button 
                            onClick={() => { playMechanicalClick(); onToggle(); }}
                            onMouseEnter={() => playHoverTick()}
                            className="btn-tactile bg-white border-2 border-white hover:bg-primary transition-colors p-1.5 shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                            <span className="material-symbols-outlined text-xl text-neutral-900 transition-transform duration-200">
                                {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>


            {/* Order Items Summary */}
            <div className="p-4 bg-neutral-50">
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-0.5 h-4 bg-primary"></div>
                    <h4 className="text-sm font-display font-black tracking-wider uppercase">
                        Items ({order.items.length})
                    </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {order.items.map((item) => (
                        <Link key={item.id} href={`/store/${item.id}`}
                            className="group flex gap-2 p-2 bg-white border border-neutral-900 hover:border-primary transition-all hover:shadow-[2px_2px_0_#ff4500]">
                            <div className="w-12 h-16 bg-neutral-200 border border-neutral-900 shrink-0 overflow-hidden">
                                {item.cover && (
                                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-display font-black uppercase tracking-tight text-neutral-900 group-hover:text-primary transition-colors line-clamp-2 mb-0.5">
                                    {item.title}
                                </h5>
                                <p className="text-[11px] font-mono font-bold text-primary">${item.price.toFixed(2)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Expanded Receipt Details */}
            {isExpanded && (
                <div className="border-t-2 border-neutral-900 bg-white" style={{ animation: 'expandDown 0.3s ease-out' }}>
                    <div className="p-5 space-y-5">
                        
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start pb-4 border-b border-neutral-200">
                            <div>
                                <h3 className="text-xl font-display font-black uppercase tracking-wider mb-1">
                                    GameVault
                                </h3>
                                <p className="text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                                    Digital Distribution
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-[11px] font-black tracking-wider uppercase text-neutral-900 mb-0.5">INVOICE</div>
                                <div className="text-xs font-mono font-bold text-neutral-600">{order.orderId}</div>
                            </div>
                        </div>

                        {/* Billing Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-neutral-50 border border-neutral-900 p-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                                    <h4 className="text-xs font-display font-black tracking-wider uppercase">Billing Info</h4>
                                </div>
                                <div className="space-y-1 text-xs font-mono">
                                    <p className="font-bold">{order.billingInfo.firstName} {order.billingInfo.lastName}</p>
                                    <p className="text-neutral-600">{order.billingInfo.email}</p>
                                </div>
                            </div>
                            
                            <div className="bg-neutral-50 border border-neutral-900 p-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <span className="material-symbols-outlined text-primary text-sm">credit_card</span>
                                    <h4 className="text-xs font-display font-black tracking-wider uppercase">Payment</h4>
                                </div>
                                <div className="space-y-1 text-xs font-mono">
                                    <p className="font-bold">{order.paymentMethod}</p>
                                    <p className="text-neutral-600">•••• •••• •••• ••••</p>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Line Items */}
                        <div>
                            <h4 className="text-sm font-display font-black tracking-wider uppercase mb-3 flex items-center gap-1.5">
                                <div className="w-0.5 h-3 bg-primary"></div>
                                Details
                            </h4>
                            <div className="border border-neutral-900">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-neutral-900 text-white">
                                            <th className="text-left p-2 text-[11px] font-black tracking-wider uppercase">Item</th>
                                            <th className="text-center p-2 text-[11px] font-black tracking-wider uppercase">QTY</th>
                                            <th className="text-right p-2 text-[11px] font-black tracking-wider uppercase">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, itemIdx) => (
                                            <tr key={itemIdx} className="border-t border-neutral-200 hover:bg-neutral-50">
                                                <td className="p-2">
                                                    <div className="text-xs font-display font-black uppercase tracking-tight">
                                                        {item.title}
                                                    </div>
                                                    {item.developer && (
                                                        <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
                                                            {item.developer}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center p-2 font-mono font-bold text-xs">1</td>
                                                <td className="text-right p-2 font-mono font-bold text-xs">${item.price.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Total Breakdown */}
                        <div className="bg-neutral-900 border-2 border-neutral-900 p-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center pb-2 border-b border-neutral-700">
                                    <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">Subtotal</span>
                                    <span className="font-mono font-bold text-base text-white">${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-neutral-700">
                                    <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">Taxes & Fees</span>
                                    <span className="font-mono font-bold text-base text-white">${order.taxes.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1.5">
                                    <span className="text-sm font-display font-black tracking-wider uppercase text-primary">Total Paid</span>
                                    <span className="font-mono font-black text-2xl text-primary">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="flex items-start gap-2 bg-primary/10 border-l-2 border-primary p-3">
                            <span className="material-symbols-outlined text-primary text-base">info</span>
                            <p className="text-[10px] font-bold tracking-wide uppercase text-neutral-600 leading-relaxed">
                                Digital receipt. Games added to your library and ready for download.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
