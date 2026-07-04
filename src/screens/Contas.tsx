import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../lib/utils';
import { Plus } from 'lucide-react';

export default function Contas() {
  const { contas, cartoes } = useData();

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-semibold">Contas e Cartões</h2>
        <button className="button-flat px-4 py-2 bg-secondary text-general text-sm">
          <Plus size={16} className="mr-1 inline-block" />
          Adicionar
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-discreto text-sm uppercase tracking-wider px-2">Contas Bancárias</h3>
        {contas.length === 0 ? (
          <p className="text-discreto px-2 text-sm">Nenhuma conta cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {contas.map(conta => (
              <div key={conta.id} className="card-flat p-4 flex items-center justify-between border-l-4" style={{ borderColor: conta.cor }}>
                <span className="font-medium">{conta.nome}</span>
                <span className="font-mono font-semibold">{formatCurrency(conta.saldoInicial)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-discreto text-sm uppercase tracking-wider px-2">Cartões de Crédito</h3>
        {cartoes.length === 0 ? (
          <p className="text-discreto px-2 text-sm">Nenhum cartão cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {cartoes.map(cartao => (
              <div key={cartao.id} className="card-flat p-4 border-l-4" style={{ borderColor: cartao.cor }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cartao.nome}</span>
                  <span className="text-[var(--color-cartao)] font-mono font-semibold text-sm">
                    {formatCurrency(cartao.limiteUtilizado)} / {formatCurrency(cartao.limiteTotal)}
                  </span>
                </div>
                <div className="w-full bg-tertiary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[var(--color-cartao)] h-full rounded-full" 
                    style={{ width: `${Math.min(100, (cartao.limiteUtilizado / cartao.limiteTotal) * 100)}%` }} 
                  />
                </div>
                <p className="text-xs text-discreto mt-2">Vence dia {cartao.dataVencimento}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
