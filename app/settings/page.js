"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
            // Reauthenticate first
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            
            // Update password
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
            // Reauthenticate first
            const credential = EmailAuthProvider.credential(user.email, emailPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            
            // Update email
            await updateEmail(auth.currentUser, newEmail);
            
            showMessage("success", "Email updated successfully. Please verify your new email.");
            setEmailPassword("");
        } catch (error) {
            console.error("Email update error:", error);
            if (error.code === "auth/wrong-password") {
                showMessage("error", "Password is incorrect");
            } else if (error.code === "auth/email-already-in-use") {
                showMessage("error", "This email is already in use");
            } else {
                showMessage("error", error.message || "Failed to update email");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone. Are you absolutely sure?")) {
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
                showMessage("error", "Please log out and log back in before deleting your account");
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

    return (
        <div className="min-h-screen bg-[#f4f4f5] text-neutral-900 font-display pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="border-b-4 border-neutral-900 pb-8 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-neutral-900 border-4 border-neutral-900 flex items-center justify-center shadow-[4px_4px_0_#ff4500]">
                            <span className="material-symbols-outlined text-2xl text-primary">settings</span>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Settings</h1>
                            <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-neutral-500 mt-1">Account Configuration</p>
                        </div>
                    </div>
                </div>

                {/* Message Banner */}
                {message.text && (
                    <div className={`border-4 p-4 mb-6 flex items-center gap-3 ${
                        message.type === "success" 
                            ? "bg-green-50 border-green-500" 
                            : "bg-red-50 border-red-500"
                    }`} style={{ animation: "slideInUp 0.3s ease-out" }}>
                        <span className={`material-symbols-outlined text-xl ${
                            message.type === "success" ? "text-green-500" : "text-red-500"
                        }`}>
                            {message.type === "success" ? "check_circle" : "error"}
                        </span>
                        <p className="text-sm font-bold">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white border-4 border-neutral-900 shadow-[6px_6px_0_#171717] overflow-hidden sticky top-24">
                            <div className="bg-neutral-900 px-4 py-3 border-b-4 border-neutral-900">
                                <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white">Navigation</span>
                            </div>
                            <nav className="divide-y-2 divide-neutral-100">
                                {[
                                    { id: "profile", label: "Profile", icon: "person" },
                                    { id: "security", label: "Security", icon: "lock" },
                                    { id: "email", label: "Email", icon: "mail" },
                                    { id: "danger", label: "Danger Zone", icon: "warning" },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`btn-tactile w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${
                                            activeTab === tab.id
                                                ? "bg-primary text-neutral-900 font-black shadow-[inset_4px_0_0_#171717]"
                                                : "text-neutral-600 hover:bg-neutral-50 font-bold"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-base">{tab.icon}</span>
                                        <span className="text-[10px] tracking-widest uppercase">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717]">
                                <div className="bg-neutral-900 px-6 py-4 border-b-4 border-neutral-900">
                                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white">Profile Information</h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center gap-4 pb-6 border-b-4 border-neutral-900">
                                        <div className="w-20 h-20 bg-primary border-4 border-neutral-900 flex items-center justify-center shadow-[4px_4px_0_#171717]">
                                            <span className="material-symbols-outlined text-4xl text-neutral-900">person</span>
                                        </div>
                                        <div>
                                            <p className="text-xl font-black uppercase tracking-tight">{user.displayName || "User"}</p>
                                            <p className="text-[10px] font-mono font-bold text-neutral-500">{user.email}</p>
                                            <p className="text-[8px] font-bold tracking-widest uppercase text-neutral-400 mt-1">
                                                UID: {user.uid.slice(0, 12)}...
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black tracking-widest uppercase text-neutral-600 mb-2">
                                                Display Name
                                            </label>
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="w-full bg-neutral-100 border-4 border-neutral-900 px-4 py-3 text-sm font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div className="bg-neutral-100 border-2 border-dashed border-neutral-300 p-4">
                                            <p className="text-[9px] font-bold text-neutral-600 leading-relaxed">
                                                <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                                                Display name changes will be reflected across your profile and orders.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717]">
                                <div className="bg-neutral-900 px-6 py-4 border-b-4 border-neutral-900">
                                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white">Change Password</h2>
                                </div>
                                <form onSubmit={handleChangePassword} className="p-8 space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black tracking-widest uppercase text-neutral-600 mb-2">
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
                                        <label className="block text-[10px] font-black tracking-widest uppercase text-neutral-600 mb-2">
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
                                        <label className="block text-[10px] font-black tracking-widest uppercase text-neutral-600 mb-2">
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
                                        className="btn-tactile w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-4 text-[11px] font-black tracking-[0.25em] uppercase shadow-[6px_6px_0_#171717] hover:shadow-[8px_8px_0_#171717] disabled:opacity-50"
                                    >
                                        {loading ? "Updating..." : "Update Password"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Email Tab */}
                        {activeTab === "email" && (
                            <div className="bg-white border-4 border-neutral-900 shadow-[8px_8px_0_#171717]">
                                <div className="bg-neutral-900 px-6 py-4 border-b-4 border-neutral-900">
                                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white">Change Email Address</h2>
                                </div>
                                <form onSubmit={handleChangeEmail} className="p-8 space-y-6">
                                    <div className="bg-neutral-100 border-2 border-neutral-300 p-4">
                                        <p className="text-[9px] font-bold text-neutral-600">
                                            <span className="font-black uppercase tracking-wider">Current Email:</span> {user.email}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black tracking-widest uppercase text-neutral-600 mb-2">
                                            New Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            required
                                            className="w-full bg-neutral-100 border-4 border-neutral-900 px-4 py-3 text-sm font-mono focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#ff4500] transition-all"
                                            placeholder="newmail@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black tracking-widest uppercase text-neutral-600 mb-2">
                                            Confirm Password
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
                                        className="btn-tactile w-full bg-primary border-4 border-neutral-900 text-neutral-900 py-4 text-[11px] font-black tracking-[0.25em] uppercase shadow-[6px_6px_0_#171717] hover:shadow-[8px_8px_0_#171717] disabled:opacity-50"
                                    >
                                        {loading ? "Updating..." : "Update Email"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Danger Zone Tab */}
                        {activeTab === "danger" && (
                            <div className="bg-white border-4 border-red-500 shadow-[8px_8px_0_#dc2626]">
                                <div className="bg-red-500 px-6 py-4 border-b-4 border-red-600">
                                    <h2 className="text-[11px] font-black tracking-[0.3em] uppercase text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">warning</span>
                                        Danger Zone
                                    </h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="bg-red-50 border-2 border-red-200 p-6">
                                        <h3 className="text-sm font-black uppercase tracking-tight mb-2 text-red-900">Delete Account</h3>
                                        <p className="text-[10px] font-bold text-red-700 leading-relaxed mb-4">
                                            Once you delete your account, there is no going back. This will permanently delete:
                                        </p>
                                        <ul className="text-[9px] font-bold text-red-600 space-y-1 mb-4 list-disc list-inside">
                                            <li>Your profile and account information</li>
                                            <li>Purchase history and order records</li>
                                            <li>Game library and wishlist</li>
                                            <li>All associated data</li>
                                        </ul>
                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={loading}
                                            className="btn-tactile w-full bg-red-500 border-4 border-red-700 text-white py-4 text-[11px] font-black tracking-[0.25em] uppercase shadow-[4px_4px_0_#7f1d1d] hover:shadow-[6px_6px_0_#7f1d1d] disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">delete_forever</span>
                                            {loading ? "Deleting..." : "Delete Account Permanently"}
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
