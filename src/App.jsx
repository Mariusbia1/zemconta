// ─────────────────────────────────────────────
//  ZemConta — App.jsx
//  Point d'entrée — routing par onglet
// ─────────────────────────────────────────────

import { useState } from 'react';
import { Bike } from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';
import BottomNav from './components/BottomNav';

// On importe les composants au fur et à mesure qu'ils sont créés
import Dashboard         from './components/Dashboard';
import TransactionForm  from './components/TransactionForm';
import TransactionList  from './components/TransactionList';
import WeeklySummary    from './components/WeeklySummary';

export default function App() {
  const [ongletActif, setOngletActif] = useState('dashboard');
  const contextTransactions = useTransactions();

  const renderPage = () => {
    switch (ongletActif) {
      case 'dashboard':
        return (
          <Dashboard
            resumeJour={contextTransactions.resumeJour}
            transactions={contextTransactions.transactions}
            onAjouter={() => setOngletActif('ajouter')}
          />
        );
      case 'ajouter':
        return (
          <TransactionForm
            onAjouter={contextTransactions.ajouterTransaction}
            onRetour={() => setOngletActif('dashboard')}
          />
        );
      case 'historique':
        return (
          <TransactionList
            historiqueGroupe={contextTransactions.historiqueGroupe}
            onSupprimer={contextTransactions.supprimerTransaction}
          />
        );
      case 'semaine':
        return (
          <WeeklySummary
            resumeSemaine={contextTransactions.resumeSemaine}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Bike size={22} className="text-green-600" strokeWidth={2.2} aria-hidden="true" />
          <span className="font-bold text-gray-800 text-lg tracking-tight">
            Zem<span className="text-green-600">Conta</span>
          </span>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-4">
        {renderPage()}
      </main>

      {/* Navigation bas */}
      <BottomNav
        ongletActif={ongletActif}
        onChanger={setOngletActif}
      />

    </div>
  );
}
