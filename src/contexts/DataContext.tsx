import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conta, Cartao, Categoria, Reserva, ReservaHistorico, Lancamento } from '../types';
import { CATEGORIAS_PADRAO_RECEITAS, CATEGORIAS_PADRAO_DESPESAS } from '../lib/utils';

interface DataContextType {
  contas: Conta[];
  cartoes: Cartao[];
  categorias: Categoria[];
  reservas: Reserva[];
  historicoReservas: ReservaHistorico[];
  lancamentos: Lancamento[];
  addConta: (conta: Omit<Conta, 'id'>) => void;
  addCartao: (cartao: Omit<Cartao, 'id'>) => void;
  addLancamento: (lancamento: Omit<Lancamento, 'id'>) => void;
  addReserva: (reserva: Omit<Reserva, 'id'>) => void;
  addReservaHistorico: (historico: Omit<ReservaHistorico, 'id'>) => void;
  updateReservaSaldo: (id: string, novoSaldo: number) => void;
  limparLancamentos: () => void;
  limparTudo: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [contas, setContas] = useState<Conta[]>([]);
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [historicoReservas, setHistoricoReservas] = useState<ReservaHistorico[]>([]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const storedContas = localStorage.getItem('fluc_contas');
      const storedCartoes = localStorage.getItem('fluc_cartoes');
      const storedCategorias = localStorage.getItem('fluc_categorias');
      const storedReservas = localStorage.getItem('fluc_reservas');
      const storedHistorico = localStorage.getItem('fluc_historico_reservas');
      const storedLancamentos = localStorage.getItem('fluc_lancamentos');

      if (storedContas) setContas(JSON.parse(storedContas));
      if (storedCartoes) setCartoes(JSON.parse(storedCartoes));
      if (storedReservas) setReservas(JSON.parse(storedReservas));
      if (storedHistorico) setHistoricoReservas(JSON.parse(storedHistorico));
      if (storedLancamentos) setLancamentos(JSON.parse(storedLancamentos));

      if (storedCategorias) {
        setCategorias(JSON.parse(storedCategorias));
      } else {
        // Initialize default categories
        const initialCategorias: Categoria[] = [
          ...CATEGORIAS_PADRAO_RECEITAS.map((nome, i) => ({ id: uuidv4(), nome, tipo: 'receita' as const, ordem: i })),
          ...CATEGORIAS_PADRAO_DESPESAS.map((nome, i) => ({ id: uuidv4(), nome, tipo: 'despesa' as const, ordem: i }))
        ];
        setCategorias(initialCategorias);
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('fluc_contas', JSON.stringify(contas));
    localStorage.setItem('fluc_cartoes', JSON.stringify(cartoes));
    localStorage.setItem('fluc_categorias', JSON.stringify(categorias));
    localStorage.setItem('fluc_reservas', JSON.stringify(reservas));
    localStorage.setItem('fluc_historico_reservas', JSON.stringify(historicoReservas));
    localStorage.setItem('fluc_lancamentos', JSON.stringify(lancamentos));
  }, [contas, cartoes, categorias, reservas, historicoReservas, lancamentos, isLoaded]);

  const addConta = (conta: Omit<Conta, 'id'>) => setContas([...contas, { ...conta, id: uuidv4() }]);
  const addCartao = (cartao: Omit<Cartao, 'id'>) => setCartoes([...cartoes, { ...cartao, id: uuidv4() }]);
  const addLancamento = (lancamento: Omit<Lancamento, 'id'>) => setLancamentos([...lancamentos, { ...lancamento, id: uuidv4() }]);
  const addReserva = (reserva: Omit<Reserva, 'id'>) => setReservas([...reservas, { ...reserva, id: uuidv4() }]);
  
  const addReservaHistorico = (historico: Omit<ReservaHistorico, 'id'>) => {
    setHistoricoReservas([...historicoReservas, { ...historico, id: uuidv4() }]);
  };

  const updateReservaSaldo = (id: string, novoSaldo: number) => {
    setReservas(reservas.map(r => r.id === id ? { ...r, saldo: novoSaldo } : r));
  };

  const limparLancamentos = () => setLancamentos([]);
  const limparTudo = () => {
    setContas([]);
    setCartoes([]);
    setReservas([]);
    setHistoricoReservas([]);
    setLancamentos([]);
    
    const initialCategorias: Categoria[] = [
      ...CATEGORIAS_PADRAO_RECEITAS.map((nome, i) => ({ id: uuidv4(), nome, tipo: 'receita' as const, ordem: i })),
      ...CATEGORIAS_PADRAO_DESPESAS.map((nome, i) => ({ id: uuidv4(), nome, tipo: 'despesa' as const, ordem: i }))
    ];
    setCategorias(initialCategorias);
  };

  if (!isLoaded) return null;

  return (
    <DataContext.Provider value={{
      contas, cartoes, categorias, reservas, historicoReservas, lancamentos,
      addConta, addCartao, addLancamento, addReserva, addReservaHistorico, updateReservaSaldo,
      limparLancamentos, limparTudo
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
