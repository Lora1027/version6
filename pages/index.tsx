import { useEffect, useMemo, useState } from 'react'
import AuthGate from '../components/AuthGate'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabaseClient'
import { fmt } from '../lib/money'

type Tx = {
  id: string
  user_id: string
  date: string
  type: 'income' | 'expense'
  category: string | null
  method: 'cash' | 'gcash' | 'bank'
  amount: number
  notes: string | null
}

type Balance = {
  id: string
  user_id: string
  label: string
  kind: 'cash' | 'bank'
  balance: number
  updated_at: string
}

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null)
  const [tx, setTx] = useState<Tx[]>([])
  const [balances, setBalances] = useState<Balance[]>([])
  const [filters, setFilters] = useState({ type: 'all', method: 'all', q: '', from: '', to: '' })

  // form state (create/update)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    date: '',
    type: 'income' as 'income' | 'expense',
    category: '',
    method: 'cash' as 'cash' | 'gcash' | 'bank',
    amount: '',
    notes: ''
  })

  function resetForm() {
    setEditingId(null)
    setForm({ date: '', type: 'income', category: '',
