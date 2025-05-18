// boss.js - ativado após pegar Chipsmandioca
if (modoBossAtivo) startBoss();

function iniciarBoss() {
  // lógica do boss: setupLives(), startBoss(), gameLoop(), etc.
}


  const game = document.getElementById('game');
  const basket = document.getElementById('basket');
  const basketHitbox = document.getElementById('basket-hitbox');
  const musicaBoss = document.getElementById('musica-boss');

  let basketX = game.offsetWidth / 2 - 50;
  let basketY = game.offsetHeight - 60;
  let keys = {};
  let lives = 3;
  let lifeUI = [];
  let boss;
  let bossActive = false;

  // Música do boss
  musicaBoss.currentTime = 0;
  musicaBoss.play();

  // Movimento do cesto em 8 direções
  function moveBasket() {
    let dx = 0, dy = 0;
    if (keys['ArrowLeft']) dx -= 1;
    if (keys['ArrowRight']) dx += 1;
    if (keys['ArrowUp']) dy -= 1;
    if (keys['ArrowDown']) dy += 1;

    if (dx !== 0 || dy !== 0) {
      const norm = Math.sqrt(dx * dx + dy * dy);
      basketX += (dx / norm) * 5;
      basketY += (dy / norm) * 5;
    }

    basketX = Math.max(0, Math.min(game.offsetWidth - basket.offsetWidth, basketX));
    basketY = Math.max(0, Math.min(game.offsetHeight - basket.offsetHeight, basketY));
    basket.style.left = basketX + 'px';
    basket.style.top = basketY + 'px';
  }

  function checkBossCollision() {
  if (!bossActive || lives <= 0 || !boss) return;

  const bossRect = boss.getBoundingClientRect();
  const basketRect = basketHitbox.getBoundingClientRect();

  // Reduzimos o tamanho da hitbox em 10% de cada lado (~80% do total)
  const shrink = 0.1;
  const bossHitbox = {
    top: bossRect.top + bossRect.height * shrink,
    bottom: bossRect.bottom - bossRect.height * shrink,
    left: bossRect.left + bossRect.width * shrink,
    right: bossRect.right - bossRect.width * shrink
  };

  const overlap =
    basketRect.bottom >= bossHitbox.top &&
    basketRect.top <= bossHitbox.bottom &&
    basketRect.left < bossHitbox.right &&
    basketRect.right > bossHitbox.left;

  if (overlap) {
    lives -= 3;
    updateLivesUI();
  }
}

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  // TESTE: tecla "M" ativa vitória imediata
  if (e.key.toLowerCase() === 'm') {
    console.log("Vitória ativada via tecla M");
    gameVictory();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});


  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);
  

  // Entrada do chefe (descendo do topo)
  function startBoss() {
    boss = document.createElement('img');
    boss.src = '../../Imagens/Aboboss.png';
    boss.style.position = 'absolute';
    boss.style.width = '120px';
    boss.style.height = '120px';
    boss.style.left = game.offsetWidth / 2 - 60 + 'px';
    boss.style.top = '-120px';
    game.appendChild(boss);

    let posY = -120;
    const descend = setInterval(() => {
      posY += 2;
      boss.style.top = posY + 'px';
      if (posY >= game.offsetHeight / 2 - 60) {
        clearInterval(descend);
        bossActive = true;
        triggerNextAttack(); // iniciará os ataques (Parte 3)
      }
    }, 20);
  }

  // Game loop
  function gameLoop() {
  if (bossActive) {
    moveBasket();
    checkBossCollision(); // 🚨 chamada contínua
  }
  requestAnimationFrame(gameLoop);
}

  // Início do boss
  setupLives();
  startBoss();
  gameLoop();


  function setupLives() {
    const lifeContainer = document.createElement('div');
    lifeContainer.id = 'life-ui';
    lifeContainer.style.position = 'absolute';
    lifeContainer.style.top = '10px';
    lifeContainer.style.left = '10px';
    lifeContainer.style.display = 'flex';
    lifeContainer.style.gap = '5px';
    game.appendChild(lifeContainer);

    for (let i = 0; i < 2; i++) {
      const heart = document.createElement('img');
      heart.src = '../../Imagens/FL.png';
      heart.style.width = '30px';
      heart.style.height = '30px';
      lifeContainer.appendChild(heart);
      lifeUI.push(heart);
    }
  }

  function updateLivesUI() {
    const full = Math.floor(lives / 2);
    const half = lives % 2;

    for (let i = 0; i < lifeUI.length; i++) {
      if (i < full) {
        lifeUI[i].src = '../../Imagens/FL.png';
      } else if (i === full && half === 1) {
        lifeUI[i].src = '../../Imagens/HL.png';
      } else {
        lifeUI[i].src = '../../Imagens/NL.png';
      }
    }

    if (lives <= 0) gameOver();
  }

  function loseLife() {
    lives--;
    updateLivesUI();
  }

   function gameOver() {
  bossActive = false;

  // Card de fundo
  const card = document.createElement('div');
  card.style.position = 'absolute';
  card.style.top = '30%';
  card.style.left = '50%';
  card.style.transform = 'translateX(-50%)';
  card.style.backgroundColor = '#f9f2dc';
  card.style.padding = '40px';
  card.style.borderRadius = '12px';
  card.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  card.style.textAlign = 'center';
  card.style.zIndex = '999';

  // Mensagem
  const msg = document.createElement('div');
  msg.textContent = 'GAME OVER';
  msg.style.fontSize = '36px';
  msg.style.color = 'red';
  msg.style.marginBottom = '20px';
  msg.style.fontWeight = 'bold';
  card.appendChild(msg);

  // Botão de reiniciar
  const btn = document.createElement('button');
  btn.textContent = 'Reiniciar Jogo';
  btn.style.padding = '12px 24px';
  btn.style.fontSize = '18px';
  btn.style.border = 'none';
  btn.style.borderRadius = '6px';
  btn.style.backgroundColor = '#ff6b6b';
  btn.style.color = 'white';
  btn.style.cursor = 'pointer';
  btn.style.transition = 'background-color 0.3s ease';
  btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#ff4b4b');
  btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#ff6b6b');

  btn.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  card.appendChild(btn);
  game.appendChild(card);
}

