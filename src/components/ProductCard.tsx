import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
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
    <Card className="w-full transition-all duration-300 hover:shadow-elegant border-border/60 bg-card/95 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Product Info */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-lg leading-tight text-card-foreground">{product.descrprod}</h3>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md shrink-0">
                #{product.codprod}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {product.codvol && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">Volume:</span> {product.codvol}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="font-medium">Preço:</span> R$ {product.preco?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Cart Controls */}
          {cartItem ? (
            <div className="space-y-4 p-4 bg-gradient-subtle rounded-lg border border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">No carrinho</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFromCart(product.codprod)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Remover
                </Button>
              </div>
              
              {/* Quantity Controls */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantidade</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(localQuantity - 1)}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={localQuantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                    className="w-20 text-center"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(localQuantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Valor Unitário (R$)</label>
                <Input
                  type="number"
                  value={localPrice}
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="w-full"
                />
              </div>

              {/* Total */}
              <div className="pt-2 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    R$ {(localQuantity * localPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => onAddToCart(product)}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Adicionar ao Carrinho
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};