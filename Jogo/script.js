const game = document.getElementById('game');
const basket = document.getElementById('basket');
const basketHitbox = document.getElementById('basket-hitbox');
const scoreText = document.getElementById('score');

let score = 0;
let speed = 1.5;
let spawnInterval = 2500;
let basketSpeed = 5;
let keys = {};
let chipsApareceu = false;
let spawnPaused = false;

// Função para iniciar o modo chefe final
function triggerBossIntro() {
  spawnPaused = true;
  modoBossAtivo = true; // ativa o modo boss (usado em boss.js)

  // Pausa a música do jogo base e prepara a do boss
  const musicaFundo = document.getElementById('musica-fundo');
  const musicaBoss = document.getElementById('musica-boss');
  musicaFundo.pause();
  musicaBoss.currentTime = 0;
  musicaBoss.play();

  // Remove todos os itens atuais do jogo base
  const allItems = document.querySelectorAll('.falling');
  allItems.forEach(el => el.remove());

  // Mostra mensagem temporária
  const msg = document.createElement('div');
  msg.textContent = 'O chefe final está vindo, use as setas para andar nas 8 direções';
  msg.style.position = 'absolute';
  msg.style.top = '40%';
  msg.style.left = '10%';
  msg.style.width = '80%';
  msg.style.fontSize = '28px';
  msg.style.color = 'red';
  msg.style.fontWeight = 'bold';
  msg.style.textAlign = 'center';

  const game = document.getElementById('game');
  game.appendChild(msg);

  // Remove a mensagem após 3 segundos
  setTimeout(() => {
    msg.remove();
    // boss.js já está carregado via <script> no index.html e será ativado por modoBossAtivo
  }, 3000);
}





window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

let basketX = game.offsetWidth / 2 - 50;
basket.style.left = basketX + 'px';

function moveBasket() {
  if (keys['ArrowLeft']) basketX -= basketSpeed;
  if (keys['ArrowRight']) basketX += basketSpeed;

  basketX = Math.max(0, Math.min(game.offsetWidth - basket.offsetWidth, basketX));
  basket.style.left = basketX + 'px';
}

