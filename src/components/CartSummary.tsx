import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';
import { Cart } from '@/types/product';

interface CartSummaryProps {
  cart: Cart;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onSubmit,
  isSubmitting
}) => {
  if (cart.items.length === 0) {
    return (
      <Card className="sticky top-6 bg-card/95 backdrop-blur-sm border-border/60">
        <CardContent className="p-6 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Seu carrinho está vazio</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6 bg-card/95 backdrop-blur-sm border-border/60 shadow-elegant">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5" />
          Carrinho de Compras
          <Badge variant="secondary" className="ml-auto">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {cart.items.map((item) => (
            <div
              key={item.codprod}
              className="flex justify-between items-start p-3 bg-gradient-subtle rounded-lg border border-border/40"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate text-foreground">
                  {item.descrprod}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    #{item.codprod}
                  </Badge>
                  {item.codvol && (
                    <span className="text-xs text-muted-foreground">
                      Vol: {item.codvol}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Package className="h-3 w-3" />
                  <span>{item.quantity}x</span>
                  <span>R$ {item.price.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-sm font-bold text-primary ml-2">
                R$ {item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-foreground">Total Geral:</span>
            <span className="text-2xl font-bold text-primary">
              R$ {cart.total.toFixed(2)}
            </span>
          </div>

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || cart.items.length === 0}
            className="w-full"
            variant="premium"
            size="lg"
          >
            {isSubmitting ? 'Enviando...' : 'Submeter Pedido'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};