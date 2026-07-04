import React from 'react';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../lib/utils';
import { Plus } from 'lucide-react';

export default function Reservas() {
  const { reservas } = useData();

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-semibold">Reservas e Cofrinhos</h2>
        <button className="button-flat px-4 py-2 bg-secondary text-general text-sm">
          <Plus size={16} className="mr-1 inline-block" />
          Adicionar
        </button>
      </div>

      <div className="space-y-3 pb-8">
        {reservas.length === 0 ? (
          <p className="text-center text-discreto py-8">Nenhuma reserva cadastrada.</p>
        ) : (
          reservas.map(reserva => (
            <div key={reserva.id} className="card-flat p-4 border-l-4" style={{ borderColor: reserva.cor }}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">{reserva.nome}</span>
                <span className="font-mono font-bold text-xl">{formatCurrency(reserva.saldo)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