function createFallingItem() {
  const rand = Math.random();
  const canShowRoxa = score >= 40;
  const canShowPoro = score >= 60;
  const canShowFarinha = score >= 80;
  const canShowAcelga = score >= 100;
  const canShowMao = score >= 120;
  const canShowRucula = score >= 140;

  if (rand < 0.015 && canShowMao) {
    createMaoMandiocaFrita();
    return;
  }

  const item = document.createElement('img');
  let isGood = true;
  let isMandiocaRoxa = false;
  let isPoro = false;
  let isFarinha = false;
  let isAcelga = false;
  let isRucula = false;

  if (rand < 0.05 && canShowRucula) {
    item.src = '../Imagens/Rucula.png';
    item.className = 'falling bad rucula';
    isGood = false;
    isRucula = true;
  } else if (rand < 0.1 && canShowAcelga) {
    item.src = '../Imagens/Acelga.png';
    item.className = 'falling bad acelga';
    isGood = false;
    isAcelga = true;
  } else if (rand < 0.15 && canShowFarinha) {
    item.src = '../Imagens/Farinhamandioca.png';
    item.className = 'falling good farinha';
    isFarinha = true;
  } else if (rand < 0.25 && canShowPoro) {
    item.src = '../Imagens/Poró.png';
    item.className = 'falling bad poro';
    isGood = false;
    isPoro = true;
  } else if (rand < 0.35 && canShowRoxa) {
    item.src = '../Imagens/Mandiocaroxa.png';
    item.className = 'falling good roxa';
    isMandiocaRoxa = true;
  } else if (rand < 0.8) {
    item.src = '../Imagens/Mandioca.png';
    item.className = 'falling good';
  } else {
    item.src = '../Imagens/Lixo.png';
    item.className = 'falling bad';
    isGood = false;
  }

  const gameWidth = game.offsetWidth;
  const gameHeight = game.offsetHeight;
  item.style.left = Math.random() * (gameWidth - 50) + 'px';
  item.style.top = '0px';
  game.appendChild(item);

  let posY = 0;
  let phase = 0;
  let hasEscaped = false;
  let escapeDirection = Math.random() < 0.5 ? -1 : 1;
  let poroSpeedX = 0, poroSpeedY = 0, poroTimer = 0;
  let acelgaZig = 0;
  let ruculaTimer = 0;
  let tirosDados = 0;
  let nextTiro = 0;

  const fall = setInterval(() => {
    const itemX = parseFloat(item.style.left);
    const itemCenterX = itemX + 25;
    const itemCenterY = posY + 25;

    // RUCULA
    if (isRucula) {
      if (phase === 0) {
        posY += speed;
        if (posY >= gameHeight * 0.45) {
          phase = 1;
          ruculaTimer = 0;
          tirosDados = 0;
          nextTiro = 0;
        }
      } else if (phase === 1) {
        ruculaTimer += 20;

        const targetX = basketX + basket.offsetWidth / 2;
        const dx = targetX - itemCenterX;
        const dy = gameHeight - itemCenterY;
        const angle = Math.atan2(dy, dx);

        item.style.transform = `rotate(${angle + Math.PI / 2}rad)`;

        if (ruculaTimer >= nextTiro && tirosDados < 3) {
          shootRaiz(itemCenterX, itemCenterY, angle);
          tirosDados++;
          nextTiro = ruculaTimer + 600;
        }

        if (tirosDados >= 3 && ruculaTimer >= 2600) {
          clearInterval(fall);
          item.remove();
        }
      }
    }

    // PORÓ
    else if (isPoro) {
      if (phase === 0) {
        posY += speed;
        if (posY >= gameHeight / 3) {
          phase = 1;
          poroTimer = 0;
        }
      } else if (phase === 1) {
        poroTimer += 20;
        const targetX = basketX + basket.offsetWidth / 2;
        const dx = targetX - itemCenterX;
        const dy = gameHeight - itemCenterY;
        const angle = Math.atan2(dy, dx);
        item.style.transform = `rotate(${angle + Math.PI / 2}rad)`;
        if (poroTimer >= 1400) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          poroSpeedX = (dx / dist) * (speed + 1.5);
          poroSpeedY = (dy / dist) * (speed + 1.5);
          item.style.transform = '';
          phase = 2;
        }
      } else if (phase === 2) {
        posY += poroSpeedY;
        item.style.left = (itemX + poroSpeedX) + 'px';
      }
    }

    // Mandioca roxa
    else if (isMandiocaRoxa) {
      if (phase === 0) posY += speed;
      else if (phase === 1) {
        posY -= 3.5;
        let newLeft = itemX + escapeDirection * 5;
        if (newLeft >= 0 && newLeft <= gameWidth - 50)
          item.style.left = newLeft + 'px';
        if (posY <= 50) phase = 2;
      } else posY += speed;
    }

    // Acelga
    else if (isAcelga) {
      posY += 0.8;
      acelgaZig += 0.05;
      const offset = Math.sin(acelgaZig) * 3;
      item.style.left = (itemX + offset) + 'px';
    }

    // Normal
    else {
      posY += speed;
    }

    item.style.top = posY + 'px';

    const itemRect = item.getBoundingClientRect();
    const hitboxRect = basketHitbox.getBoundingClientRect();
    const overlap =
      itemRect.bottom >= hitboxRect.top &&
      itemRect.top <= hitboxRect.bottom &&
      itemRect.left < hitboxRect.right &&
      itemRect.right > hitboxRect.left;

    if (isMandiocaRoxa && phase === 0 && overlap && !hasEscaped) {
      phase = 1;
      hasEscaped = true;
      return;
    }

    if (overlap && phase !== 1) {
      clearInterval(fall);
      item.remove();

      if (isFarinha) {
        const n = Math.floor(Math.random() * 36) + 5;
        for (let i = 0; i < n; i++) {
          createMiniFarinha(itemX + 25, posY + 25);
        }
      }

      if (item.classList.contains('acelga')) {
        score -= 10;
      } else if (item.classList.contains('good')) {
        if (item.classList.contains('roxa')) score += 5;
        else if (item.classList.contains('farinha')) ; // mini farinhas já pontuam
        else score += 2;
      } else {
        score -= 5;
      }

      scoreText.textContent = 'Pontos: ' + score;
    } else if (posY > gameHeight || itemX < -60 || itemX > gameWidth + 60) {
      clearInterval(fall);
      item.remove();
    }
  }, 20);
}

