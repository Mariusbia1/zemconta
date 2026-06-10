// ─────────────────────────────────────────────
//  ZemConta — useTransactions.js
//  Hook central : état + persistance + actions
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import {
  creerTransaction,
  transactionsDuJour,
  totalEntrees,
  totalSorties,
  soldeNet,
  nombreCourses,
  donneesGraphiqueSemaine,
  aujourdHui,
  hier,
} from '../utils/helpers';

const STORAGE_KEY = 'zemconta_transactions';

// ── Lecture / écriture localStorage ──────────

function lireDepuisStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function sauvegarderDansStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('ZemConta: erreur sauvegarde localStorage', e);
  }
}

// ── Hook principal ────────────────────────────

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => lireDepuisStorage());

  // Sync localStorage à chaque changement
  useEffect(() => {
    sauvegarderDansStorage(transactions);
  }, [transactions]);

  // ── Actions ───────────────────────────────

  /**
   * Ajoute une nouvelle transaction
   * @param {{ type, categorie, montant, note }} data
   */
  const ajouterTransaction = useCallback((data) => {
    const nouvelle = creerTransaction(data);
    setTransactions((prev) => [nouvelle, ...prev]);
    return nouvelle;
  }, []);

  /**
   * Supprime une transaction par son id
   */
  const supprimerTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Supprime toutes les transactions (reset complet)
   */
  const toutEffacer = useCallback(() => {
    setTransactions([]);
  }, []);

  // ── Données dérivées du jour ──────────────

  const txAujourdhui = transactionsDuJour(transactions, aujourdHui());
  const txHier       = transactionsDuJour(transactions, hier());

  const resumeJour = {
    entrees:  totalEntrees(txAujourdhui),
    sorties:  totalSorties(txAujourdhui),
    solde:    soldeNet(txAujourdhui),
    courses:  nombreCourses(txAujourdhui),
  };

  const resumeHier = {
    entrees: totalEntrees(txHier),
    sorties: totalSorties(txHier),
    solde:   soldeNet(txHier),
  };

  // ── Données dérivées de la semaine ────────

  const resumeSemaine = {
    entrees: totalEntrees(transactions),
    sorties: totalSorties(transactions),
    solde:   soldeNet(transactions),
    graphique: donneesGraphiqueSemaine(transactions),
  };

  // ── Historique groupé par jour ────────────

  /**
   * Retourne les transactions groupées par date
   * [{ date: "2026-06-10", label: "Aujourd'hui", transactions: [...] }]
   */
  const historiqueGroupe = (() => {
    const groupes = {};
    transactions.forEach((t) => {
      const dateStr = t.date.split('T')[0];
      if (!groupes[dateStr]) groupes[dateStr] = [];
      groupes[dateStr].push(t);
    });

    return Object.entries(groupes)
      .sort(([a], [b]) => b.localeCompare(a)) // plus récent en premier
      .map(([date, txs]) => ({ date, transactions: txs }));
  })();

  return {
    // État brut
    transactions,

    // Actions
    ajouterTransaction,
    supprimerTransaction,
    toutEffacer,

    // Données dérivées
    resumeJour,
    resumeHier,
    resumeSemaine,
    historiqueGroupe,
  };
}