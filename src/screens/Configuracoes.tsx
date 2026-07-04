import React from 'react';
import { useData } from '../contexts/DataContext';
import { Cloud, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

export default function Configuracoes() {
  const { limparLancamentos, limparTudo } = useData();

  const handleBackup = () => {
    const data = {
      contas: localStorage.getItem('fluc_contas'),
      cartoes: localStorage.getItem('fluc_cartoes'),
      categorias: localStorage.getItem('fluc_categorias'),
      reservas: localStorage.getItem('fluc_reservas'),
      historico_reservas: localStorage.getItem('fluc_historico_reservas'),
      lancamentos: localStorage.getItem('fluc_lancamentos')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fluc-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.contas) localStorage.setItem('fluc_contas', data.contas);
        if (data.cartoes) localStorage.setItem('fluc_cartoes', data.cartoes);
        if (data.categorias) localStorage.setItem('fluc_categorias', data.categorias);
        if (data.reservas) localStorage.setItem('fluc_reservas', data.reservas);
        if (data.historico_reservas) localStorage.setItem('fluc_historico_reservas', data.historico_reservas);
        if (data.lancamentos) localStorage.setItem('fluc_lancamentos', data.lancamentos);
        alert('Restauração concluída! O aplicativo será recarregado.');
        window.location.reload();
      } catch (err) {
        alert('Erro ao restaurar backup. Arquivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pt-4 pb-8">
      <h2 className="text-xl font-semibold px-2">Configurações</h2>
      
      <div className="card-flat p-6 space-y-4">
        <div className="flex items-center gap-3 text-[var(--color-transferencia)]">
          <Cloud size={24} />
          <h3 className="font-medium text-lg text-general">Sincronização</h3>
        </div>
        <p className="text-sm text-discreto">Sincronize seus dados com a sua conta Google para não perdê-los.</p>
        <button className="button-flat w-full bg-secondary py-3 text-general font-medium">
          Conectar com Google
        </button>
      </div>

      <div className="card-flat p-6 space-y-4">
        <div className="flex items-center gap-3 text-general">
          <Download size={24} />
          <h3 className="font-medium text-lg">Backup e Restauração</h3>
        </div>
        <p className="text-sm text-discreto">Salve ou restaure um backup manual dos seus dados (formato JSON).</p>
        <div className="flex gap-4">
          <button onClick={handleBackup} className="button-flat flex-1 bg-tertiary py-3 text-general flex items-center justify-center gap-2">
            <Download size={18} /> Backup
          </button>
          <label className="button-flat flex-1 bg-tertiary py-3 text-general flex items-center justify-center gap-2 cursor-pointer">
            <Upload size={18} /> Restaurar
            <input type="file" accept=".json" className="hidden" onChange={handleRestore} />
          </label>
        </div>
      </div>

      <div className="card-flat p-6 space-y-4 border border-[var(--color-despesa)]/30">
        <div className="flex items-center gap-3 text-[var(--color-despesa)]">
          <AlertTriangle size={24} />
          <h3 className="font-medium text-lg text-general">Apagar Dados</h3>
        </div>
        <p className="text-sm text-discreto">Essas ações são irreversíveis. Tenha certeza antes de prosseguir.</p>
        <div className="space-y-3">
          <button 
            onClick={() => { if(confirm('Apagar todos os lançamentos? Contas e categorias serão mantidas.')) limparLancamentos(); }} 
            className="button-flat w-full border border-[var(--color-despesa)] py-3 text-[var(--color-despesa)] hover:bg-[var(--color-despesa)] hover:text-white"
          >
            <Trash2 size={18} className="mr-2 inline-block" />
            Limpar Lançamentos
          </button>
          <button 
            onClick={() => { if(confirm('Apagar TUDO? O aplicativo será restaurado aos padrões originais.')) limparTudo(); }} 
            className="button-flat w-full bg-[var(--color-despesa)] py-3 text-white"
          >
            <Trash2 size={18} className="mr-2 inline-block" />
            Limpar Tudo
          </button>
        </div>
      </div>
    </div>
  );
}
