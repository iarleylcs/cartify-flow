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
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Product Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-xl leading-tight text-foreground group-hover:text-primary transition-colors duration-200">
                {product.descrprod}
              </h3>
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                <Hash className="h-3 w-3 mr-1" />
                {product.codprod}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              {product.codvol && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-secondary/50">
                  <Package className="h-3 w-3" />
                  {product.codvol}
                </Badge>
              )}
              <Badge variant="outline" className="flex items-center gap-1 bg-accent/10 border-accent/30 text-accent-foreground">
                <DollarSign className="h-3 w-3" />
                R$ {product.preco?.toFixed(2) || '0.00'}
              </Badge>
            </div>
          </div>

          {/* Cart Controls */}
          {cartItem ? (
            <div className="space-y-5 p-5 bg-gradient-to-br from-background/80 to-secondary/20 rounded-xl border border-border/50 shadow-inner">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  No carrinho
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFromCart(product.codprod)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                >
                  Remover
                </Button>
              </div>
              
              {/* Quantity Controls */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Quantidade
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(localQuantity - 1)}
                    className="h-10 w-10 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={localQuantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                    className="w-24 text-center font-semibold text-lg bg-background/80"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(localQuantity + 1)}
                    className="h-10 w-10 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Valor Unitário (R$)
                </label>
                <Input
                  type="number"
                  value={localPrice}
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="w-full text-lg font-semibold bg-background/80"
                />
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                  <span className="text-lg font-bold text-foreground">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    R$ {(localQuantity * localPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => onAddToCart(product)}
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Adicionar ao Carrinho
              </div>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};