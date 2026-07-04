import React, { useState } from 'react';
import { Modal } from './Modal';
import { useData } from '../contexts/DataContext';
import { format } from 'date-fns';

export function LancamentoModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [tipo, setTipo] = useState<'receita' | 'despesa' | 'despesa_cartao' | 'transferencia'>('despesa');
  const { contas, cartoes, categorias, addLancamento } = useData();

  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [categoriaId, setCategoriaId] = useState('');
  const [contaId, setContaId] = useState('');
  const [cartaoId, setCartaoId] = useState('');
  const [contaDestinoId, setContaDestinoId] = useState('');

  const filteredCategorias = categorias.filter(c => 
    (tipo === 'receita' && c.tipo === 'receita') || 
    ((tipo === 'despesa' || tipo === 'despesa_cartao') && c.tipo === 'despesa')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valor || !descricao) return;
    
    addLancamento({
      tipo,
      valor: parseFloat(valor),
      descricao,
      data,
      categoriaId: tipo !== 'transferencia' ? categoriaId : undefined,
      contaId: (tipo === 'receita' || tipo === 'despesa' || tipo === 'transferencia') ? contaId : undefined,
      cartaoId: tipo === 'despesa_cartao' ? cartaoId : undefined,
      contaDestinoId: tipo === 'transferencia' ? contaDestinoId : undefined,
      efetivado: true,
      fixoRecorrente: false,
      parcelado: false
    });
    
    setValor('');
    setDescricao('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Lançamento">
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(['receita', 'despesa', 'despesa_cartao', 'transferencia'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipo(t)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              tipo === t ? 'bg-secondary text-general' : 'bg-tertiary text-discreto'
            }`}
          >
            {t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-discreto mb-1">Valor</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={e => setValor(e.target.value)}
            className="input-flat font-mono text-2xl"
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm text-discreto mb-1">Data</label>
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            className="input-flat"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-discreto mb-1">Descrição</label>
          <input
            type="text"
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            className="input-flat"
            placeholder="Ex: Supermercado"
            required
          />
        </div>

        {tipo !== 'transferencia' && (
          <div>
            <label className="block text-sm text-discreto mb-1">Categoria</label>
            <select
              value={categoriaId}
              onChange={e => setCategoriaId(e.target.value)}
              className="input-flat"
            >
              <option value="">Selecione uma categoria...</option>
              {filteredCategorias.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
        )}

        {(tipo === 'receita' || tipo === 'despesa' || tipo === 'transferencia') && (
          <div>
            <label className="block text-sm text-discreto mb-1">
              {tipo === 'transferencia' ? 'Conta de Origem' : 'Conta Bancária'}
            </label>
            <select
              value={contaId}
              onChange={e => setContaId(e.target.value)}
              className="input-flat"
              required
            >
              <option value="">Selecione a conta...</option>
              {contas.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
        )}

        {tipo === 'transferencia' && (
          <div>
            <label className="block text-sm text-discreto mb-1">Conta de Destino</label>
            <select
              value={contaDestinoId}
              onChange={e => setContaDestinoId(e.target.value)}
              className="input-flat"
              required
            >
              <option value="">Selecione a conta de destino...</option>
              {contas.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
        )}

        {tipo === 'despesa_cartao' && (
          <div>
            <label className="block text-sm text-discreto mb-1">Cartão de Crédito</label>
            <select
              value={cartaoId}
              onChange={e => setCartaoId(e.target.value)}
              className="input-flat"
              required
            >
              <option value="">Selecione o cartão...</option>
              {cartoes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="button-flat flex-1 py-3 bg-tertiary text-general">
            Cancelar
          </button>
          <button type="submit" className="button-flat flex-1 py-3 bg-secondary text-general">
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
}
