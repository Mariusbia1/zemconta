// ─────────────────────────────────────────────
//  ZemConta — helpers.js
//  Utilitaires : formatage, dates, calculs
// ─────────────────────────────────────────────


// ── 1. FORMATAGE FCFA ─────────────────────────

/**
 * Formate un montant en FCFA
 * Ex : 1500 → "1 500 F"
 */
export function formatFCFA(montant) {
  if (isNaN(montant) || montant === null || montant === undefined) return '0 F';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant) + ' F';
}

// ── 2. DATES ──────────────────────────────────

/**
 * Retourne la date du jour au format YYYY-MM-DD
 * Ex : "2026-06-10"
 */
export function aujourdHui() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Retourne la date d'hier au format YYYY-MM-DD
 */
export function hier() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * Retourne les 7 derniers jours (aujourd'hui inclus)
 * sous forme de tableau de strings YYYY-MM-DD
 * [plus ancien → aujourd'hui]
 */
export function sept_derniers_jours() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

/**
 * Extrait la date YYYY-MM-DD depuis une string ISO
 * Ex : "2026-06-10T08:32:00" → "2026-06-10"
 */
export function extraireDate(isoString) {
  return isoString.split('T')[0];
}

/**
 * Formate une date lisible pour l'affichage
 * Ex : "2026-06-10" → "Mer. 10 juin"
 */
export function formatDateCourte(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Formate l'heure depuis une string ISO
 * Ex : "2026-06-10T08:32:00" → "08h32"
 */
export function formatHeure(isoString) {
  const d = new Date(isoString);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}h${m}`;
}

/**
 * Retourne un label humain pour une date
 * "Aujourd'hui", "Hier", ou la date courte
 */
export function labelJour(dateStr) {
  if (dateStr === aujourdHui()) return "Aujourd'hui";
  if (dateStr === hier()) return 'Hier';
  return formatDateCourte(dateStr);
}

// ── 3. CALCULS ────────────────────────────────

/**
 * Calcule le total des entrées d'une liste de transactions
 */
export function totalEntrees(transactions) {
  return transactions
    .filter((t) => t.type === 'entree')
    .reduce((sum, t) => sum + t.montant, 0);
}

/**
 * Calcule le total des sorties d'une liste de transactions
 */
export function totalSorties(transactions) {
  return transactions
    .filter((t) => t.type === 'sortie')
    .reduce((sum, t) => sum + t.montant, 0);
}

/**
 * Calcule le solde net (entrées - sorties)
 */
export function soldeNet(transactions) {
  return totalEntrees(transactions) - totalSorties(transactions);
}

/**
 * Compte le nombre de courses (catégorie "Course")
 */
export function nombreCourses(transactions) {
  return transactions.filter(
    (t) => t.type === 'entree' && t.categorie === 'Course'
  ).length;
}

/**
 * Filtre les transactions pour une date donnée (YYYY-MM-DD)
 */
export function transactionsDuJour(transactions, dateStr) {
  return transactions.filter(
    (t) => extraireDate(t.date) === dateStr
  );
}

/**
 * Prépare les données du graphique pour les 7 derniers jours
 * Retourne un tableau d'objets { jour, entrees, sorties, solde }
 */
export function donneesGraphiqueSemaine(transactions) {
  return sept_derniers_jours().map((dateStr) => {
    const txJour = transactionsDuJour(transactions, dateStr);
    const d = new Date(dateStr + 'T00:00:00');
    return {
      jour: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      entrees: totalEntrees(txJour),
      sorties: totalSorties(txJour),
      solde: soldeNet(txJour),
    };
  });
}

// ── 4. FACTORY DE TRANSACTION ─────────────────

/**
 * Crée un objet transaction complet
 */
export function creerTransaction({ type, categorie, montant, note = '' }) {
  return {
    id: crypto.randomUUID(),
    type,           // 'entree' | 'sortie'
    categorie,
    montant: Number(montant),
    note: note.trim(),
    date: new Date().toISOString(),
  };
}

// ── 5. CATÉGORIES ─────────────────────────────

export const CATEGORIES = {
  entree: [
    { label: 'Course',        icon: 'course' },
    { label: 'Prime / Bonus', icon: 'bonus' },
    { label: 'Autre entrée',  icon: 'gain' },
  ],
  sortie: [
    { label: 'Carburant',         icon: 'carburant' },
    { label: 'Réparation',        icon: 'reparation' },
    { label: 'Repas',             icon: 'repas' },
    { label: 'Crédit téléphone',  icon: 'telephone' },
    { label: 'Autre sortie',      icon: 'depense' },
  ],
};
