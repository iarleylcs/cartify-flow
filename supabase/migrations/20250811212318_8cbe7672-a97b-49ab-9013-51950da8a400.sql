-- Add RLS policies for other tables that currently have RLS enabled but no policies

-- Políticas para a tabela Reunioes
CREATE POLICY "Only authenticated users can access reunioes"
ON public."Reunioes"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Deny anonymous access to reunioes"
ON public."Reunioes"
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Políticas para a tabela documents
CREATE POLICY "Only authenticated users can access documents"
ON public.documents
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Deny anonymous access to documents"
ON public.documents
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Políticas para a tabela registros_rodizio
CREATE POLICY "Only authenticated users can access registros_rodizio"
ON public.registros_rodizio
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Deny anonymous access to registros_rodizio"
ON public.registros_rodizio
FOR ALL
TO anon
USING (false)
WITH CHECK (false);