# Pitágoras Virtual 🧮⏱️

Uma versão digital e de código aberto inspirada no famoso party game de matemática "Pitágoras", de **Reiner Knizia**, publicado pela Adoleta Jogos. Treine seu raciocínio lógico e velocidade em desafios matemáticos dinâmicos!

## 🔷️ Acesse o site para jogar
[Link do Site](https://lhgomesdev.github.io/pitagorasVirtual/)

## 🎮 Modos de Jogo

* **1 Jogador (Time Attack):** Você contra o relógio. 90 segundos para resolver o máximo de equações que conseguir. Quanto mais cartas usar na equação, mais pontos você ganha!

* **Multiplayer Local:** Reúna de 2 a 4 amigos na mesma tela. Não há limite de tempo, mas quem pensar na resposta primeiro deve apertar o seu buzzer (botão) para roubar a vez e tentar responder. Errou? Fica bloqueado na rodada!

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estruturação semântica.
* **JavaScript:** Toda a lógica do jogo, sistema de gerador de alvos inteligentes (que garante que sempre haja uma solução), controle de rodadas e pontuação.
* **_Tailwind_ CSS:** Utilizado via CDN para uma estilização rápida, responsiva e moderna.

## 🧠 Como funciona a "Geração Inteligente de Alvos"

Para evitar a frustração de alvos impossíveis de resolver, o algoritmo do jogo seleciona de 2 a 3 cartas que já estão na mesa e aplica operadores matemáticos aleatoriamente nos bastidores. O resultado dessa conta invisível torna-se o "Alvo" da rodada, garantindo matematicamente que sempre existirá pelo menos uma solução possível.

## 🤝 Contribuição

Sinta-se à vontade para realizar um fork do projeto e abrir Pull Requests com melhorias, novos modos de jogo ou efeitos sonoros!

## 📜 Licença

Este projeto é apenas para fins educacionais e de portfólio. A mecânica original do jogo é de autoria de Reiner Knizia. O código deste repositório está sob a licença [MIT](https://choosealicense.com/licenses/mit/).