// ─────────────────────────────────────────────
//  ZemConta — TransactionList.jsx
//  Historique des transactions groupées par jour
// ─────────────────────────────────────────────

import { useState } from 'react';
import { ClipboardList, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatFCFA, formatHeure, labelJour, totalEntrees, totalSorties, soldeNet } from '../utils/helpers';
import { CategoryIcon } from '../utils/categoryIcons';

// ── Sous-composants ───────────────────────────

function LigneTransaction({ transaction, onSupprimer }) {
  const [confirmer, setConfirmer] = useState(false);
  const estEntree = transaction.type === 'entree';

  const handleSupprimer = () => {
    if (!confirmer) {
      setConfirmer(true);
      // Annulation auto après 3s
      setTimeout(() => setConfirmer(false), 3000);
      return;
    }
    onSupprimer(transaction.id);
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">

      {/* Icône catégorie */}
      <div className={`
        w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0
        ${estEntree ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}
      `}>
        <CategoryIcon categorie={transaction.categorie} type={transaction.type} size={18} />
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 leading-tight">
          {transaction.categorie}
        </p>
        {transaction.note ? (
          <p className="text-xs text-gray-400 truncate">{transaction.note}</p>
        ) : (
          <p className="text-xs text-gray-300">{formatHeure(transaction.date)}</p>
        )}
        {transaction.note && (
          <p className="text-xs text-gray-300">{formatHeure(transaction.date)}</p>
        )}
      </div>

      {/* Montant */}
      <p className={`text-sm font-bold flex-shrink-0 ${estEntree ? 'text-green-600' : 'text-red-500'}`}>
        {estEntree ? '+' : '-'}{formatFCFA(transaction.montant)}
      </p>

      {/* Bouton supprimer */}
      <button
        onClick={handleSupprimer}
        className={`
          flex-shrink-0 p-1.5 rounded-lg transition-all duration-150 active:scale-90
          ${confirmer
            ? 'bg-red-500 text-white'
            : 'text-gray-300 hover:text-red-400 hover:bg-red-50'
          }
        `}
        aria-label={confirmer ? 'Confirmer la suppression' : 'Supprimer'}
      >
        <Trash2 size={15} strokeWidth={2} />
      </button>

    </div>
  );
}

function GroupeJour({ groupe, onSupprimer }) {
  const [ouvert, setOuvert] = useState(true);
  const { date, transactions } = groupe;

  const entrees = totalEntrees(transactions);
  const sorties = totalSorties(transactions);
  const solde   = soldeNet(transactions);
  const positif = solde >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-3 overflow-hidden">

      {/* En-tête du groupe — cliquable pour replier */}
      <button
        onClick={() => setOuvert((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <p className="text-sm font-bold text-gray-800">{labelJour(date)}</p>
          <p className="text-xs text-gray-400">
            {transactions.length} transaction{transactions.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini résumé */}
          <div className="text-right">
            <p className={`text-sm font-extrabold ${positif ? 'text-green-600' : 'text-red-500'}`}>
              {positif ? '+' : ''}{formatFCFA(solde)}
            </p>
            <p className="text-xs text-gray-400">
              <span className="text-green-500">+{formatFCFA(entrees)}</span>
              {' · '}
              <span className="text-red-400">-{formatFCFA(sorties)}</span>
            </p>
          </div>
          {ouvert
            ? <ChevronUp size={16} className="text-gray-400" />
            : <ChevronDown size={16} className="text-gray-400" />
          }
        </div>
      </button>

      {/* Liste des transactions */}
      {ouvert && (
        <div className="px-4 pb-1">
          {transactions.map((t) => (
            <LigneTransaction
              key={t.id}
              transaction={t}
              onSupprimer={onSupprimer}
            />
          ))}
        </div>
      )}

    </div>
  );
}

function EtatVide() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <ClipboardList size={48} className="text-gray-400" strokeWidth={1.8} aria-hidden="true" />
      <p className="text-gray-600 font-semibold">Aucune transaction</p>
      <p className="text-gray-400 text-sm max-w-[220px]">
        Tes transactions apparaîtront ici une fois enregistrées.
      </p>
    </div>
  );
}

// ── Composant principal ───────────────────────

export default function TransactionList({ historiqueGroupe, onSupprimer }) {
  if (!historiqueGroupe || historiqueGroupe.length === 0) {
    return <EtatVide />;
  }

  return (
    <div className="flex flex-col">

      {/* En-tête */}
      <h1 className="text-lg font-bold text-gray-800 mb-4">Historique</h1>

      {/* Groupes par jour */}
      {historiqueGroupe.map((groupe) => (
        <GroupeJour
          key={groupe.date}
          groupe={groupe}
          onSupprimer={onSupprimer}
        />
      ))}

    </div>
  );
}