function gameVictory() {
  bossActive = false;

  const card = document.createElement('div');
  card.style.position = 'absolute';
  card.style.top = '30%';
  card.style.left = '50%';
  card.style.transform = 'translateX(-50%)';
  card.style.backgroundColor = '#f9f2dc';
  card.style.padding = '40px';
  card.style.borderRadius = '12px';
  card.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  card.style.textAlign = 'center';
  card.style.zIndex = '999';

  const msg = document.createElement('div');
  msg.textContent = 'Você venceu o chefe!';
  msg.style.fontSize = '32px';
  msg.style.color = 'green';
  msg.style.marginBottom = '20px';
  msg.style.fontWeight = 'bold';
  card.appendChild(msg);

  // Botão reiniciar
  const btnRestart = document.createElement('button');
  btnRestart.textContent = 'Reiniciar Jogo';
  btnRestart.style.margin = '10px';
  btnRestart.style.padding = '12px 24px';
  btnRestart.style.fontSize = '16px';
  btnRestart.style.border = 'none';
  btnRestart.style.borderRadius = '6px';
  btnRestart.style.backgroundColor = '#4CAF50';
  btnRestart.style.color = 'white';
  btnRestart.style.cursor = 'pointer';
  btnRestart.style.transition = 'background-color 0.3s ease';
  btnRestart.addEventListener('mouseenter', () => btnRestart.style.backgroundColor = '#45a049');
  btnRestart.addEventListener('mouseleave', () => btnRestart.style.backgroundColor = '#4CAF50');
  btnRestart.addEventListener('click', () => {
    window.location.reload();
  });

  // Botão voltar ao site
  const btnHome = document.createElement('button');
  btnHome.textContent = 'Voltar ao Início';
  btnHome.style.margin = '10px';
  btnHome.style.padding = '12px 24px';
  btnHome.style.fontSize = '16px';
  btnHome.style.border = 'none';
  btnHome.style.borderRadius = '6px';
  btnHome.style.backgroundColor = '#3498db';
  btnHome.style.color = 'white';
  btnHome.style.cursor = 'pointer';
  btnHome.style.transition = 'background-color 0.3s ease';
  btnHome.addEventListener('mouseenter', () => btnHome.style.backgroundColor = '#2980b9');
  btnHome.addEventListener('mouseleave', () => btnHome.style.backgroundColor = '#3498db');
  btnHome.addEventListener('click', () => {
    window.location.href = '../../Trabalhos/Do sertão a mesa/index.html'; // substitua pelo link real depois
  });

  card.appendChild(btnRestart);
  card.appendChild(btnHome);
  game.appendChild(card);
}


