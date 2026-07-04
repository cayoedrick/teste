import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../lib/utils';
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function Extrato() {
  const { lancamentos } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'receita' | 'despesa' | 'transferencia'>('todos');

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const filteredLancamentos = useMemo(() => {
    return lancamentos.filter(l => {
      const d = parseISO(l.data);
      const isSameDate = isSameMonth(d, currentDate) && isSameYear(d, currentDate);
      if (!isSameDate) return false;
      
      if (filtroTipo === 'todos') return true;
      if (filtroTipo === 'receita') return l.tipo === 'receita';
      if (filtroTipo === 'transferencia') return l.tipo === 'transferencia';
      return l.tipo === 'despesa' || l.tipo === 'despesa_cartao';
    }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [lancamentos, currentDate, filtroTipo]);

  const totalEntradas = filteredLancamentos.filter(l => l.tipo === 'receita').reduce((a, b) => a + b.valor, 0);
  const totalSaidas = filteredLancamentos.filter(l => l.tipo === 'despesa' || l.tipo === 'despesa_cartao').reduce((a, b) => a + b.valor, 0);

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 text-discreto hover:text-general active:scale-95 transition-all">
            <ChevronLeft size={24} />
          </button>
          <span className="font-medium text-lg capitalize w-32 text-center">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button onClick={nextMonth} className="p-2 text-discreto hover:text-general active:scale-95 transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-secondary text-general' : 'text-discreto'}`}
        >
          <Filter size={20} />
        </button>
      </div>

      {showFilters && (
        <div className="card-flat p-4 space-y-4">
          <div className="flex bg-tertiary rounded-[12px] p-1 overflow-x-auto scrollbar-hide">
            {(['todos', 'receita', 'despesa', 'transferencia'] as const).map(t => (
              <button 
                key={t}
                onClick={() => setFiltroTipo(t)}
                className={`flex-1 py-2 px-3 rounded-[10px] text-sm font-medium transition-colors whitespace-nowrap capitalize ${filtroTipo === t ? 'bg-primary text-general shadow-sm' : 'text-discreto'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="card-flat p-4 flex flex-col items-center justify-center border-b-2" style={{ borderBottomColor: 'var(--color-receita)'}}>
          <span className="text-discreto text-sm">Entradas</span>
          <span className="text-[var(--color-receita)] font-mono font-semibold mt-1">{formatCurrency(totalEntradas)}</span>
        </div>
        <div className="card-flat p-4 flex flex-col items-center justify-center border-b-2" style={{ borderBottomColor: 'var(--color-despesa)'}}>
          <span className="text-discreto text-sm">Saídas</span>
          <span className="text-[var(--color-despesa)] font-mono font-semibold mt-1">{formatCurrency(totalSaidas)}</span>
        </div>
      </div>

      <div className="space-y-3 pb-8">
        {filteredLancamentos.length === 0 ? (
          <p className="text-center text-discreto py-8">Nenhum lançamento encontrado.</p>
        ) : (
          filteredLancamentos.map(l => (
            <div key={l.id} className="card-flat p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{l.descricao}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-discreto">{format(parseISO(l.data), 'dd MMM', { locale: ptBR })}</span>
                  {l.categoriaId && <span className="tag-flat bg-tertiary text-discreto">Categoria</span>}
                </div>
              </div>
              <span className={`font-mono font-medium ${l.tipo === 'receita' ? 'text-[var(--color-receita)]' : l.tipo === 'transferencia' ? 'text-[var(--color-transferencia)]' : 'text-[var(--color-despesa)]'}`}>
                {l.tipo === 'receita' ? '+' : l.tipo === 'transferencia' ? '' : '-'}{formatCurrency(l.valor)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
