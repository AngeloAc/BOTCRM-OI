// const fs = require('fs');
// const { exec } = require('child_process');


// const novaPasta = 'file_0010001';
// const indexJSContent = "console.log('olá mundo...');";

// // Criar nova pasta
// fs.mkdir(novaPasta, (err) => {
//   if (err) {
//     console.error(`Erro ao criar a pasta "${novaPasta}": ${err.message}`);
//     return;
//   }
//   console.log(`Pasta "${novaPasta}" criada com sucesso!`);

//   // Acessar a pasta criada
//   process.chdir(novaPasta);
//   console.log(`Acessou a pasta "${novaPasta}"`);

//   // Criar o arquivo index.js
//   fs.writeFile('index.js', indexJSContent, (err) => {
//     if (err) {
//       console.error(`Erro ao criar o arquivo "index.js": ${err.message}`);
//       return;
//     }
//     console.log(`Arquivo "index.js" criado com sucesso!`);

//     // Executar o comando "npm init"
//     exec('npm init -y', (err, stdout, stderr) => {
//       if (err) {
//         console.error(`Erro ao executar "npm init": ${err.message}`);
//         return;
//       }
//       console.log('Comando "npm init" executado com sucesso!');

//       // Executar o arquivo "index.js" com Node.js
//       exec('node index.js', (err, stdout, stderr) => {
//         if (err) {
//           console.error(`Erro ao executar "node index.js": ${err.message}`);
//           return;
//         }
//         console.log('Arquivo "index.js" executado com sucesso!');
//         console.log('Saída do arquivo "index.js":');
//         console.log(stdout);
//       });
//     });
//   });
// });

// const {CustomAI } = require('./CustomAI');


// const c = new CustomAI();

// c.generateData('ola ');

// function extractJavaCodeBlocks(code, inputString) {
//     // const regex = /```${code}([\s\S]*?)```/g;
//     const regex = new RegExp('```' + code + '([\\s\\S]*?)```', 'g');
//     const matches = [];
//     let match;

//     while ((match = regex.exec(inputString)) !== null) {
//         matches.push(match[1]);
//     }

//     return matches;
// }
// const input = `
// Claro! Aqui está um exemplo de código Java que exibe os números pares até 10:

// \`\`\`java
// public class NumerosPares {
//     public static void main(String[] args) {
//         for (int i = 1; i <= 10; i++) {
//             if (i % 2 == 0) {
//                 System.out.println(i);
//             }
//         }
//     }
// }
// \`\`\`

// Este código utiliza um laço de repetição \`for\` para percorrer os números de 1 a 10. A condição \`if\` verifica se cada número é par, pois um número é par quando o resto da divisão por 2 é igual a 0.
// `;

// const javaCodeBlocks = extractJavaCodeBlocks('java', input);

// console.log(javaCodeBlocks);


// function extractJavaCodeBlocks(inputString) {
//     const insideJavaRegex = /```java([\s\S]*?)```/g;
//     const outsideJavaRegex = /```java([\s\S]*?)```|([\s\S]+)/g;

//     const insideMatches = [];
//     const outsideMatches = [];

//     let insideMatch;
//     let outsideMatch;

//     while ((insideMatch = insideJavaRegex.exec(inputString)) !== null) {
//         insideMatches.push(insideMatch[1]);
//     }

//     let lastIndex = 0;
//     while ((outsideMatch = outsideJavaRegex.exec(inputString)) !== null) {
//         if (outsideMatch[1]) {
//             outsideMatches.push(inputString.substring(lastIndex, outsideJavaRegex.lastIndex - outsideMatch[1].length - 6));
//             lastIndex = outsideJavaRegex.lastIndex;
//         } else if (outsideMatch[2]) {
//             outsideMatches.push(outsideMatch[2]);
//             lastIndex = outsideJavaRegex.lastIndex;
//         }
//     }

//     return {
//         insideJava: insideMatches,
//         outsideJava: outsideMatches
//     };
// }

// const input = `
// Hello, this is some text.

// \`\`\`java
// public class Example {
//     public static void main(String[] args) {
//         System.out.println("Hello, Java!");
//     }
// }
// \`\`\`

// More text outside of java code.

// \`\`\`java
// public class AnotherExample {
//     public static void main(String[] args) {
//         System.out.println("Another Hello, Java!");
//     }
// }
// \`\`\`
// `;

// const extracted = extractJavaCodeBlocks(input);
// console.log("Inside Java Code:");
// console.log(extracted.insideJava);

// console.log("\nOutside Java Code:");
// console.log(extracted.outsideJava);


  const { generateImage }  = require('./controller');

const image = async () =>{
   const i = await generateImage();
//    console.log(i);
}

image()

// editImage();