import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../lib/utils';
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { contas, cartoes, lancamentos, reservas } = useData();
  const [viewType, setViewType] = useState<'contas' | 'cartoes'>('contas');
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const currentLancamentos = useMemo(() => {
    return lancamentos.filter(l => {
      const d = parseISO(l.data);
      return isSameMonth(d, currentDate) && isSameYear(d, currentDate);
    });
  }, [lancamentos, currentDate]);

  // Contas view logic
  const saldoAtual = contas.reduce((acc, c) => acc + c.saldoInicial, 0) + 
                     lancamentos.filter(l => l.efetivado && (l.tipo === 'receita' || l.tipo === 'despesa'))
                     .reduce((acc, l) => acc + (l.tipo === 'receita' ? l.valor : -l.valor), 0);
                     
  const previsaoSaldo = saldoAtual + currentLancamentos.filter(l => !l.efetivado && (l.tipo === 'receita' || l.tipo === 'despesa'))
                     .reduce((acc, l) => acc + (l.tipo === 'receita' ? l.valor : -l.valor), 0);

  const reservado = reservas.reduce((acc, r) => acc + r.saldo, 0);

  const receitas = currentLancamentos.filter(l => l.tipo === 'receita').reduce((a, b) => a + b.valor, 0);
  const despesas = currentLancamentos.filter(l => l.tipo === 'despesa').reduce((a, b) => a + b.valor, 0);

  // Cartoes view logic
  const valorFaturas = currentLancamentos.filter(l => l.tipo === 'despesa_cartao' && !l.estornoAjuste).reduce((a,b) => a+b.valor, 0);

  return (
    <div className="space-y-6 pt-4">
      {/* Seletor de Contas / Cartões */}
      <div className="flex bg-tertiary rounded-[16px] p-1">
        <button 
          onClick={() => setViewType('contas')}
          className={`flex-1 py-2 rounded-[12px] font-medium transition-colors ${viewType === 'contas' ? 'bg-primary text-general shadow-sm' : 'text-discreto'}`}
        >
          Contas
        </button>
        <button 
          onClick={() => setViewType('cartoes')}
          className={`flex-1 py-2 rounded-[12px] font-medium transition-colors ${viewType === 'cartoes' ? 'bg-primary text-general shadow-sm' : 'text-discreto'}`}
        >
          Cartões
        </button>
      </div>

      {viewType === 'contas' ? (
        <div className="card-flat p-6 flex flex-col gap-6 bg-gradient-to-br from-card-gradient-start to-card-gradient-end">
          <div>
            <h3 className="text-discreto text-sm font-medium uppercase tracking-wider">Saldo Total</h3>
            <p className="text-4xl font-mono font-bold mt-1">{formatCurrency(saldoAtual)}</p>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <div>
              <h4 className="text-discreto text-xs uppercase tracking-wider font-semibold">Previsão Saldo</h4>
              <p className="font-mono font-medium text-sm mt-1">{formatCurrency(previsaoSaldo)}</p>
            </div>
            <div className="text-right">
              <h4 className="text-discreto text-xs uppercase tracking-wider font-semibold">Reservado</h4>
              <p className="font-mono font-medium text-sm mt-1 text-[var(--color-transferencia)]">{formatCurrency(reservado)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-flat p-6 flex flex-col gap-6 bg-gradient-to-br from-card-gradient-start to-card-gradient-end">
          <div>
            <h3 className="text-discreto text-sm font-medium uppercase tracking-wider">Valor das faturas</h3>
            <p className="text-4xl font-mono font-bold mt-1 text-[var(--color-cartao)]">{formatCurrency(valorFaturas)}</p>
          </div>
          <button className="button-flat w-full bg-secondary py-3 font-medium">
            Confirmar pagamento
          </button>
        </div>
      )}

      {/* Seletor de Mês/Ano */}
      <div className="flex items-center justify-between px-4">
        <button onClick={prevMonth} className="p-2 text-discreto hover:text-general active:scale-95 transition-all">
          <ChevronLeft size={24} />
        </button>
        <span className="font-medium text-lg capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </span>
        <button onClick={nextMonth} className="p-2 text-discreto hover:text-general active:scale-95 transition-all">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Receitas / Despesas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card-flat p-4 flex flex-col items-center justify-center">
          <span className="text-discreto text-xs uppercase tracking-wider font-semibold">Receitas</span>
          <span className="text-[var(--color-receita)] font-mono font-bold text-xl mt-1">+{formatCurrency(receitas)}</span>
        </div>
        <div className="card-flat p-4 flex flex-col items-center justify-center">
          <span className="text-discreto text-xs uppercase tracking-wider font-semibold">Despesas</span>
          <span className="text-[var(--color-despesa)] font-mono font-bold text-xl mt-1">-{formatCurrency(despesas)}</span>
        </div>
      </div>

      {/* Lista de Lancamentos */}
      <div className="space-y-4 pb-8">
        <h3 className="font-semibold px-2">Lançamentos</h3>
        {currentLancamentos.length === 0 ? (
          <p className="text-center text-discreto py-8">Nenhum lançamento neste período.</p>
        ) : (
          <div className="space-y-3">
            {currentLancamentos.map(l => (
              <div key={l.id} className="card-flat p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{l.descricao}</p>
                  <p className="text-xs text-discreto mt-1">{format(parseISO(l.data), 'dd MMM', { locale: ptBR })}</p>
                </div>
                <span className={`font-mono font-medium ${l.tipo === 'receita' ? 'text-[var(--color-receita)]' : l.tipo === 'transferencia' ? 'text-[var(--color-transferencia)]' : 'text-[var(--color-despesa)]'}`}>
                  {l.tipo === 'receita' ? '+' : l.tipo === 'transferencia' ? '' : '-'}{formatCurrency(l.valor)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

