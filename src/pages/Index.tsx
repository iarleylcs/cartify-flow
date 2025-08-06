import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { CartSummary } from '@/components/CartSummary';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, AlertCircle, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [n8nSessionId, setN8nSessionId] = useState<string | null>(null);
  const PRODUCTS_PER_PAGE = 4;
  
  const { products, loading, error, refetch } = useProducts();
  const { cart, addToCart, updateQuantity, updatePrice, removeFromCart, clearCart, getCartItem } = useCart();
  const { toast } = useToast();

  // Capturar o chatId da URL quando a página carrega
  useEffect(() => {
    const chatId = searchParams.get('chatId');
    if (chatId) {
      setN8nSessionId(chatId);
      console.log('🔗 ChatId capturado da URL:', chatId);
    }
  }, [searchParams]);

  console.log('🏠 Estado da página:', { 
    productsCount: products.length, 
    loading, 
    error, 
    searchTerm 
  });

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = products.filter(product => 
      product.descrprod?.toLowerCase().includes(term) ||
      product.codprod.toString().includes(term)
    );
    return filtered;
  }, [products, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    setShowConfirmDialog(false);
    
    try {
      // 1. Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          total_amount: cart.total
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = cart.items.map(item => ({
        order_id: order.id,
        product_code: item.codprod,
        product_description: item.descrprod,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Send to webhooks with retry logic
      let webhookSuccess = false;
      const webhookPayload = {
        chatId: n8nSessionId,
        order_code: order.order_code,
        total_amount: cart.total,
        items: cart.items.map(item => ({
          codprod: item.codprod,
          descrprod: item.descrprod,
          codvol: item.codvol,
          quantidade: item.quantity,
          valor_unitario: item.price,
          total: item.total
        }))
      };

      console.log('📤 Enviando para webhooks:', webhookPayload);

      // Send to both webhooks in parallel
      const webhookPromises = [
        fetch('https://n8nwebhook.ilftech.com.br/webhook/lovable-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        }),
        fetch('https://n8neditor.ilftech.com.br/webhook-waiting/8458', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })
      ];

      try {
        const responses = await Promise.allSettled(webhookPromises);
        
        responses.forEach((result, index) => {
          const webhookName = index === 0 ? 'webhook principal' : 'webhook editor';
          if (result.status === 'fulfilled') {
            console.log(`📥 Resposta do ${webhookName}:`, result.value.status, result.value.statusText);
            if (result.value.ok) {
              webhookSuccess = true;
              console.log(`✅ ${webhookName} enviado com sucesso`);
            } else {
              console.warn(`⚠️ ${webhookName} retornou erro:`, result.value.status);
            }
          } else {
            console.error(`❌ Erro no ${webhookName}:`, result.reason);
          }
        });
      } catch (webhookError) {
        console.error('❌ Erro geral nos webhooks:', webhookError);
        // Continue mesmo com erro nos webhooks
      }

      // Success message
      toast({
        title: "Pedido criado com sucesso! 🎉",
        description: `Seu pedido foi processado${webhookSuccess ? '' : ' (webhook com erro)'}`,
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-6 p-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <Sparkles className="h-6 w-6 text-accent absolute -top-2 -right-2 animate-pulse" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">Carregando produtos...</p>
            <p className="text-sm text-muted-foreground">Preparando a melhor experiência para você</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Ops! Algo deu errado</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="w-full">
            <Package className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border/60 sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="text-center mb-4 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-xl sm:rounded-2xl">
                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SmartPedido
              </h1>
              <div className="p-2 sm:p-3 bg-accent/10 rounded-xl sm:rounded-2xl">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-accent fill-current" />
              </div>
            </div>
            <p className="text-muted-foreground text-base sm:text-xl max-w-2xl mx-auto px-4">
              Selecione os produtos para o pedido
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="🔍 Buscar produtos por nome ou código..."
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8">
          {/* Products List */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-8">
            {/* Products Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Nossos Produtos</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {totalPages > 1 && (
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
              )}
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-card/50 rounded-2xl border border-border/50 mx-2 sm:mx-0">
                <div className="max-w-md mx-auto space-y-4 px-4">
                  <div className="p-3 sm:p-4 bg-muted/50 rounded-full w-fit mx-auto">
                    <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                    {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {searchTerm 
                      ? 'Tente buscar por outro termo ou navegue por todas as categorias' 
                      : 'Estamos preparando novos produtos incríveis para você!'
                    }
                  </p>
                  {searchTerm && (
                    <Button 
                      onClick={() => setSearchTerm('')} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Ver todos os produtos
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  {paginatedProducts.map((product) => (
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {(() => {
                          const maxVisiblePages = 3;
                          const pages = [];
                          
                          if (totalPages <= maxVisiblePages) {
                            // Show all pages if total is less than or equal to max visible
                            for (let i = 1; i <= totalPages; i++) {
                              pages.push(
                                <PaginationItem key={i}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(i);
                                    }}
                                    isActive={currentPage === i}
                                  >
                                    {i}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                          } else {
                            // Always show first page
                            pages.push(
                              <PaginationItem key={1}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(1);
                                  }}
                                  isActive={currentPage === 1}
                                >
                                  1
                                </PaginationLink>
                              </PaginationItem>
                            );
                            
                            // Show current page if it's not first or last
                            if (currentPage > 2 && currentPage < totalPages - 1) {
                              if (currentPage > 3) {
                                pages.push(
                                  <PaginationItem key="dots1">
                                    <span className="px-4 py-2 text-sm text-muted-foreground">...</span>
                                  </PaginationItem>
                                );
                              }
                              pages.push(
                                <PaginationItem key={currentPage}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(currentPage);
                                    }}
                                    isActive={true}
                                  >
                                    {currentPage}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            } else if (currentPage === 2) {
                              // Show page 2 if current page is 2
                              pages.push(
                                <PaginationItem key={2}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(2);
                                    }}
                                    isActive={currentPage === 2}
                                  >
                                    2
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                            
                            // Show dots before last page if needed
                            if (currentPage < totalPages - 2) {
                              pages.push(
                                <PaginationItem key="dots2">
                                  <span className="px-4 py-2 text-sm text-muted-foreground">...</span>
                                </PaginationItem>
                              );
                            }
                            
                            // Always show last page if it's not page 1
                            if (totalPages > 1) {
                              pages.push(
                                <PaginationItem key={totalPages}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(totalPages);
                                    }}
                                    isActive={currentPage === totalPages}
                                  >
                                    {totalPages}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                          }
                          
                          return pages;
                        })()}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cart Summary */}
          <div className="xl:col-span-1">
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <CartSummary
                cart={cart}
                onSubmit={() => setShowConfirmDialog(true)}
                isSubmitting={isSubmitting}
                onRemoveFromCart={removeFromCart}
              />
              
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Confirmar Pedido
                  </AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div>
                      Tem certeza que deseja finalizar este pedido?
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total de itens:</span>
                            <span className="font-medium">{cart.items.length}</span>
                          </div>
                          <div className="flex justify-between text-lg font-bold">
                            <span>Valor total:</span>
                            <span className="text-primary">R$ {cart.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleSubmitCart}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Confirmar Pedido
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
