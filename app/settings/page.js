"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { playMechanicalClick, playHoverTick, playUplinkChirp } from "@/lib/sound";

export default function AccountSettings() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Profile form
    const [displayName, setDisplayName] = useState("");
    
    // Security form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Email form
    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else {
            setDisplayName(user.displayName || "");
            setNewEmail(user.email || "");
        }
    }, [user, router]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            showMessage("error", "New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            showMessage("error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
            
            showMessage("success", "Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Password update error:", error);
            if (error.code === "auth/wrong-password") {
                showMessage("error", "Current password is incorrect");
            } else {
                showMessage("error", error.message || "Failed to update password");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        
        if (!newEmail || newEmail === user.email) {
            showMessage("error", "Please enter a different email address");
            return;
        }

        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, emailPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updateEmail(auth.currentUser, newEmail);
            
            showMessage("success", "Email address updated successfully");
            setEmailPassword("");
        } catch (error) {
            console.error("Email update error:", error);
            if (error.code === "auth/wrong-password") {
                showMessage("error", "Password is incorrect");
            } else if (error.code === "auth/email-already-in-use") {
                showMessage("error", "This email is already in use by another account");
            } else {
                showMessage("error", error.message || "Failed to update email");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your GameVault account? All your purchased game licenses and saves will be permanently removed.")) {
            return;
        }

        setLoading(true);
        try {
            await auth.currentUser.delete();
            showMessage("success", "Account deleted successfully");
            router.push("/");
        } catch (error) {
            console.error("Account deletion error:", error);
            if (error.code === "auth/requires-recent-login") {
                showMessage("error", "Please sign out and sign back in before deleting your account");
            } else {
                showMessage("error", error.message || "Failed to delete account");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    const navigationItems = [
        { id: "profile", label: "Player Profile", icon: "badge", desc: "Display name & avatar" },
        { id: "security", label: "Password & Security", icon: "lock", desc: "Manage your credentials" },
        { id: "email", label: "Email Address", icon: "mail", desc: "Notification & login email" },
        { id: "danger", label: "Delete Account", icon: "delete_forever", desc: "Permanent account removal" },
    ];

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 font-display pt-32 pb-24 px-4 sm:px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="border-b-4 border-neutral-900 pb-6 mb-8 relative">
                    <span className="absolute -top-3 left-0 font-mono text-xs text-neutral-400 select-none pointer-events-none">+</span>
                    <span className="absolute -top-3 right-0 font-mono text-xs text-neutral-400 select-none pointer-events-none">+</span>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-900 border-4 border-neutral-900 flex items-center justify-center shadow-[4px_4px_0_#ff4500]">
                            <span className="material-symbols-outlined text-2xl md:text-3xl text-primary">manage_accounts</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-primary text-neutral-900 px-2 py-0.5 text-[10px] font-mono font-black uppercase tracking-wider">
                                    PLAYER SETTINGS
                                </span>
                                <span className="text-xs font-mono font-bold text-neutral-500 uppercase">
                                    STEAM & EPIC SYNC READY
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight uppercase leading-none text-neutral-900">
                                Account Settings
                            </h1>
                            <p className="text-xs md:text-sm font-medium text-neutral-600 mt-1.5">
                                Manage your gamer profile, security credentials, and store preferences.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Message Alert Banner */}
                {message.text && (
                    <div className={`border-4 p-4 mb-6 flex items-center gap-3 relative shadow-[4px_4px_0_#171717] ${
                        message.type === "success" 
                            ? "bg-green-50 border-green-600 text-green-950" 
                            : "bg-red-50 border-red-600 text-red-950"
                    }`} style={{ animation: "slideInUp 0.3s ease-out" }}>
                        <span className="absolute top-1 left-2 font-mono text-xs text-neutral-400 select-none">+</span>
                        <span className={`material-symbols-outlined text-2xl ${
                            message.type === "success" ? "text-green-600" : "text-red-600"
                        }`}>
                            {message.type === "success" ? "check_circle" : "error"}
                        </span>
                        <p className="text-sm font-bold uppercase tracking-wide">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Ergonomic Sidebar Navigation */}
                    <aside className="lg:col-span-4">
                        <div className="bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] overflow-hidden sticky top-28 relative">
                            <span className="absolute top-1 left-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-10">+</span>
                            <span className="absolute top-1 right-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-10">+</span>

                            <div className="bg-neutral-900 px-5 py-3.5 border-b-4 border-neutral-900 flex items-center justify-between">
                                <span className="text-xs font-mono font-black tracking-widest uppercase text-white">SETTINGS MENU</span>
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            </div>
                            <nav className="divide-y-2 divide-neutral-200">
                                {navigationItems.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { playMechanicalClick(); setActiveTab(tab.id); }}
                                        onMouseEnter={() => playHoverTick()}
                                        className={`btn-tactile w-full flex items-center gap-3.5 px-5 py-4 text-left transition-all ${
                                            activeTab === tab.id
                                                ? "bg-primary text-neutral-900 font-black shadow-[inset_6px_0_0_#171717]"
                                                : "bg-white text-neutral-700 hover:bg-neutral-100 font-bold"
                                        }`}
                                    >
                                        <div className={`w-8 h-8 flex items-center justify-center border-2 border-neutral-900 shrink-0 ${
                                            activeTab === tab.id ? "bg-neutral-900 text-primary" : "bg-neutral-100 text-neutral-800"
                                        }`}>
                                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-display font-black tracking-wider uppercase truncate">
                                                {tab.label}
                                            </span>
                                            <span className={`text-[11px] truncate font-sans font-medium ${
                                                activeTab === tab.id ? "text-neutral-900" : "text-neutral-500"
                                            }`}>
                                                {tab.desc}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Pane */}
                    <main className="lg:col-span-8">
                        
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] relative">
                                <span className="absolute top-1 left-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-10">+</span>
                                <span className="absolute top-1 right-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-10">+</span>

                                <div className="bg-neutral-900 px-6 py-4 border-b-4 border-neutral-900 flex items-center justify-between">
                                    <h2 className="text-xs font-mono font-black tracking-widest uppercase text-white">PLAYER PROFILE</h2>
                                    <span className="text-[10px] font-mono text-primary font-bold">STATUS: ONLINE</span>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="flex items-center gap-4 pb-6 border-b-4 border-neutral-900">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary border-4 border-neutral-900 flex items-center justify-center shadow-[4px_4px_0_#171717]">
                                            <span className="material-symbols-outlined text-4xl text-neutral-900">sports_esports</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono font-black tracking-wider uppercase bg-neutral-900 text-primary px-2 py-0.5">
                                                    VERIFIED GAMER
                                                </span>
                                            </div>
                                            <p className="text-2xl font-display font-black uppercase tracking-tight text-neutral-900">
                                                {user.displayName || user.email?.split('@')[0]}
                                            </p>
                                            <p className="text-xs font-mono font-medium text-neutral-600">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">
                                                Gamer Tag / Display Name
                                            </label>
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="w-full bg-neutral-100 border-4 border-neutral-900 px-4 py-3 text-sm font-bold text-neutral-900 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                                placeholder="Enter your gamer tag"
                                            />
                                        </div>

                                        <div className="bg-neutral-100 border-2 border-neutral-900 p-4">
                                            <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                                                <span className="material-symbols-outlined text-base align-middle mr-1.5 text-primary">info</span>
                                                Your gamer tag is visible to other players, appears on your game reviews, and is displayed on your public library profile.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] relative">
                                <span className="absolute top-1 left-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-10">+</span>
                                <span className="absolute top-1 right-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-10">+</span>

                                <div className="bg-neutral-900 px-6 py-4 border-b-4 border-neutral-900 flex items-center justify-between">
                                    <h2 className="text-xs font-mono font-black tracking-widest uppercase text-white">CHANGE PASSWORD</h2>
                                    <span className="text-[10px] font-mono text-neutral-400">ENCRYPTION: AES-256</span>
                                </div>
                                <form onSubmit={(e) => { playUplinkChirp(); handleChangePassword(e); }} className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                            className="w-full bg-neutral-100 border-4 border-neutral-900 px-4 py-3 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="w-full bg-neutral-100 border-4 border-neutral-900 px-4 py-3 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full bg-neutral-100 border-4 border-neutral-900 px-4 py-3 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        onMouseEnter={() => playHoverTick()}
                                        className="btn-tactile w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-3.5 text-xs font-display font-black tracking-wider uppercase shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all"
                                    >
                                        {loading ? "Saving..." : "Update Password"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Email Tab */}
                        {activeTab === "email" && (
                            <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717] relative">
                                <span className="absolute top-1 left-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-10">+</span>
                                <span className="absolute top-1 right-2 font-mono text-xs text-neutral-400 select-none pointer-events-none z-10">+</span>

                                <div className="bg-neutral-900 px-6 py-4 border-b-4 border-neutral-900 flex items-center justify-between">
                                    <h2 className="text-xs font-mono font-black tracking-widest uppercase text-white">UPDATE EMAIL ADDRESS</h2>
                                    <span className="text-[10px] font-mono text-neutral-400">VERIFIED</span>
                                </div>
                                <form onSubmit={(e) => { playUplinkChirp(); handleChangeEmail(e); }} className="p-6 md:p-8 space-y-6">
                                    <div className="bg-neutral-100 border-2 border-neutral-900 p-4">
                                        <p className="text-xs font-mono font-bold text-neutral-700">
                                            <span className="font-black uppercase tracking-wider text-neutral-900 mr-2">Current Email:</span> {user.email}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">
                                            New Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            required
                                            className="w-full bg-neutral-100 border-4 border-neutral-900 px-4 py-3 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                            placeholder="gamer@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black tracking-wider uppercase text-neutral-800 mb-2">
                                            Confirm Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={emailPassword}
                                            onChange={(e) => setEmailPassword(e.target.value)}
                                            required
                                            className="w-full bg-neutral-100 border-4 border-neutral-900 px-4 py-3 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        onMouseEnter={() => playHoverTick()}
                                        className="btn-tactile w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-3.5 text-xs font-display font-black tracking-wider uppercase shadow-[4px_4px_0_#171717] hover:shadow-[6px_6px_0_#171717] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 transition-all"
                                    >
                                        {loading ? "Updating..." : "Update Email Address"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Danger Zone Tab */}
                        {activeTab === "danger" && (
                            <div className="bg-white border-4 border-red-500 shadow-[8px_8px_0_#dc2626] relative">
                                <span className="absolute top-1 left-2 font-mono text-xs text-red-500 select-none pointer-events-none z-10">+</span>
                                <span className="absolute top-1 right-2 font-mono text-xs text-red-500 select-none pointer-events-none z-10">+</span>

                                <div className="bg-red-500 px-6 py-4 border-b-4 border-red-600 flex items-center justify-between">
                                    <h2 className="text-xs font-mono font-black tracking-widest uppercase text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">warning</span>
                                        DANGER ZONE: DELETE ACCOUNT
                                    </h2>
                                    <span className="text-[10px] font-mono text-white font-bold">PERMANENT ACTION</span>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="bg-red-50 border-2 border-red-500 p-6">
                                        <h3 className="text-base font-display font-black uppercase tracking-tight text-red-950 mb-2">
                                            Permanently Delete GameVault Account
                                        </h3>
                                        <p className="text-xs font-medium text-red-800 leading-relaxed mb-4">
                                            Once you delete your account, there is no going back. All of the following items will be permanently erased:
                                        </p>
                                        <ul className="text-xs font-medium text-red-700 space-y-1.5 mb-6 list-disc list-inside">
                                            <li>Your player profile and gamer tag</li>
                                            <li>Complete purchase history and digital receipts</li>
                                            <li>Your GameVault game library and licenses</li>
                                            <li>Your saved wishlist and personal preferences</li>
                                        </ul>
                                        <button
                                            onClick={() => { playMechanicalClick(); handleDeleteAccount(); }}
                                            disabled={loading}
                                            onMouseEnter={() => playHoverTick()}
                                            className="btn-tactile w-full bg-red-600 border-4 border-neutral-900 text-white py-3.5 text-xs font-display font-black tracking-wider uppercase shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-base">delete_forever</span>
                                            {loading ? "Deleting Account..." : "Permanently Delete My Account"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
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
