import { AbrigoAnimais } from './abrigo-animais.js';

// Instancie a classe
const abrigo = new AbrigoAnimais();

// Teste 1: Rex vai para pessoa 1, Fofo para o abrigo
console.log("Teste 1:");
console.log(abrigo.encontraPessoas('RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo'));

// Teste 2: Animal inválido
console.log("\nTeste 2:");
console.log(abrigo.encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu'));

// Teste 3: Teste com mais animais
console.log("\nTeste 3:");
console.log(abrigo.encontraPessoas('BOLA,LASER', 'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola'));

// Teste 4: Teste com o jabuti Loco
console.log("\nTeste 4:");
console.log(abrigo.encontraPessoas('SKATE,RATO,BOLA', 'NOVELO,LASER', 'Loco,Rex'));