function spawnLoop() {
  if (!spawnPaused) {
    createFallingItem();
  }

  if (score >= 500 && !chipsApareceu && !document.querySelector('.chipsmandioca')) {
    createChipsMandioca();
    chipsApareceu = true;
  }

  const dificuldade = score / 10 + Date.now() / 10000000;
  speed = Math.min(2.5 + dificuldade, 10);
  spawnInterval = Math.max(500, 2200 - dificuldade * 130);
  basketSpeed = Math.min(5 + dificuldade * 0.3, 12);
  setTimeout(spawnLoop, spawnInterval);
}


function gameLoop() {
  moveBasket();
  requestAnimationFrame(gameLoop);
}

gameLoop();
spawnLoop();

function createMiniFarinha(x, y) {
  const mini = document.createElement('img');
  mini.src = '../Imagens/Farinhamandioca.png';
  mini.className = 'falling good';
  mini.style.width = '20px';
  mini.style.height = '20px';
  mini.style.position = 'absolute';
  mini.style.left = x + 'px';
  mini.style.top = y + 'px';
  game.appendChild(mini);

  const angle = Math.random() * Math.PI * 2;
  let speedX = Math.cos(angle) * (Math.random() * 3 + 1);
  let speedY = Math.sin(angle) * (Math.random() * -4 - 2);
  let posX = x;
  let posY = y;

  const move = setInterval(() => {
    posX += speedX;
    posY += speedY;
    speedY += 0.2;

    mini.style.left = posX + 'px';
    mini.style.top = posY + 'px';

    const miniRect = mini.getBoundingClientRect();
    const hitboxRect = basketHitbox.getBoundingClientRect();
    const overlap =
      miniRect.bottom >= hitboxRect.top &&
      miniRect.top <= hitboxRect.bottom &&
      miniRect.left < hitboxRect.right &&
      miniRect.right > hitboxRect.left;

    if (overlap) {
      clearInterval(move);
      mini.remove();
      score += 1;
      scoreText.textContent = 'Pontos: ' + score;
    } else if (posY > game.offsetHeight || posX < -50 || posX > game.offsetWidth + 50) {
      clearInterval(move);
      mini.remove();
    }
  }, 20);
}

function createMaoMandiocaFrita() {
  const mao = document.createElement('img');
  mao.src = '../Imagens/Maomandiocafrita.png';
  mao.className = 'falling good';
  mao.style.position = 'absolute';
  mao.style.top = '-60px';
  mao.style.left = Math.random() * (game.offsetWidth - 80) + 'px';
  mao.style.width = '80px';
  mao.style.height = 'auto';
  game.appendChild(mao);

  let topY = 0;
  const aimLine = document.createElement('div');
  aimLine.className = 'mao-aim-line';
  mao.appendChild(aimLine);

  const enter = setInterval(() => {
    topY += 2;
    if (topY >= 0) {
      clearInterval(enter);
      mao.style.top = '0px';
      setTimeout(() => {
        aimLine.remove();
        let timePassed = 0;
        let direction = 1;
        const shake = setInterval(() => {
          timePassed += 50;
          mao.style.top = (direction > 0 ? '-5px' : '0px');
          direction *= -1;

          createMandiocaFrita(parseFloat(mao.style.left) + 30);

          if (timePassed >= 2200) {
            clearInterval(shake);
            const exit = setInterval(() => {
              topY -= 3;
              mao.style.top = topY + 'px';
              if (topY <= -60) {
                clearInterval(exit);
                mao.remove();
              }
            }, 20);
          }
        }, 100);
      }, 2000);
    } else {
      mao.style.top = topY + 'px';
    }
  }, 20);
}

