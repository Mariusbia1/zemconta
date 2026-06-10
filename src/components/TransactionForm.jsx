// ─────────────────────────────────────────────
//  ZemConta — TransactionForm.jsx
//  Formulaire d'ajout de transaction
// ─────────────────────────────────────────────

import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { CATEGORIES, formatFCFA } from '../utils/helpers';
import { CategoryIcon } from '../utils/categoryIcons';

// ── Sous-composants ───────────────────────────

function ToggleType({ type, onChange }) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
      {[
        { id: 'entree', label: 'Gain',    actif: 'bg-green-500', Icon: ArrowUpCircle },
        { id: 'sortie', label: 'Dépense', actif: 'bg-red-500',   Icon: ArrowDownCircle },
      ].map(({ id, label, actif, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`
            flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150
            ${type === id
              ? `${actif} text-white shadow-sm`
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          <Icon size={16} strokeWidth={2.2} aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}

function SelectCategorie({ type, valeur, onChange }) {
  const categories = CATEGORIES[type];
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Catégorie
      </label>
      <div className="grid grid-cols-2 gap-2">
        {categories.map(({ label, icon }) => {
          const selectionne = valeur === label;
          const borderActif = type === 'entree'
            ? 'border-green-500 bg-green-50 text-green-700'
            : 'border-red-400 bg-red-50 text-red-600';
          return (
            <button
              key={label}
              onClick={() => onChange(label)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium
                transition-all duration-100 active:scale-95
                ${selectionne
                  ? `${borderActif} border-2`
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <CategoryIcon icon={icon} size={17} />
              <span className="leading-tight">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function InputMontant({ valeur, onChange }) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Montant (FCFA)
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          placeholder="0"
          value={valeur}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full text-3xl font-bold text-gray-800 text-center
            bg-gray-50 border-2 border-gray-200 rounded-xl py-4 px-4
            focus:outline-none focus:border-green-400
            placeholder:text-gray-300
          "
        />
        {valeur && (
          <p className="text-center text-xs text-gray-400 mt-1">
            {formatFCFA(Number(valeur))}
          </p>
        )}
      </div>
    </div>
  );
}

function InputNote({ valeur, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Note <span className="text-gray-300 font-normal normal-case">(optionnel)</span>
      </label>
      <input
        type="text"
        placeholder="Ex : Client Akpakpa, panne pneu..."
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        maxLength={60}
        className="
          w-full text-sm text-gray-700 bg-gray-50 border border-gray-200
          rounded-xl py-3 px-4 focus:outline-none focus:border-green-400
          placeholder:text-gray-300
        "
      />
    </div>
  );
}

function ConfirmationFlash({ montant, type, categorie }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-2xl p-6 text-center shadow-xl w-full max-w-xs">
        <CheckCircle
          size={52}
          className={type === 'entree' ? 'text-green-500 mx-auto mb-3' : 'text-red-500 mx-auto mb-3'}
          strokeWidth={1.5}
        />
        <p className="text-lg font-bold text-gray-800">Transaction enregistrée !</p>
        <p className="text-sm text-gray-500 mt-1">{categorie}</p>
        <p className={`text-2xl font-extrabold mt-2 ${type === 'entree' ? 'text-green-600' : 'text-red-500'}`}>
          {type === 'entree' ? '+' : '-'}{formatFCFA(Number(montant))}
        </p>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────

const CATEGORIE_DEFAUT = {
  entree: 'Course',
  sortie: 'Carburant',
};

export default function TransactionForm({ onAjouter, onRetour }) {
  const [type,       setType]       = useState('entree');
  const [categorie,  setCategorie]  = useState(CATEGORIE_DEFAUT.entree);
  const [montant,    setMontant]    = useState('');
  const [note,       setNote]       = useState('');
  const [flash,      setFlash]      = useState(false);
  const [erreur,     setErreur]     = useState('');

  // Quand on change le type, on remet la catégorie par défaut
  const handleChangerType = (nouveauType) => {
    setType(nouveauType);
    setCategorie(CATEGORIE_DEFAUT[nouveauType]);
    setErreur('');
  };

  const handleSoumettre = () => {
    if (!montant || Number(montant) <= 0) {
      setErreur('Saisis un montant valide pour continuer.');
      return;
    }

    onAjouter({ type, categorie, montant: Number(montant), note });

    // Flash de confirmation
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      // Réinitialiser le formulaire
      setMontant('');
      setNote('');
      setType('entree');
      setCategorie(CATEGORIE_DEFAUT.entree);
      // Retour au dashboard
      onRetour();
    }, 1400);
  };

  const couleurBouton = type === 'entree'
    ? 'bg-green-600 active:bg-green-700'
    : 'bg-red-500 active:bg-red-600';

  return (
    <>
      {/* Flash de confirmation */}
      {flash && (
        <ConfirmationFlash
          montant={montant}
          type={type}
          categorie={categorie}
        />
      )}

      <div className="flex flex-col">

        {/* En-tête */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={onRetour}
            className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform"
            aria-label="Retour"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Nouvelle transaction</h1>
        </div>

        {/* Toggle Gain / Dépense */}
        <ToggleType type={type} onChange={handleChangerType} />

        {/* Sélection catégorie */}
        <SelectCategorie
          type={type}
          valeur={categorie}
          onChange={setCategorie}
        />

        {/* Montant */}
        <InputMontant valeur={montant} onChange={(v) => { setMontant(v); setErreur(''); }} />

        {/* Message d'erreur */}
        {erreur && (
          <p className="text-red-500 text-xs text-center -mt-3 mb-4 font-medium">{erreur}</p>
        )}

        {/* Note */}
        <InputNote valeur={note} onChange={setNote} />

        {/* Bouton valider */}
        <button
          onClick={handleSoumettre}
          className={`
            w-full py-4 rounded-2xl text-white font-bold text-base shadow-md
            transition-all duration-150 active:scale-95
            ${couleurBouton}
          `}
        >
          {type === 'entree' ? 'Enregistrer le gain' : 'Enregistrer la dépense'}
        </button>

      </div>
    </>
  );
}
