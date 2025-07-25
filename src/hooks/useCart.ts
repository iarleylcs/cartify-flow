import { useState, useCallback } from 'react';
import { Product, CartItem, Cart } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const { toast } = useToast();

  const calculateTotal = useCallback((items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, []);

  const addToCart = useCallback((product: Product) => {
    if (!product.descrprod) {
      toast({
        title: "Erro",
        description: "Produto inválido",
        variant: "destructive",
      });
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.codprod === product.codprod);
      
      if (existingItem) {
        return prevCart; // Item already in cart
      }

      const newItem: CartItem = {
        codprod: product.codprod,
        descrprod: product.descrprod,
        codvol: product.codvol,
        quantity: 1,
        price: product.preco || 0,
        total: product.preco || 0,
      };

      const newItems = [...prevCart.items, newItem];
      
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });

    toast({
      title: "Produto adicionado",
      description: `${product.descrprod} foi adicionado ao carrinho`,
    });
  }, [calculateTotal, toast]);

  const updateQuantity = useCallback((codprod: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(codprod);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.codprod === codprod
          ? { ...item, quantity, total: quantity * item.price }
          : item
      );

      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  }, [calculateTotal]);

  const updatePrice = useCallback((codprod: number, price: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.codprod === codprod
          ? { ...item, price, total: item.quantity * price }
          : item
      );

      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  }, [calculateTotal]);

  const removeFromCart = useCallback((codprod: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.codprod !== codprod);
      
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });

    toast({
      title: "Produto removido",
      description: "O produto foi removido do carrinho",
    });
  }, [calculateTotal, toast]);

  const clearCart = useCallback(() => {
    setCart({ items: [], total: 0 });
  }, []);

  const getCartItem = useCallback((codprod: number): CartItem | undefined => {
    return cart.items.find(item => item.codprod === codprod);
  }, [cart.items]);

  return {
    cart,
    addToCart,
    updateQuantity,
    updatePrice,
    removeFromCart,
    clearCart,
    getCartItem,
  };
};