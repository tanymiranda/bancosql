"use client";
import { supabase } from '../../lib/supabaseClient';
import { useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';

const insertData = async () => {
  // Inserir 100 pessoas
  const pessoas = [];
  for (let i = 0; i < 100; i++) {
    pessoas.push({
      nome: faker.person.firstName(),
      idade: Math.floor(Math.random() * 50) + 18,
      email: faker.internet.email()
    });
  }
  const { error: pessoaInsertError } = await supabase.from('pessoa').insert(pessoas);
  if (pessoaInsertError) console.error('Erro ao inserir dados na tabela pessoa:', pessoaInsertError);

  // Inserir 4000 vendas
  const vendas = [];
  for (let i = 0; i < 4000; i++) {
    vendas.push({
      cliente_id: Math.floor(Math.random() * 100) + 1, // ID aleatório de cliente
      vendedor_id: Math.floor(Math.random() * 100) + 1, // ID aleatório de vendedor
      quantidade: parseFloat((Math.random() * 100).toFixed(4)),
      valor: parseFloat((Math.random() * 1000).toFixed(4)),
      data: faker.date.recent({ days: 30 }).toISOString().split('T')[0] // Formato DATE
    });
  }
  const { error: vendaInsertError } = await supabase.from('venda').insert(vendas);
  if (vendaInsertError) console.error('Erro ao inserir dados na tabela venda:', vendaInsertError);
};

export default function Page() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    insertData()
      .then(() => setStatus('Dados inseridos com sucesso!'))
      .catch((error) => {
        console.error('Erro ao inserir dados:', error);
        setStatus('Erro ao inserir dados');
      });
  }, []);

  return <div>{status}</div>;
}