// Após 2 minutos (120000 ms), se ainda não morreu, vence o chefe
setTimeout(() => {
  if (lives > 0 && bossActive) {
    gameVictory();
  }
}, 120000);




    function triggerNextAttack() {
    if (!bossActive || lives <= 0) return;

    const attacks = [
      bossAttackPoroWall,
      bossAttackRaizes,
      bossAttackRuculaArtillery,
      bossAttackAcelgaRain,
      bossAttackBeterrabaStorm
    ];
    const randomAttack = attacks[Math.floor(Math.random() * attacks.length)];
    randomAttack(() => setTimeout(triggerNextAttack, 1000));
  }

  // 1. Barricada de Poró
  function bossAttackPoroWall(callback) {
  const centerX = parseFloat(boss.style.left) + 60;
  const centerY = parseFloat(boss.style.top) + 60;
  const poros = [];


  for (let i = -4; i <= 3; i++) {
    const poro = document.createElement('img');
    poro.src = '../../Imagens/Poró.png';
    poro.className = 'falling bad';
    poro.style.width = '50px';
    poro.style.height = '50px';
    poro.style.position = 'absolute';
    poro.style.left = (centerX + i * 55) + 'px';
    poro.style.top = centerY + 'px';
    const angle = Math.atan2(basketY + 25 - centerY, basketX + 25 - (centerX + i * 55));
    poro.style.transform = `rotate(${angle + Math.PI / 2}rad)`;
    game.appendChild(poro);
    poros.push(poro);
  }

  setTimeout(() => {
    // Após 0.5s, lançamos os Porós na direção atual do cesto
    poros.forEach(poro => {
      let startX = parseFloat(poro.style.left);
      let startY = parseFloat(poro.style.top);
      let dx = basketX + 25 - startX;
      let dy = basketY + 25 - startY;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let vx = (dx / dist) * 4;
      let vy = (dy / dist) * 4;

      const fall = setInterval(() => {
        startX += vx;
        startY += vy;
        poro.style.left = startX + 'px';
        poro.style.top = startY + 'px';

        const rect = poro.getBoundingClientRect();
        const basketRect = basketHitbox.getBoundingClientRect();
        if (
          rect.bottom >= basketRect.top &&
          rect.top <= basketRect.bottom &&
          rect.left < basketRect.right &&
          rect.right > basketRect.left
        ) {
          clearInterval(fall);
          poro.remove();
          loseLife();
        } else if (
          startY > game.offsetHeight + 50 ||
          startX < -60 || startX > game.offsetWidth + 60
        ) {
          clearInterval(fall);
          poro.remove();
        }
      }, 20);
    });

    setTimeout(callback, 2000); // passa para o próximo ataque após 2s
  }, 500); // espera 1,5s antes de lançar
}


  // 2. Raízes nas bordas
  function bossAttackRaizes(callback) {
    const areas = ['top', 'bottom'];
    const raizImgs = [];

    areas.forEach(area => {
      for (let i = 0; i < 3; i++) {
        const raiz = document.createElement('img');
        raiz.src = '../../Imagens/Raiz.png';
        raiz.className = 'falling bad';
        raiz.style.position = 'absolute';
        raiz.style.width = '30px';
        raiz.style.height = '30px';
        raiz.style.top = area === 'top' ? '10px' : (game.offsetHeight - 40) + 'px';
        raiz.style.left = (Math.random() * (game.offsetWidth - 30)) + 'px';
        game.appendChild(raiz);

        let vx = Math.random() < 0.5 ? -3 : 3;
        let posX = parseFloat(raiz.style.left);

        const move = setInterval(() => {
          posX += vx;
          if (posX <= 0 || posX >= game.offsetWidth - 30) vx *= -1;
          raiz.style.left = posX + 'px';

          const rect = raiz.getBoundingClientRect();
          const basketRect = basketHitbox.getBoundingClientRect();
          if (
            rect.bottom >= basketRect.top &&
            rect.top <= basketRect.bottom &&
            rect.left < basketRect.right &&
            rect.right > basketRect.left
          ) {
            clearInterval(move);
            raiz.remove();
            loseLife();
          }
        }, 20);

        raizImgs.push(raiz);
      }
    });

    setTimeout(() => {
      raizImgs.forEach(r => r.remove());
      callback();
    }, 6000);
  }

  // 3. Artilharia de Rúcula
  function bossAttackRuculaArtillery(callback) {
  for (let i = 0; i < 6; i++) {
    spawnAtiradoraRucula(20, 60 + i * 60); // lado esquerdo
    spawnAtiradoraRucula(game.offsetWidth - 80, 60 + i * 60); // lado direito
  }

  // Tempo total de execução do ataque
  setTimeout(callback, 4500);
}

