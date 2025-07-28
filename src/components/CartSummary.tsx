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
      <Card className="sticky top-4 sm:top-6 bg-gradient-to-br from-card/95 to-muted/20 backdrop-blur-sm border-border/60 shadow-lg">
        <CardContent className="p-6 sm:p-8 text-center flex items-center justify-center min-h-[280px] sm:min-h-[320px]">
          <div className="relative">
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-accent absolute -top-1 -right-4 sm:-top-2 sm:-right-6 animate-pulse" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Carrinho Vazio</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">Adicione produtos incríveis ao seu carrinho!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4 sm:top-6 bg-gradient-to-br from-card/95 to-primary/5 backdrop-blur-sm border-border/60 shadow-elegant">
      <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-sm sm:text-base">
            Meu Carrinho
          </span>
          <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20 text-xs">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'itens'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
        {/* Cart Items */}
        <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-72 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-primary/20">
          {cart.items.map((item) => (
            <div
              key={item.codprod}
              className="group relative flex items-start p-2.5 sm:p-4 bg-gradient-to-r from-background/80 to-primary/5 rounded-lg sm:rounded-xl border border-border/40 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-foreground mb-1.5 sm:mb-2 leading-tight line-clamp-2">
                  {item.descrprod}
                </h4>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
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
                  <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                    <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="font-medium">{item.quantity}x</span>
                    <span>R$ {item.price.toFixed(2)}</span>
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-primary">
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
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="pt-3 sm:pt-6 border-t border-border/50">
          <div className="flex justify-between items-center mb-3 sm:mb-6 p-2.5 sm:p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg sm:rounded-xl border border-primary/10">
            <span className="text-sm sm:text-xl font-bold text-foreground">Total Geral:</span>
            <span className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              R$ {cart.total.toFixed(2)}
            </span>
          </div>

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || cart.items.length === 0}
            className="w-full text-sm sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <div className="flex items-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="hidden sm:inline">Enviando Pedido...</span>
                  <span className="sm:hidden">Enviando...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Finalizar Pedido</span>
                  <span className="sm:hidden">Finalizar</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};