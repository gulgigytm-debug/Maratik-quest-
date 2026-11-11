const ex = [["Приседания", 180], ["Отжимания", 180], ["Подтягивания", 180], ["Пресс", 180], ["Планка", 180], ["Выпады", 180], ["Бёрпи", 180]];
let xp = +(localStorage.xp || 0), qc = +(localStorage.qc || 0), cur = 0, left = 0, timer = null, stream = null, lastFrame = null, noMove = 0;
document.getElementById('xp').textContent = xp;
document.getElementById('quests').textContent = qc;

function render() {
  document.getElementById('list').innerHTML = ex.map((e, i) => {
    const locked = i > cur, done = i < cur;
    return `<div class="card ${done ? 'done' : ''}">
    <b>${i + 1}. ${e[0]}</b> ${done ? '✅' : locked ? '🔒' : ''}<br>
    <span class="timer">${i === cur ? fmt(left) : fmt(e[1])}</span><br>
    <span class="${locked ? 'lock' : 'ok'}">${done ? 'Сделано' : locked ? 'Закрыто, сначала предыдущее' : 'Сейчас делаешь'}</span><br>
    <input type="checkbox" ${done ? 'checked' : ''} disabled> Галочка откроется только после таймера и камеры
    ${i === cur ? `<button onclick="startQuest()">НАЧАТЬ</button>` : ''}
    </div>`;
  }).join('');
}

function fmt(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, '0'); }

async function startQuest() {
  if (timer) return;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    document.getElementById('cam').srcObject = stream;
  } catch (e) {
    alert("Разреши камеру, брат, без неё таймер не пойдёт");
    return;
  }
  left = ex[cur][1]; noMove = 0; render();
  document.getElementById('status').textContent = "Камера идёт. Двигайся, если уйдёшь, таймер встанет!";
  timer = setInterval(() => {
    if (document.hidden) { document.getElementById('status').textContent = "⛔ Свернул, таймер СТОП"; return; }
    if (!stream || !stream.active) { document.getElementById('status').textContent = "⛔ Камера выключена, таймер СТОП"; return; }
    if (!hasMove()) { noMove++; document.getElementById('status').textContent = "⛔ Тебя не видно / нет движения, таймер СТОП"; if (noMove > 3) return; return; }
    noMove = 0; left--; render();
    document.getElementById('status').textContent = "🔥 Делаешь: " + ex[cur][0] + " | Осталось " + fmt(left);
    if (left <= 0) {
      clearInterval(timer); timer = null;
      stream.getTracks().forEach(t => t.stop()); cur++;
      if (cur >= ex.length) {
        document.getElementById('finish').disabled = false;
        document.getElementById('status').textContent = "Всё, брат, жми КВЕСТ ВЫПОЛНЕН!";
      } else {
        document.getElementById('status').textContent = "Красавчик, следующее упражнение!";
      }
      render();
    }
  }, 1000);
}

function hasMove() {
  const v = document.getElementById('cam');
  if (!v.videoWidth) return false;
  const c = document.createElement('canvas'); c.width = 64; c.height = 48;
  const x = c.getContext('2d'); x.drawImage(v, 0, 0, 64, 48);
  const d = x.getImageData(0, 0, 64, 48).data; let diff = 0;
  if (lastFrame) { for (let i = 0; i < d.length; i += 40) { diff += Math.abs(d[i] - lastFrame[i]); } }
  lastFrame = d; return diff > 900;
}

document.getElementById('finish').onclick = () => {
  xp += 35; qc++; localStorage.xp = xp; localStorage.qc = qc;
  document.getElementById('xp').textContent = xp;
  document.getElementById('quests').textContent = qc;
  alert("Красавчик, брат! +35 опыта, по-честному!");
  cur = 0; document.getElementById('finish').disabled = true; render();
};

document.getElementById('resetBtn').onclick = () => {
  localStorage.clear(); xp = 0; qc = 0; cur = 0;
  document.getElementById('xp').textContent = 0;
  document.getElementById('quests').textContent = 0;
  render();
};

render();
