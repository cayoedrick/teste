import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { AppLayout } from './components/AppLayout';

// Lazy load screens
const Dashboard = React.lazy(() => import('./screens/Dashboard'));
const Extrato = React.lazy(() => import('./screens/Extrato'));
const Categorias = React.lazy(() => import('./screens/Categorias'));
const Contas = React.lazy(() => import('./screens/Contas'));
const Reservas = React.lazy(() => import('./screens/Reservas'));
const Configuracoes = React.lazy(() => import('./screens/Configuracoes'));

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <HashRouter>
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-app text-general">Carregando...</div>}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="extrato" element={<Extrato />} />
                <Route path="categorias" element={<Categorias />} />
                <Route path="contas" element={<Contas />} />
                <Route path="reservas" element={<Reservas />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>
            </Routes>
          </Suspense>
        </HashRouter>
      </DataProvider>
    </ThemeProvider>
  );
}
