'use client';

import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

// Interface para Pessoa com os novos campos idade e email
interface Pessoa {
  id?: number;
  nome: string;
  cpf: string;
  idade: number;
  email: string;
}

// Interface para Venda com os novos campos data, quantidade e vendedor_id
interface Venda {
  id?: number;
  pessoa_id: number;
  vendedor_id: number;
  valor: string;
  data: string;
  quantidade: number;
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

// Função para gerar um email aleatório baseado no nome
const generateEmail = (name: string): string => {
  const domain = ['gmail.com', 'yahoo.com', 'hotmail.com'];
  const randomDomain = domain[Math.floor(Math.random() * domain.length)];
  const uniqueSuffix = Math.floor(1000 + Math.random() * 9000); // Garantir unicidade
  return `${name.toLowerCase().replace(' ', '.')}+${uniqueSuffix}@${randomDomain}`;
};

// Função para gerar uma idade aleatória entre 18 e 65 anos
const generateRandomAge = (): number => {
  return Math.floor(Math.random() * (65 - 18 + 1)) + 18;
};

// Função para gerar uma data aleatória
const generateRandomDate = (): string => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
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

// Função para verificar se o email já existe
const emailExists = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('pessoa')
    .select('id')
    .eq('email', email);

  if (error) {
    console.error('Erro ao verificar email:', error.message);
    return false;
  }

  return data?.length > 0;
};

// Função para gerar e inserir 100 pessoas e 4000 vendas
const insertData = async () => {
  try {
    // Contar pessoas e vendas já existentes
    let pessoasCount = await countRecords('pessoa');
    let vendasCount = await countRecords('venda');

    // Limites
    const maxPessoas = 100;
    const maxVendas = 4000;

    // Inserindo pessoas se não atingir o limite
    while (pessoasCount < maxPessoas) {
      const nome = generateRandomName();
      const email = generateEmail(nome);

      // Verificar se o email já está em uso
      const emailJaExiste = await emailExists(email);
      if (emailJaExiste) {
        console.warn(`Email duplicado detectado: ${email}, gerando um novo...`);
        continue; // Gerar nova pessoa e email
      }

      const pessoa: Pessoa = {
        nome: nome,
        cpf: generateCPF(),
        idade: generateRandomAge(), // Gerando idade aleatória
        email: email // Gerando email baseado no nome
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

      pessoasCount++; // Incrementar o contador de pessoas inseridas

      // Inserindo vendas para essa pessoa, se não atingir o limite de 4000 vendas
      let vendasInseridasPorPessoa = 0;
      while (vendasCount < maxVendas && vendasInseridasPorPessoa < 40) {
        const venda: Venda = {
          pessoa_id: pessoaId,
          vendedor_id: pessoaId, // Considerando que a pessoa é o vendedor também
          valor: (Math.random() * 1000).toFixed(2),
          data: generateRandomDate(), // Gerando data aleatória
          quantidade: Math.floor(Math.random() * 10) + 1, // Gerando quantidade aleatória entre 1 e 10
        };

        const { error: vendaError } = await supabase
          .from('venda')
          .insert([venda]);

        if (vendaError) {
          console.error('Erro ao inserir venda:', vendaError.message);
          return;
        }

        vendasCount++; // Incrementar o contador de vendas inseridas
        vendasInseridasPorPessoa++; // Limitar 40 vendas por pessoa
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
      <h1>Inserção Automática</h1>
      <p>Inserindo dados automaticamente...</p>
    </div>
  );
}
