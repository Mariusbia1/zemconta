// ─────────────────────────────────────────────
//  ZemConta — Dashboard.jsx
//  Tableau de bord du jour
// ─────────────────────────────────────────────

import { TrendingUp, TrendingDown, Bike, ArrowUpCircle, ArrowDownCircle, Plus } from 'lucide-react';
import { formatFCFA } from '../utils/helpers';
import { CategoryIcon } from '../utils/categoryIcons';

// ── Sous-composants ───────────────────────────

function CarteStatut({ solde }) {
  const positif = solde >= 0;
  return (
    <div
      className={`
        rounded-2xl p-5 text-white shadow-md mb-4
        ${positif
          ? 'bg-gradient-to-br from-green-500 to-green-700'
          : 'bg-gradient-to-br from-red-500 to-red-700'
        }
      `}
    >
      <p className="text-sm font-medium opacity-80 mb-1">Solde net aujourd'hui</p>
      <p className="text-4xl font-extrabold tracking-tight leading-none">
        {positif ? '+' : ''}{formatFCFA(solde)}
      </p>
      <div className="flex items-center gap-1 mt-2 opacity-75">
        {positif
          ? <TrendingUp size={14} />
          : <TrendingDown size={14} />
        }
        <span className="text-xs">
          {positif ? 'Bonne journée en cours' : 'Les sorties dépassent les entrées'}
        </span>
      </div>
    </div>
  );
}

function CarteMetrique({ label, montant, type }) {
  const couleur = type === 'entree'
    ? 'text-green-600 bg-green-50 border-green-100'
    : 'text-red-500 bg-red-50 border-red-100';
  const Icon = type === 'entree' ? ArrowUpCircle : ArrowDownCircle;

  return (
    <div className={`flex-1 rounded-xl border p-3 ${couleur}`}>
      <div className="flex items-center gap-1 mb-1">
        <Icon size={14} strokeWidth={2} />
        <span className="text-xs font-medium opacity-70">{label}</span>
      </div>
      <p className="text-lg font-bold leading-tight">{formatFCFA(montant)}</p>
    </div>
  );
}

function CarteCourses({ courses }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm mb-4">
      <Bike size={24} className="text-green-600" strokeWidth={2} aria-hidden="true" />
      <div>
        <p className="text-xs text-gray-400 font-medium">Courses effectuées</p>
        <p className="text-xl font-bold text-gray-800">
          {courses}
          <span className="text-sm font-normal text-gray-400 ml-1">
            {courses <= 1 ? 'course' : 'courses'}
          </span>
        </p>
      </div>
    </div>
  );
}

function DerniereTransaction({ transaction }) {
  if (!transaction) return null;

  const estEntree = transaction.type === 'entree';
  const heure = new Date(transaction.date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
      <p className="text-xs text-gray-400 font-medium mb-2">Dernière transaction</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`
            w-9 h-9 rounded-full flex items-center justify-center text-base
            ${estEntree ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}
          `}>
            <CategoryIcon categorie={transaction.categorie} type={transaction.type} size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{transaction.categorie}</p>
            {transaction.note && (
              <p className="text-xs text-gray-400 truncate max-w-[140px]">{transaction.note}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold ${estEntree ? 'text-green-600' : 'text-red-500'}`}>
            {estEntree ? '+' : '-'}{formatFCFA(transaction.montant)}
          </p>
          <p className="text-xs text-gray-400">{heure}</p>
        </div>
      </div>
    </div>
  );
}

function EtatVide({ onAjouter }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
      <Bike size={48} className="text-green-600" strokeWidth={1.8} aria-hidden="true" />
      <p className="text-gray-600 font-semibold text-base">Bonne journée, chauffeur !</p>
      <p className="text-gray-400 text-sm max-w-[220px]">
        Aucune transaction pour aujourd'hui. Enregistre ta première course pour commencer.
      </p>
      <button
        onClick={onAjouter}
        className="mt-2 inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm active:scale-95 transition-transform"
      >
        <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
        Ajouter une transaction
      </button>
    </div>
  );
}

// ── Composant principal ───────────────────────

export default function Dashboard({ resumeJour, transactions, onAjouter }) {
  const aucuneTransactionAujourdhui = resumeJour.entrees === 0 && resumeJour.sorties === 0;
  const derniereTransaction = transactions?.[0] ?? null;

  if (aucuneTransactionAujourdhui) {
    return <EtatVide onAjouter={onAjouter} />;
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Solde net — carte principale */}
      <CarteStatut solde={resumeJour.solde} />

      {/* Entrées / Sorties côte à côte */}
      <div className="flex gap-3">
        <CarteMetrique
          label="Mes gains"
          montant={resumeJour.entrees}
          type="entree"
        />
        <CarteMetrique
          label="Mes dépenses"
          montant={resumeJour.sorties}
          type="sortie"
        />
      </div>

      {/* Nombre de courses */}
      <CarteCourses courses={resumeJour.courses} />

      {/* Dernière transaction */}
      <DerniereTransaction transaction={derniereTransaction} />

    </div>
  );
}
