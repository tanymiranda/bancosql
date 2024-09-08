'use client';

import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
// Interface para Pessoa
interface Pessoa {
  id?: number;
  nome: string;
  cpf: string;
}

// Interface para Venda
interface Venda {
  id?: number;
  pessoa_id: number;
  valor: string;
}

// Função para gerar um nome aleatório
const generateRandomName = (): string => {
  const names = ['Tany', 'José', 'Carol', 'João', 'Ana', 'Bruno', 'Felipe', 'Camila', 'Taniely', 'Mônica'];
  const surnames = ['Siqueira', 'Souza', 'Oliveira', 'Santos', 'Ferreira', 'Fernandes', 'Ribeiro', 'Cotrim', 'Miranda'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
  return `${randomName} ${randomSurname}`;
};

// Função para gerar um CPF aleatório
const generateCPF = (): string => {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  return `${digits.slice(0, 3).join('')}.${digits.slice(3, 6).join('')}.${digits.slice(6, 9).join('')}-${Math.floor(10 + Math.random() * 89)}`;
};

// Função para contar registros existentes
const countRecords = async (table: string): Promise<number> => {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error(`Erro ao contar registros na tabela ${table}:`, error.message);
    return 0;
  }

  return count || 0;
};

// Função para gerar e inserir 100 pessoas e 4000 vendas
const insertData = async () => {
  try {
    // Contar pessoas e vendas já existentes
    const pessoasCount = await countRecords('pessoa');
    const vendasCount = await countRecords('venda');

    // Limites
    const maxPessoas = 100;
    const maxVendas = 4000;

    // Inserindo pessoas se não atingir o limite
    if (pessoasCount < maxPessoas) {
      for (let i = 0; i < maxPessoas - pessoasCount; i++) {
        const pessoa: Pessoa = {
          nome: generateRandomName(),
          cpf: generateCPF(),
        };

        const { data: pessoaInserida, error: pessoaError } = await supabase
          .from('pessoa')
          .insert([pessoa])
          .select();

        if (pessoaError) {
          console.error('Erro ao inserir pessoa:', pessoaError.message);
          return;
        }

        const pessoaId = pessoaInserida?.[0]?.id;

        if (!pessoaId) {
          console.error('Pessoa inserida não possui ID');
          return;
        }

        // Inserindo vendas se não atingir o limite de 4000 vendas
        if (vendasCount < maxVendas) {
          for (let j = 0; j < 40 && vendasCount + j < maxVendas; j++) {
            const venda: Venda = {
              pessoa_id: pessoaId,
              valor: (Math.random() * 1000).toFixed(2),
            };

            const { error: vendaError } = await supabase
              .from('venda')
              .insert([venda]);

            if (vendaError) {
              console.error('Erro ao inserir venda:', vendaError.message);
              return;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
  }
};

export default function Home() {
  useEffect(() => {
    insertData();
  }, []);

  return (
    <div>
      <h1></h1>
      <p>Inserindo dados automaticamente...</p>
    </div>
  );
}
