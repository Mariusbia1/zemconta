// ─────────────────────────────────────────────
//  ZemConta — WeeklySummary.jsx
//  Résumé et graphique de la semaine
// ─────────────────────────────────────────────

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';
import { formatFCFA } from '../utils/helpers';

// ── Tooltip personnalisé du graphique ─────────

function TooltipPerso({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const positif = data.solde >= 0;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      <p className="text-green-600">+{formatFCFA(data.entrees)}</p>
      <p className="text-red-500">-{formatFCFA(data.sorties)}</p>
      <p className={`font-extrabold mt-1 ${positif ? 'text-green-600' : 'text-red-500'}`}>
        = {positif ? '+' : ''}{formatFCFA(data.solde)}
      </p>
    </div>
  );
}

// ── Carte résumé global ────────────────────────

function CarteResume({ label, montant, type }) {
  const styles = {
    entree: 'bg-green-50 border-green-100 text-green-700',
    sortie: 'bg-red-50 border-red-100 text-red-500',
    solde:  'bg-white border-gray-200 text-gray-800',
  };

  return (
    <div className={`flex-1 rounded-xl border px-3 py-3 ${styles[type]}`}>
      <p className="text-xs font-medium opacity-60 mb-1">{label}</p>
      <p className="text-base font-extrabold leading-tight">{formatFCFA(montant)}</p>
    </div>
  );
}

// ── Meilleur jour ──────────────────────────────

function MeilleurJour({ graphique }) {
  const meilleur = [...graphique].sort((a, b) => b.solde - a.solde)[0];
  if (!meilleur || meilleur.solde <= 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 flex items-center gap-3">
      <Trophy size={24} className="text-yellow-600" strokeWidth={2} aria-hidden="true" />
      <div>
        <p className="text-xs text-yellow-700 font-medium">Meilleure journée</p>
        <p className="text-sm font-bold text-yellow-800">
          {meilleur.jour} — {formatFCFA(meilleur.solde)}
        </p>
      </div>
    </div>
  );
}

// ── Tendance semaine ───────────────────────────

function TendanceSemaine({ graphique }) {
  // Compare la 1ère moitié vs la 2ème moitié de la semaine
  const milieu = Math.floor(graphique.length / 2);
  const premiereMoitie = graphique.slice(0, milieu).reduce((s, d) => s + d.solde, 0);
  const deuxiemeMoitie = graphique.slice(milieu).reduce((s, d) => s + d.solde, 0);

  const enHausse  = deuxiemeMoitie > premiereMoitie;
  const stable    = deuxiemeMoitie === premiereMoitie;

  const config = stable
    ? { Icon: Minus,       couleur: 'text-gray-500', label: 'Rythme stable cette semaine',   bg: 'bg-gray-50  border-gray-100'  }
    : enHausse
    ? { Icon: TrendingUp,  couleur: 'text-green-600', label: 'En progression cette semaine !', bg: 'bg-green-50 border-green-100' }
    : { Icon: TrendingDown,couleur: 'text-red-500',   label: 'En baisse en fin de semaine',    bg: 'bg-red-50   border-red-100'   };

  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${config.bg}`}>
      <config.Icon size={20} className={config.couleur} />
      <p className={`text-sm font-semibold ${config.couleur}`}>{config.label}</p>
    </div>
  );
}

// ── État vide ──────────────────────────────────

function EtatVide() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <BarChart3 size={48} className="text-gray-400" strokeWidth={1.8} aria-hidden="true" />
      <p className="text-gray-600 font-semibold">Pas encore de données</p>
      <p className="text-gray-400 text-sm max-w-[220px]">
        Enregistre tes transactions pour voir ton résumé de la semaine ici.
      </p>
    </div>
  );
}

// ── Composant principal ────────────────────────

export default function WeeklySummary({ resumeSemaine }) {
  const { entrees, sorties, solde, graphique } = resumeSemaine;
  const aucuneDonnee = entrees === 0 && sorties === 0;

  if (aucuneDonnee) return <EtatVide />;

  return (
    <div className="flex flex-col gap-4">

      {/* En-tête */}
      <h1 className="text-lg font-bold text-gray-800">Cette semaine</h1>

      {/* Résumé global — 3 cartes */}
      <div className="flex gap-2">
        <CarteResume label="Gains"    montant={entrees} type="entree" />
        <CarteResume label="Dépenses" montant={sorties} type="sortie" />
        <CarteResume label="Net"      montant={solde}   type="solde"  />
      </div>

      {/* Graphique */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-3 pt-4 pb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
          Solde net par jour (FCFA)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={graphique} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="jour"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<TooltipPerso />} cursor={{ fill: '#f3f4f6', radius: 6 }} />
            <ReferenceLine y={0} stroke="#e5e7eb" strokeWidth={1} />
            <Bar dataKey="solde" radius={[6, 6, 0, 0]}>
              {graphique.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.solde >= 0 ? '#16a34a' : '#ef4444'}
                  fillOpacity={entry.solde === 0 ? 0.2 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Meilleure journée */}
      <MeilleurJour graphique={graphique} />

      {/* Tendance */}
      <TendanceSemaine graphique={graphique} />

    </div>
  );
}
