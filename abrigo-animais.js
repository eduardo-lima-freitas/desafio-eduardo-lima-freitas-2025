class AbrigoAnimais {
  constructor() {
    // Dados dos animais conforme a tabela
    this.animais = {
      'Rex': { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      'Mimi': { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      'Fofo': { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      'Zero': { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      'Bola': { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      'Bebe': { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      'Loco': { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    };
    
    // Lista de todos os brinquedos válidos
    this.brinquedosValidos = ['RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE'];
  }

  // Função principal
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    try {
      // Converter strings para arrays
      const pessoa1 = brinquedosPessoa1.split(',');
      const pessoa2 = brinquedosPessoa2.split(',');
      const animaisParaAvaliar = ordemAnimais.split(',');
      
      // Validar entradas
      const validacao = this.validarEntradas(pessoa1, pessoa2, animaisParaAvaliar);
      if (validacao.erro) {
        return validacao;
      }
      
      // Processar adoções
      const resultado = this.processarAdocoes(pessoa1, pessoa2, animaisParaAvaliar);
      
      // Formatar saída final
      return this.formatarResultado(resultado);
    } catch (error) {
      return { erro: 'Erro ao processar os dados' };
    }
  }

  // Validação das entradas
  validarEntradas(pessoa1, pessoa2, animaisParaAvaliar) {
    // Verificar animais duplicados
    if (this.temDuplicados(animaisParaAvaliar)) {
      return { erro: 'Animal inválido' };
    }
    
    // Verificar animais válidos
    if (!this.todosAnimaisValidos(animaisParaAvaliar)) {
      return { erro: 'Animal inválido' };
    }
    
    // Verificar brinquedos duplicados
    if (this.temDuplicados(pessoa1) || this.temDuplicados(pessoa2)) {
      return { erro: 'Brinquedo inválido' };
    }
    
    // Verificar brinquedos válidos
    if (!this.todosBrinquedosValidos(pessoa1) || !this.todosBrinquedosValidos(pessoa2)) {
      return { erro: 'Brinquedo inválido' };
    }
    
    return {}; // Sem erro
  }

  // Verifica se há duplicados em um array
  temDuplicados(array) {
    return new Set(array).size !== array.length;
  }

  // Verifica se todos os animais são válidos
  todosAnimaisValidos(animais) {
    return animais.every(animal => this.animais[animal] !== undefined);
  }

  // Verifica se todos os brinquedos são válidos
  todosBrinquedosValidos(brinquedos) {
    return brinquedos.every(brinquedo => this.brinquedosValidos.includes(brinquedo));
  }

  // Verifica se a pessoa pode oferecer os brinquedos na ordem correta
  podeDarBrinquedos(animal, brinquedosPessoa) {
    const brinquedosDesejados = this.animais[animal].brinquedos;
    
    // Caso especial para o jabuti Loco (não se importa com a ordem)
    if (animal === 'Loco') {
      return brinquedosDesejados.every(b => brinquedosPessoa.includes(b));
    }
    
    // Para os outros animais, a ordem importa
    let indiceAtual = 0;
    
    for (const brinquedoDesejado of brinquedosDesejados) {
      let encontrou = false;
      
      // Procurar o brinquedo na ordem correta
      while (indiceAtual < brinquedosPessoa.length) {
        if (brinquedosPessoa[indiceAtual] === brinquedoDesejado) {
          encontrou = true;
          indiceAtual++;
          break;
        }
        indiceAtual++;
      }
      
      if (!encontrou) return false;
    }
    
    return true;
  }

  // Processa as adoções
  processarAdocoes(pessoa1, pessoa2, animaisParaAvaliar) {
    const resultado = {};
    let adocoesPessoa1 = 0;
    let adocoesPessoa2 = 0;
    
    // Primeira passada: determinar quem pode adotar cada animal
    for (const animal of animaisParaAvaliar) {
      const pessoa1PodeAdotar = this.podeDarBrinquedos(animal, pessoa1);
      const pessoa2PodeAdotar = this.podeDarBrinquedos(animal, pessoa2);
      
      // Regra 4: Se ambos podem adotar, ninguém fica com o animal
      if (pessoa1PodeAdotar && pessoa2PodeAdotar) {
        resultado[animal] = 'abrigo';
      } 
      // Regra 5: Limite de 3 animais por pessoa
      else if (pessoa1PodeAdotar && adocoesPessoa1 < 3) {
        resultado[animal] = 'pessoa 1';
        adocoesPessoa1++;
      } 
      else if (pessoa2PodeAdotar && adocoesPessoa2 < 3) {
        resultado[animal] = 'pessoa 2';
        adocoesPessoa2++;
      } 
      else {
        resultado[animal] = 'abrigo';
      }
    }
    
    // Segunda passada: aplicar regras especiais
    this.aplicarRegrasEspeciais(resultado, animaisParaAvaliar);
    
    return resultado;
  }

  // Aplicar regras especiais (gatos não compartilham brinquedos e Loco precisa de companhia)
  aplicarRegrasEspeciais(resultado, animaisParaAvaliar) {
    // Regra 6: Loco precisa de companhia
    if (animaisParaAvaliar.includes('Loco')) {
      if (resultado['Loco'] === 'pessoa 1') {
        const outrosAnimaisPessoa1 = Object.entries(resultado)
          .filter(([nome, dono]) => nome !== 'Loco' && dono === 'pessoa 1')
          .length;
          
        if (outrosAnimaisPessoa1 === 0) {
          resultado['Loco'] = 'abrigo';
        }
      } else if (resultado['Loco'] === 'pessoa 2') {
        const outrosAnimaisPessoa2 = Object.entries(resultado)
          .filter(([nome, dono]) => nome !== 'Loco' && dono === 'pessoa 2')
          .length;
          
        if (outrosAnimaisPessoa2 === 0) {
          resultado['Loco'] = 'abrigo';
        }
      }
    }
    
    // Regra 3: Gatos não compartilham brinquedos
    this.verificarBrinquedosGatos(resultado, animaisParaAvaliar, 'pessoa 1');
    this.verificarBrinquedosGatos(resultado, animaisParaAvaliar, 'pessoa 2');
  }

  // Verifica se gatos compartilham brinquedos
  verificarBrinquedosGatos(resultado, animaisParaAvaliar, pessoa) {
    const gatosDaPessoa = animaisParaAvaliar
      .filter(animal => 
        this.animais[animal].tipo === 'gato' && 
        resultado[animal] === pessoa
      );
    
    if (gatosDaPessoa.length > 1) {
      // Verificar se há gatos que compartilham brinquedos
      for (let i = 0; i < gatosDaPessoa.length; i++) {
        for (let j = i + 1; j < gatosDaPessoa.length; j++) {
          const gato1 = gatosDaPessoa[i];
          const gato2 = gatosDaPessoa[j];
          
          // Verificar se há brinquedos em comum
          const brinquedosComuns = this.animais[gato1].brinquedos
            .filter(b => this.animais[gato2].brinquedos.includes(b));
            
          if (brinquedosComuns.length > 0) {
            // Se há brinquedos em comum, ambos vão para o abrigo
            resultado[gato1] = 'abrigo';
            resultado[gato2] = 'abrigo';
          }
        }
      }
    }
  }

  // Formata o resultado final
  formatarResultado(resultado) {
    const lista = Object.keys(resultado)
      .sort() // Ordem alfabética
      .map(animal => `${animal} - ${resultado[animal]}`);
      
    return { lista };
  }
}

export { AbrigoAnimais as AbrigoAnimais };