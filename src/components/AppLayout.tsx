import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, FileText, Tags, CreditCard, PiggyBank, Settings, Moon, Sun, Plus, Bell, Lock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { LancamentoModal } from './LancamentoModal';

const MENU_ITEMS = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/extrato', label: 'Extrato', icon: FileText },
  { path: '/categorias', label: 'Categorias', icon: Tags },
  { path: '/contas', label: 'Contas e Cartões', icon: CreditCard },
  { path: '/reservas', label: 'Reserva e Cofrinhos', icon: PiggyBank },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLancamentoOpen, setIsLancamentoOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="flex flex-col h-screen w-full bg-app overflow-hidden text-general font-sans">
      {/* Header */}
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDrawerOpen(true)} className="p-2 -ml-2 active:scale-95 transition-transform text-general">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-xl">Fluc</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 bg-secondary rounded-full text-general transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsLancamentoOpen(true)} className="p-2 bg-secondary rounded-full text-general transition-colors">
            <Plus size={20} />
          </button>
          <button className="p-2 bg-secondary rounded-full text-general transition-colors hidden sm:flex">
            <Bell size={20} />
          </button>
          <button className="p-2 bg-secondary rounded-full text-general transition-colors hidden sm:flex">
            <Lock size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-primary z-50 shadow-2xl flex flex-col rounded-r-[24px]"
            >
              <div className="p-6 flex items-center justify-between border-b border-tertiary">
                <span className="font-bold text-2xl">Fluc</span>
                <button onClick={closeDrawer} className="p-2 text-general bg-secondary rounded-full">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {MENU_ITEMS.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      closeDrawer();
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3 rounded-[12px] transition-colors text-left font-semibold",
                      location.pathname === item.path
                        ? "bg-tertiary text-general"
                        : "text-discreto hover:bg-tertiary/50 hover:text-general"
                    )}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LancamentoModal isOpen={isLancamentoOpen} onClose={() => setIsLancamentoOpen(false)} />
    </div>
  );
}
