import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Buscar produtos por nome ou código..."
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto px-2 sm:px-0">
      <Search className="absolute left-4 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-11 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base shadow-soft focus:shadow-elegant transition-all duration-300"
      />
    </div>
  );
};