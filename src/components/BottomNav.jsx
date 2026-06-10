// ─────────────────────────────────────────────
//  ZemConta — BottomNav.jsx
//  Navigation bas d'écran — 4 onglets
// ─────────────────────────────────────────────

import { Home, PlusCircle, Clock, TrendingUp } from 'lucide-react';

const ONGLETS = [
  { id: 'dashboard',  label: 'Accueil',   Icon: Home        },
  { id: 'ajouter',    label: 'Ajouter',   Icon: PlusCircle  },
  { id: 'historique', label: 'Historique',Icon: Clock       },
  { id: 'semaine',    label: 'Semaine',   Icon: TrendingUp  },
];

export default function BottomNav({ ongletActif, onChanger }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg">
      <ul className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {ONGLETS.map(({ id, label, Icon }) => {
          const actif = ongletActif === id;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => onChanger(id)}
                className={`
                  flex flex-col items-center justify-center w-full h-full gap-1
                  transition-colors duration-150
                  ${actif
                    ? 'text-green-600'
                    : 'text-gray-400 hover:text-gray-600'
                  }
                `}
                aria-label={label}
                aria-current={actif ? 'page' : undefined}
              >
                {/* Icône avec indicateur actif */}
                <span className="relative">
                  <Icon
                    size={22}
                    strokeWidth={actif ? 2.5 : 1.8}
                  />
                  {actif && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </span>

                {/* Label */}
                <span className={`text-xs font-medium tracking-wide ${actif ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}