import {
  Bike,
  CircleDollarSign,
  Fuel,
  Gift,
  Smartphone,
  Utensils,
  Wallet,
  Wrench,
} from 'lucide-react';
import { CATEGORIES } from './helpers';

const ICONES_CATEGORIES = {
  course: Bike,
  bonus: Gift,
  gain: Wallet,
  carburant: Fuel,
  reparation: Wrench,
  repas: Utensils,
  telephone: Smartphone,
  depense: CircleDollarSign,
};

export function iconeCategorie(categorie, type) {
  const categorieTrouvee = CATEGORIES[type]?.find((item) => item.label === categorie);
  return ICONES_CATEGORIES[categorieTrouvee?.icon] ?? (type === 'entree' ? Wallet : CircleDollarSign);
}

export function CategoryIcon({ categorie, type, icon, size = 18, className = '', strokeWidth = 2 }) {
  const Icon = icon ? ICONES_CATEGORIES[icon] : iconeCategorie(categorie, type);

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    />
  );
}
