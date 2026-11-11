let step=0, answers={}, done=0;
const parts=["Ноги","Грудь","Спина","Пресс","Руки","Всё тело"];
let selParts=[];
const questsMap={"Ноги":"Приседания","Грудь":"Отжимания","Спина":"Тяга / Лодочка","Пресс":"Пресс","Руки":"Отжимания узкие","Всё тело":"Бёрпи"};

function showQ(){
  document.getElementById("qCount").innerText="Вопрос "+(step+1)+" из 7";
  document.getElementById("bar").style.width=((step+1)/7*100)+"%";
  let t=document.getElementById("qTitle"), b=document.getElementById("qBody");
  document.getElementById("skipBtn").style.display=(step===0||step===1||step===2)?"none":"block";
  if(step===0){t.innerText="1. Как тебя зовут?";b.innerHTML='<input id="in" placeholder="Введите имя" value="Марат">';}
  if(step===1){t.innerText="2. Какой у тебя вес?";b.innerHTML='<input id="in" type="number" placeholder="Например: 61">';}
  if(step===2){t.innerText="3. Какой у тебя рост?";b.innerHTML='<input id="in" type="number" placeholder="Например: 182">';}
  if(step===3){t.innerText="4. Качать ли ум?";b.innerHTML='<button class="opt" onclick="pick(this,\'mind\',\'Буду учиться\')">📚 Буду учиться</button><button class="opt" onclick="pick(this,\'mind\',\'Пропустить\')">⏭ Пропустить</button>';}
  if(step===4){t.innerText="5. Какие части тела качать?";b.innerHTML=parts.map(p=>'<button class="opt" onclick="togglePart(this,\''+p+'\')">'+p+'</button>').join('');}
  if(step===5){t.innerText="6. Качать будешь выносливость?";b.innerHTML='<button class="opt" onclick="pick(this,\'end\',\'Буду\')">🔥 Буду</button><button class="opt" onclick="pick(this,\'end\',\'Пропустить\')">⏭ Пропустить</button>';}
  if(step===6){t.innerText="7. До какой цели?";b.innerHTML='<button class="opt" onclick="pick(this,\'goal\',\'Один сильный тип\')">💪 Один сильный тип</button><button class="opt" onclick="pick(this,\'goal\',\'Для спорта\')">🏆 Для спорта</button><button class="opt" onclick="pick(this,\'goal\',\'Здоровое тело\')">❤️ Здоровое тело</button>';}
}
function pick(el,k,v){document.querySelectorAll(".opt").forEach(x=>x.classList.remove("on"));el.classList.add("on");answers[k]=v;}
function togglePart(el,p){el.classList.toggle("on");if(selParts.includes(p))selParts=selParts.filter(x=>x!==p);else selParts.push(p);answers.parts=selParts;}
function nextQ(){
  if(step<3){let v=document.getElementById("in").value.trim();if(!v){alert("Напиши, брат, ответ");return;}answers[["name","weight","height"][step]]=v;}
  if(step===4&&selParts.length===0){alert("Выбери, брат, хоть одну часть тела");return;}
  step++;
  if(step>=7)finish();else showQ();
}
function skipQ(){step++;if(step>=7)finish();else showQ();}
function finish(){
  localStorage.setItem("marat",JSON.stringify(answers));
  document.getElementById("quiz").style.display="none";
  document.getElementById("main").style.display="block";
  render();
}
function render(){
  let s="";
  if(answers.name)s+="👤 Имя: "+answers.name+"<br>";
  if(answers.weight)s+="⚖️ Вес: "+answers.weight+" кг<br>";
  if(answers.height)s+="📏 Рост: "+answers.height+" см<br>";
  if(answers.mind&&answers.mind!=="Пропустить")s+="📚 Ум: "+answers.mind+"<br>";
  if(answers.parts&&answers.parts.length)s+="🎯 Качаем: "+answers.parts.join(", ")+"<br>";
  if(answers.end&&answers.end!=="Пропустить")s+="🔥 Выносливость: "+answers.end+"<br>";
  if(answers.goal)s+="🏆 Цель: "+answers.goal+"<br>";
  s+="⭐ Выполнено квестов: "+done;
  document.getElementById("stats").innerHTML="<b>СТАТИСТИКА</b><br>"+s;
  let list=(answers.parts&&answers.parts.length)?answers.parts:["Всё тело"];
  document.getElementById("quests").innerHTML=list.map(p=>'<div class="quest"><b>'+questsMap[p]+' — '+p+'</b><br><button onclick="startQuest(this)">НАЧАТЬ</button></div>').join('');
}
let timerInt=null,sec=0;
async function startQuest(btn){
  let v=document.getElementById("cam");v.style.display="block";
  try{let st=await navigator.mediaDevices.getUserMedia({video:true});v.srcObject=st;}catch(e){alert("Разреши камеру, брат");}
  sec=30;clearInterval(timerInt);
  timerInt=setInterval(()=>{sec--;document.getElementById("timer").innerText="0:"+String(Math.max(sec,0)).padStart(2,"0");if(sec<=0){clearInterval(timerInt);done++;alert("Красавчик, брат, квест выполнен!");render();}},1000);
  document.getElementById("timer").innerText="0:30";
}
function resetAll(){localStorage.removeItem("marat");location.reload();}
let saved=JSON.parse(localStorage.getItem("marat")||"null");
if(saved){answers=saved;selParts=answers.parts||[];finish();}else showQ();
