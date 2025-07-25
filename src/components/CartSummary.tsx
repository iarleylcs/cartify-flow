import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, X, Sparkles } from 'lucide-react';
import { Cart } from '@/types/product';

interface CartSummaryProps {
  cart: Cart;
  onSubmit: () => void;
  isSubmitting: boolean;
  onRemoveFromCart?: (codprod: number) => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ 
  cart, 
  onSubmit, 
  isSubmitting,
  onRemoveFromCart 
}) => {
  if (cart.items.length === 0) {
    return (
      <Card className="sticky top-6 bg-gradient-to-br from-card/95 to-muted/20 backdrop-blur-sm border-border/60 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="relative">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <Sparkles className="h-6 w-6 text-accent absolute -top-2 -right-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Carrinho Vazio</h3>
          <p className="text-muted-foreground text-sm">Adicione produtos incríveis ao seu carrinho!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-6 bg-gradient-to-br from-card/95 to-primary/5 backdrop-blur-sm border-border/60 shadow-elegant">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Meu Carrinho
          </span>
          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
          {cart.items.map((item) => (
            <div
              key={item.codprod}
              className="group relative flex items-start p-4 bg-gradient-to-r from-background/80 to-primary/5 rounded-xl border border-border/40 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground mb-2 leading-tight">
                  {item.descrprod}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
                    #{item.codprod}
                  </Badge>
                  {item.codvol && (
                    <Badge variant="secondary" className="text-xs">
                      {item.codvol}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Package className="h-3 w-3" />
                    <span className="font-medium">{item.quantity}x</span>
                    <span>R$ {item.price.toFixed(2)}</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    R$ {item.total.toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Remove Button */}
              {onRemoveFromCart && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFromCart(item.codprod)}
                  className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10">
            <span className="text-xl font-bold text-foreground">Total Geral:</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              R$ {cart.total.toFixed(2)}
            </span>
          </div>

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || cart.items.length === 0}
            className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <div className="flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Enviando Pedido...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Finalizar Pedido
                </>
              )}
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};