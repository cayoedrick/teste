import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Edit2, Trash2 } from 'lucide-react';

export default function Categorias() {
  const { categorias } = useData();
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('despesa');

  const categoriasFiltradas = categorias.filter(c => c.tipo === tipo).sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="space-y-6 pt-4">
      <div className="flex bg-tertiary rounded-[16px] p-1">
        <button 
          onClick={() => setTipo('receita')}
          className={`flex-1 py-2 rounded-[12px] font-medium transition-colors ${tipo === 'receita' ? 'bg-primary text-general shadow-sm' : 'text-discreto'}`}
        >
          Receitas
        </button>
        <button 
          onClick={() => setTipo('despesa')}
          className={`flex-1 py-2 rounded-[12px] font-medium transition-colors ${tipo === 'despesa' ? 'bg-primary text-general shadow-sm' : 'text-discreto'}`}
        >
          Despesas
        </button>
      </div>

      <div className="space-y-3 pb-8">
        {categoriasFiltradas.length === 0 ? (
          <p className="text-center text-discreto py-8">Nenhuma categoria cadastrada.</p>
        ) : (
          categoriasFiltradas.map(c => (
            <div key={c.id} className="card-flat p-4 flex items-center justify-between">
              <span className="font-medium">{c.nome}</span>
              <div className="flex gap-2">
                <button className="p-2 text-discreto hover:text-general transition-colors">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 text-discreto hover:text-[var(--color-despesa)] transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
