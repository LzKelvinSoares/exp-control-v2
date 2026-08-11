import { Home, TrendingDown, TrendingUp, FileText, Fuel, ShoppingBag } from 'lucide-react'
import type { NavItem } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  { href: '/',          label: 'Início',      icon: Home },
  { href: '/expenses',  label: 'Despesas',    icon: TrendingDown },
  { href: '/revenues',  label: 'Receitas',    icon: TrendingUp },
  { href: '/bills',     label: 'Contas',      icon: FileText },
  { href: '/fuel',      label: 'Combustível', icon: Fuel },
  { href: '/sales',     label: 'Vendas',      icon: ShoppingBag },
]
