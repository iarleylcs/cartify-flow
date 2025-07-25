import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart, Package, DollarSign, Hash } from 'lucide-react';
import { Product, CartItem } from '@/types/product';

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (codprod: number, quantity: number) => void;
  onUpdatePrice: (codprod: number, price: number) => void;
  onRemoveFromCart: (codprod: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartItem,
  onAddToCart,
  onUpdateQuantity,
  onUpdatePrice,
  onRemoveFromCart,
}) => {
  const [localQuantity, setLocalQuantity] = React.useState(cartItem?.quantity || 1);
  const [localPrice, setLocalPrice] = React.useState(cartItem?.price || product.preco || 0);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveFromCart(product.codprod);
      return;
    }
    setLocalQuantity(newQuantity);
    onUpdateQuantity(product.codprod, newQuantity);
  };

  const handlePriceChange = (newPrice: number) => {
    setLocalPrice(newPrice);
    onUpdatePrice(product.codprod, newPrice);
  };

  return (
    <Card className="group w-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-border/60 bg-gradient-to-br from-card/95 to-primary/5 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-5">
          {/* Product Header */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <h3 className="font-bold text-base sm:text-xl leading-tight text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {product.descrprod}
              </h3>
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-xs shrink-0">
                <Hash className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                {product.codprod}
              </Badge>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              {product.codvol && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-secondary/50 text-xs">
                  <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {product.codvol}
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1 bg-accent/10 border-accent/30 text-foreground text-xs">
                <DollarSign className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                R$ {product.preco?.toFixed(2) || '0.00'}
              </Badge>
            </div>
          </div>

          {/* Cart Controls */}
          {cartItem ? (
            <div className="space-y-3 sm:space-y-5 p-3 sm:p-5 bg-gradient-to-br from-background/80 to-secondary/20 rounded-xl border border-border/50 shadow-inner">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  <ShoppingCart className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                  No carrinho
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFromCart(product.codprod)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200 text-xs sm:text-sm h-6 sm:h-8 px-2 sm:px-3"
                >
                  Remover
                </Button>
              </div>
              
              {/* Quantity Controls */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1 sm:gap-2">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                  Quantidade
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(localQuantity - 1)}
                    className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors duration-200"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={localQuantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                    className="w-16 sm:w-24 text-center font-semibold text-sm sm:text-lg bg-background/80"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(localQuantity + 1)}
                    className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors duration-200"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              {/* Price Input */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1 sm:gap-2">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  Valor Unitário (R$)
                </label>
                <Input
                  type="number"
                  value={localPrice}
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="w-full text-sm sm:text-lg font-semibold bg-background/80"
                />
              </div>

              {/* Total */}
              <div className="pt-3 sm:pt-4 border-t border-border/50">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                  <span className="text-sm sm:text-lg font-bold text-foreground">Total:</span>
                  <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    R$ {(localQuantity * localPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => onAddToCart(product)}
              className="w-full text-sm sm:text-lg py-4 sm:py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                Adicionar ao Carrinho
              </div>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};