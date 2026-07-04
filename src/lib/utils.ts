import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export const CATEGORIAS_PADRAO_RECEITAS = [
  "Ajuste", "Estorno", "Extras", "Férias", "Outras Receitas", 
  "Reembolso", "Rendimentos", "Restituição", "Salário", "Transferências"
];

export const CATEGORIAS_PADRAO_DESPESAS = [
  "Ajuste", "Alimentação", "Assinaturas", "Combustível", "Compras", 
  "Delivery", "Lazer", "Moradia", "Outros Gastos", "Presente", 
  "Saúde", "Serviços", "Supermercado", "Transporte"
];
