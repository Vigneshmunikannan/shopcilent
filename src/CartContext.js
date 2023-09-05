import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    // Update to use an object to track quantities for each item
    const [productQuantities, setProductQuantities] = useState({});
  console.log(cart)
    const addToCart = (item, quantity) => {
        // Check if the item is already in the cart
        const itemIndex = cart.findIndex((cartItem) => cartItem.itemName === item.itemName);
    
        if (itemIndex !== -1) {
            // Item is already in the cart, update the quantity
            const updatedCart = [...cart];
            updatedCart[itemIndex] = {
                ...updatedCart[itemIndex],
                quantity: updatedCart[itemIndex].quantity + quantity,
            };
            setCart(updatedCart);
        } else {
            // Item is not in the cart, add it with the specified quantity
            setCart((prevCart) => [
                ...prevCart,
                {
                    ...item,
                    quantity: quantity,
                },
            ]);
        }
    };
    

    const removeFromCart = (item) => {
        setCart((prevCart) => prevCart.filter((cartItem) => cartItem !== item));
        setProductQuantities((prevQuantities) => {
            const updatedQuantities = { ...prevQuantities };
            delete updatedQuantities[item.itemName];
            return updatedQuantities;
        });
    };

    return (
        <CartContext.Provider value={{ cart, productQuantities, addToCart, removeFromCart ,setCart}}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}