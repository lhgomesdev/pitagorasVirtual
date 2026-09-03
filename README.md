# Pitágoras Virtual 🧮🎉

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

Uma versão digital e de código aberto inspirada no famoso party game de matemática "Pitágoras", de **Reiner Knizia**, publicado pela Adoleta Jogos. Treine seu raciocínio lógico e velocidade em desafios matemáticos dinâmicos!

## 🔷️ Acesse o site para jogar
[pitagoras.lhgomes.dev.br](https://pitagoras.lhgomes.dev.br/)

## 🎮 Modos de Jogo

* **1 Jogador (Time Attack):** Você contra o relógio. 120 segundos para resolver o máximo de equações que conseguir. Quanto mais cartas usar na equação, mais pontos você ganha! Seu melhor resultado fica salvo no navegador como recorde pessoal.

* **Multiplayer Local:** Reúna de 2 a 4 amigos na mesma tela. Não há limite de tempo, mas quem pensar na resposta primeiro deve apertar o seu buzzer (botão) para roubar a vez e tentar responder. Errou? Fica bloqueado na rodada!

## ✨ Recursos

* **Recorde pessoal:** a maior pontuação do modo 1 Jogador fica salva localmente (`localStorage`) — sem necessidade de conta ou backend.
* **Efeitos sonoros:** feedback sonoro leve (clique, acerto, erro, buzzer) gerado via Web Audio API, sem arquivos de áudio externos. Pode ser silenciado a qualquer momento pelo botão no canto superior.
* **Visual "mesa de jogo":** paleta vibrante multicolor e cartas com bordas grossas e sombra sólida, inspiradas em jogos de tabuleiro físicos.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica.
* **CSS3 puro:** Sem frameworks ou build step. Paleta e espaçamentos centralizados em variáveis CSS (`:root`), componentes nomeados (`.btn`, `.card`, `.panel`...) e um detalhe de acabamento: cada bloco colorido define seu próprio `::selection` invertido — selecionar texto numa carta azul destaca em creme com o texto azul, por exemplo.
* **JavaScript:** Toda a lógica do jogo, sistema de gerador de alvos inteligentes (que garante que sempre haja uma solução), controle de rodadas e pontuação, persistência de recordes e efeitos sonoros via Web Audio API.

## 🧠 Como funciona a "Geração Inteligente de Alvos"

Para evitar a frustração de alvos impossíveis de resolver, o algoritmo do jogo seleciona de 2 a 3 cartas que já estão na mesa e aplica operadores matemáticos aleatoriamente nos bastidores. O resultado dessa conta invisível torna-se o "Alvo" da rodada, garantindo matematicamente que sempre existirá pelo menos uma solução possível.

## 📁 Estrutura do projeto

```
index.html
assets/
├── css/style.css     # variáveis de paleta, componentes (.btn, .card, .panel...), ::selection por bloco
├── js/
│   ├── storage.js    # recordes e histórico (localStorage)
│   ├── sound.js       # efeitos sonoros (Web Audio API)
│   └── script.js      # estado e lógica do jogo
└── img/favicon-32x32.png
```

## 🚀 Rodando localmente

Não há build step — é só clonar e abrir o `index.html` no navegador:

```bash
git clone https://github.com/lhgomesdev/pitagorasVirtual
cd pitagorasVirtual
```

Depois abra `index.html` diretamente (duplo clique ou `start index.html` / `open index.html`).

## 🤝 Contribuição

Sinta-se à vontade para realizar um fork do projeto e abrir Pull Requests com melhorias, novos modos de jogo ou efeitos sonoros!

## 📜 Licença

Este projeto é apenas para fins educacionais e de portfólio. A mecânica original do jogo é de autoria de Reiner Knizia. O código deste repositório está sob a licença [MIT](https://choosealicense.com/licenses/mit/).