function createMandiocaFrita(x) {
  const f = document.createElement('img');
  f.src = '../Imagens/Mandiocafrita.png';
  f.className = 'falling good';
  f.style.width = '30px';
  f.style.height = '30px';
  f.style.position = 'absolute';
  f.style.left = x + 'px';
  f.style.top = '0px';
  game.appendChild(f);

  let posY = 0;
  let speedY = 5 + Math.random() * 2;

  const fall = setInterval(() => {
    posY += speedY;
    f.style.top = posY + 'px';

    const rect = f.getBoundingClientRect();
    const basketRect = basketHitbox.getBoundingClientRect();
    const overlap =
      rect.bottom >= basketRect.top &&
      rect.top <= basketRect.bottom &&
      rect.left < basketRect.right &&
      rect.right > basketRect.left;

    if (overlap) {
      clearInterval(fall);
      f.remove();
      score += 1;
      scoreText.textContent = 'Pontos: ' + score;
    } else if (posY > game.offsetHeight) {
      clearInterval(fall);
      f.remove();
    }
  }, 20);
}

function shootRaiz(x, y, angle) {
  const raiz = document.createElement('img');
  raiz.src = '../Imagens/Raiz.png';
  raiz.className = 'falling bad';
  raiz.style.width = '20px';
  raiz.style.height = '20px';
  raiz.style.position = 'absolute';
  raiz.style.left = x + 'px';
  raiz.style.top = y + 'px';
  raiz.style.transform = `rotate(${angle + Math.PI / 2}rad)`;
  game.appendChild(raiz);

  let posX = x;
  let posY = y;
  const speed = 6;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  const move = setInterval(() => {
    posX += vx;
    posY += vy;
    raiz.style.left = posX + 'px';
    raiz.style.top = posY + 'px';

    const rect = raiz.getBoundingClientRect();
    const basketRect = basketHitbox.getBoundingClientRect();

    const overlap =
      rect.bottom >= basketRect.top &&
      rect.top <= basketRect.bottom &&
      rect.left < basketRect.right &&
      rect.right > basketRect.left;

    if (overlap) {
      clearInterval(move);
      raiz.remove();
      score -= 20;
      scoreText.textContent = 'Pontos: ' + score;
    } else if (
      posY < -30 || posY > game.offsetHeight + 30 ||
      posX < -30 || posX > game.offsetWidth + 30
    ) {
      clearInterval(move);
      raiz.remove();
    }
  }, 20);
}

function createChipsMandioca() {
  const chip = document.createElement('img');
  chip.src = '../Imagens/Chipsmandioca.png';
  chip.className = 'falling good chipsmandioca';
  chip.style.width = '60px';
  chip.style.height = '60px';
  chip.style.position = 'absolute';
  chip.style.left = Math.random() * (game.offsetWidth - 60) + 'px';
  chip.style.top = '0px';
  game.appendChild(chip);

  let posY = 0;
  const fall = setInterval(() => {
    if (spawnPaused) return;

    posY += 1;
    chip.style.top = posY + 'px';

    const rect = chip.getBoundingClientRect();
    const basketRect = basketHitbox.getBoundingClientRect();
    const overlap =
      rect.bottom >= basketRect.top &&
      rect.top <= basketRect.bottom &&
      rect.left < basketRect.right &&
      rect.right > basketRect.left;

    if (overlap) {
      clearInterval(fall);
      chip.remove();
      ativarModoBoss();
    } else if (posY > game.offsetHeight) {
      clearInterval(fall);
      chip.remove();
    }
  }, 20);
}

window.addEventListener('keydown', function (e) {
  if (e.key === 'Backspace') {
    // Redireciona para a tela inicial do site (ajuste o caminho conforme necessário)
    window.location.href = '../index.html';
  }
});



// === CÓDIGO TEMPORÁRIO PARA TESTES: tecla "+" dá 100 pontos
window.addEventListener('keydown', (e) => {
  if (e.key === '+') {
    score += 100;
    scoreText.textContent = 'Pontos: ' + score;
    console.log('Pontos adicionados para teste: ' + score);
  }
});