function shootRaiz(x, y) {
  const raiz = document.createElement('img');
  raiz.src = '../../Imagens/Raiz.png';
  raiz.className = 'falling bad';
  raiz.style.position = 'absolute';
  raiz.style.width = '30px';
  raiz.style.height = '30px';
  raiz.style.left = x + 'px';
  raiz.style.top = y + 'px';
  game.appendChild(raiz);

  let dx = basketX + 25 - x;
  let dy = basketY + 25 - y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let vx = (dx / dist) * 6;
  let vy = (dy / dist) * 6;

  const move = setInterval(() => {
    x += vx;
    y += vy;
    raiz.style.left = x + 'px';
    raiz.style.top = y + 'px';

    const rect = raiz.getBoundingClientRect();
    const basketRect = basketHitbox.getBoundingClientRect();

    if (
      rect.bottom >= basketRect.top &&
      rect.top <= basketRect.bottom &&
      rect.left < basketRect.right &&
      rect.right > basketRect.left
    ) {
      clearInterval(move);
      raiz.remove();
      loseLife();
    } else if (y > game.offsetHeight + 30 || x < -30 || x > game.offsetWidth + 30) {
      clearInterval(move);
      raiz.remove();
    }
  }, 20);
}


function spawnAtiradoraRucula(x, y) {
  const rucula = document.createElement('img');
  rucula.src = '../../Imagens/Rucula.png';
  rucula.className = 'falling bad';
  rucula.style.width = '50px';
  rucula.style.height = '50px';
  rucula.style.position = 'absolute';
  rucula.style.left = x + 'px';
  rucula.style.top = y + 'px';
  game.appendChild(rucula);

  // Mira com rotação contínua
  const interval = setInterval(() => {
    const angle = Math.atan2(basketY + 25 - y, basketX + 25 - (x + 25));
    rucula.style.transform = `rotate(${angle + Math.PI / 2}rad)`;
  }, 50);

  // Após 1.4s, começa a atirar (mas continua mirando)
  setTimeout(() => {
    let shots = 0;
    const shoot = setInterval(() => {
      shots++;
      shootRaiz(x + 25, y + 25);
      if (shots >= 3) {
        clearInterval(shoot);
        clearInterval(interval); // 🔁 Só agora paramos de mirar
        rucula.remove();
      }
    }, 400);
  }, 1400);
}



  function spawnRucula(x, y) {
    const r = document.createElement('img');
    r.src = '../../Imagens/Rucula.png';
    r.className = 'falling bad';
    r.style.width = '50px';
    r.style.height = '50px';
    r.style.position = 'absolute';
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    game.appendChild(r);

    let dx = basketX + 25 - x;
    let dy = basketY + 25 - y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let vx = (dx / dist) * 4;
    let vy = (dy / dist) * 4;

    const move = setInterval(() => {
      x += vx;
      y += vy;
      r.style.left = x + 'px';
      r.style.top = y + 'px';

      const rect = r.getBoundingClientRect();
      const basketRect = basketHitbox.getBoundingClientRect();
      if (
        rect.bottom >= basketRect.top &&
        rect.top <= basketRect.bottom &&
        rect.left < basketRect.right &&
        rect.right > basketRect.left
      ) {
        clearInterval(move);
        r.remove();
        loseLife();
      } else if (x < -50 || x > game.offsetWidth + 50 || y > game.offsetHeight + 50) {
        clearInterval(move);
        r.remove();
      }
    }, 20);
  }

  // 4. Chuva de Acelga
  function bossAttackAcelgaRain(callback) {
    const gapIndex = Math.floor(Math.random() * 10);

    for (let i = 0; i < 10; i++) {
      if (i === gapIndex) continue;
      const a = document.createElement('img');
      a.src = '../../Imagens/Acelga.png';
      a.className = 'falling bad';
      a.style.width = '50px';
      a.style.height = '50px';
      a.style.position = 'absolute';
      a.style.left = (i * 90) + 'px';
      a.style.top = '0px';
      game.appendChild(a);

      let posY = 0;
      const fall = setInterval(() => {
        posY += 2;
        a.style.top = posY + 'px';

        const rect = a.getBoundingClientRect();
        const basketRect = basketHitbox.getBoundingClientRect();
        if (
          rect.bottom >= basketRect.top &&
          rect.top <= basketRect.bottom &&
          rect.left < basketRect.right &&
          rect.right > basketRect.left
        ) {
          clearInterval(fall);
          a.remove();
          loseLife();
        } else if (posY > game.offsetHeight) {
          clearInterval(fall);
          a.remove();
        }
      }, 20);
    }

    setTimeout(callback, 2500);
  }

  // 5. Ultimate Beterraba
  function bossAttackBeterrabaStorm(callback) {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(128, 0, 128, 0.5)';
    overlay.style.zIndex = 0;
    game.appendChild(overlay);

    const timer = setInterval(() => {
      const b = document.createElement('img');
      b.src = '../../Imagens/Beterraba.png';
      b.className = 'falling bad';
      b.style.position = 'absolute';
      b.style.width = '40px';
      b.style.height = '40px';
      b.style.left = Math.random() * (game.offsetWidth - 40) + 'px';
      b.style.top = '0px';
      game.appendChild(b);

      let posY = 0;
      const fall = setInterval(() => {
        posY += 4;
        b.style.top = posY + 'px';

        const rect = b.getBoundingClientRect();
        const basketRect = basketHitbox.getBoundingClientRect();
        if (
          rect.bottom >= basketRect.top &&
          rect.top <= basketRect.bottom &&
          rect.left < basketRect.right &&
          rect.right > basketRect.left
        ) {
          clearInterval(fall);
          b.remove();
          loseLife();
        } else if (posY > game.offsetHeight) {
          clearInterval(fall);
          b.remove();
        }
      }, 20);
    }, 150);

    setTimeout(() => {
      clearInterval(timer);
      overlay.remove();
      callback();
    }, 5000);
  }
