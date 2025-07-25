import React, { useState, useMemo } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { CartSummary } from '@/components/CartSummary';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { products, loading, error, refetch } = useProducts();
  const { cart, addToCart, updateQuantity, updatePrice, removeFromCart, clearCart, getCartItem } = useCart();
  const { toast } = useToast();

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    const term = searchTerm.toLowerCase().trim();
    return products.filter(product => 
      product.descrprod?.toLowerCase().includes(term) ||
      product.codprod.toString().includes(term)
    );
  }, [products, searchTerm]);

  const handleSubmitCart = async () => {
    if (cart.items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de submeter o pedido",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare payload for webhook
      const payload = cart.items.map(item => ({
        codprod: item.codprod,
        descrprod: item.descrprod,
        codvol: item.codvol,
        quantidade: item.quantity,
        valor_unitario: item.price,
        total: item.total
      }));

      const response = await fetch('https://n8neditor.ilftech.com.br/webhook-test/lovable-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Success
      toast({
        title: "Pedido criado",
        description: "Seu pedido foi enviado com sucesso!",
        variant: "default",
      });

      clearCart();
    } catch (error) {
      console.error('Error submitting cart:', error);
      toast({
        title: "Erro ao enviar pedido",
        description: "Houve um problema ao enviar seu pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg font-medium text-foreground">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-foreground">Erro ao carregar produtos</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refetch} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Seleção de Produtos
            </h1>
            <p className="text-muted-foreground text-lg">
              Escolha seus produtos e adicione ao carrinho
            </p>
          </div>
          
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar produtos por nome ou código..."
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Tente buscar por outro termo' 
                    : 'Não há produtos disponíveis no momento'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.codprod}
                    product={product}
                    cartItem={getCartItem(product.codprod)}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    onUpdatePrice={updatePrice}
                    onRemoveFromCart={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              cart={cart}
              onSubmit={handleSubmitCart}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
