import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      console.log('🔍 Iniciando busca de produtos...');
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('codprod, descrprod, codvol, preco')
        .order('descrprod', { ascending: true });

      console.log('📦 Resposta do Supabase:', { data, error: fetchError });

      if (fetchError) {
        console.error('❌ Erro na consulta:', fetchError);
        throw fetchError;
      }

      console.log('✅ Produtos carregados:', data?.length || 0);
      setProducts(data || []);
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('Erro ao carregar produtos');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};