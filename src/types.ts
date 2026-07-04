export type Conta = {
  id: string;
  nome: string;
  saldoInicial: number;
  cor: string;
};

export type Cartao = {
  id: string;
  nome: string;
  limiteTotal: number;
  limiteUtilizado: number;
  dataFechamento: number;
  dataVencimento: number;
  contaVinculadaId?: string;
  cor: string;
};

export type Categoria = {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa';
  ordem: number;
};

export type Reserva = {
  id: string;
  nome: string;
  saldo: number;
  cor: string;
};

export type ReservaHistorico = {
  id: string;
  reservaId: string;
  tipo: 'deposito' | 'retirada' | 'rendimento';
  valor: number;
  data: string; // ISO string
  descricao?: string;
  contaId?: string;
};

export type Lancamento = {
  id: string;
  tipo: 'receita' | 'despesa' | 'despesa_cartao' | 'transferencia';
  valor: number;
  data: string; // ISO string
  descricao: string;
  categoriaId?: string;
  contaId?: string;
  cartaoId?: string;
  contaDestinoId?: string;
  efetivado: boolean;
  fixoRecorrente: boolean;
  parcelado: boolean;
  parcelas?: number;
  estornoAjuste?: boolean;
};

export type Periodo = {
  mes: number; // 0-11
  ano: number;
};
