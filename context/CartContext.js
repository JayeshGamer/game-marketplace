"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart data from Firestore when user logs in
    useEffect(() => {
        const fetchCart = async () => {
            if (!user) {
                setCartItems([]);
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().cart) {
                    setCartItems(docSnap.data().cart);
                } else {
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Error fetching cart from Firestore:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user]);

    // Helper to sync local state changes back to Firestore
    const syncCartToFirestore = async (newCartItems) => {
        setCartItems(newCartItems); // Optimistic UI update
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, { cart: newCartItems }, { merge: true });
            } catch (error) {
                console.error("Error syncing cart to Firestore:", error);
            }
        }
    };

    const addToCart = async (game) => {
        // Prevent duplicates
        if (cartItems.some((item) => item.id === game.id)) return;

        const newCartItems = [...cartItems, game];
        await syncCartToFirestore(newCartItems);
    };

    const removeFromCart = async (gameId) => {
        const newCartItems = cartItems.filter((item) => item.id !== gameId);
        await syncCartToFirestore(newCartItems);
    };

    const clearCart = async () => {
        await syncCartToFirestore([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};
