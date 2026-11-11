let step=0,answers={},done=0,xp=0,lvl=1,stat={};
const parts=["Ноги","Грудь","Спина","Пресс","Руки","Всё тело"];
let selParts=[];
const timeMap={"Новичок":20,"Продвинутый":30,"Профессионал":45,"В пике сил":60};
const baseStat={"Новичок":{sila:20,vyn:20,um:20,dis:30,krep:20},"Продвинутый":{sila:40,vyn:40,um:40,dis:50,krep:40},"Профессионал":{sila:60,vyn:60,um:60,dis:70,krep:60},"В пике сил":{sila:85,vyn:85,um:80,dis:90,krep:85}};

// ТРЕНИРОВКИ, ТОЛЬКО ДОМА, БРАТ
const PLANS={
"Ноги":[
{day:"ПОНЕДЕЛЬНИК - НОГИ, ВЗРЫВНЫЕ",ex:["1. Разминка","2. Прыжки в длину 3х3","3. Прыжки вверх с камнем 8х3","4. Прыжки жабка 20х3 (20 метров)","5. Стоять на ступенях с камнем 15х3"]},
{day:"ЧЕТВЕРГ - НОГИ 2",ex:["1. Разминка","2. Приседания 20х3","3. Выпады 12х3 на каждую ногу","4. Прыжки жабка 15х3","5. Подъём на ступени с камнем 15х3"]}],
"Грудь":[
{day:"ВТОРНИК - ГРУДЬ, РУКИ, ПЛЕЧИ",ex:["1. Разминка","2. Отжимания широкие 15х3","3. Сумка с книгами / 5л воды, рука прижата к стене, только силой рук 10х3","4. Отжимания на диване 20х3","5. Сумка / 5л воды, руки в стороны как крылья 10х3","6. Предплечья с сумкой, рука на колене, медленно поднимать кисть, не поднимать рукой"]},
{day:"СУББОТА - ГРУДЬ 2",ex:["1. Разминка","2. Отжимания широкие 20х3","3. Отжимания на диване 20х3","4. Планка 30 сек х3"]}],
"Руки":[
{day:"ВТОРНИК - РУКИ, ГРУДЬ, ПЛЕЧИ",ex:["1. Разминка","2. Отжимания широкие 15х3","3. Сумка с книгами / 5л воды, рука прижата к стене 10х3","4. Отжимания на диване 20х3","5. Сумка / 5л воды, руки в стороны как крылья 10х3","6. Предплечья с сумкой, рука на колене, медленно поднимать кисть"]},
{day:"СУББОТА - ТОЛЬКО РУКИ: ТРИЦЕПС, БИЦЕПС, ПРЕДПЛЕЧЬЯ, КИСТЬ",ex:["1. Разминка","2. Трицепс: отжимания узкие 12х3","3. Трицепс: отжимания на диване 20х3","4. Бицепс: сумка с книгами / 5л воды 10х3","5. Предплечья: сумка, рука на колене, медленно вверх-вниз 15х3","6. Кисть: сжимай сумку / бутылку, держи 10 сек х3"]}],
"Спина":[
{day:"ЧЕТВЕРГ - СПИНА",ex:["1. Разминка","2. Лодочка 15х3","3. Тяга сумки с книгами в наклоне 12х3","4. Супермен, лежать и поднимать руки-ноги 12х3","5. Планка 30 сек х3"]},
{day:"СУББОТА - СПИНА 2",ex:["1. Разминка","2. Тяга сумки 15х3","3. Лодочка 20х3","4. Подтягивание на турнике / дверной косяк, сколько сможешь х3"]}],
"Пресс":[
{day:"ЧЕТВЕРГ - ПРЕСС",ex:["1. Разминка","2. Скручивания 20х3","3. Подъём ног лёжа 15х3","4. Велосипед 20х3","5. Планка 40 сек х3"]},
{day:"СУББОТА - ПРЕСС 2",ex:["1. Разминка","2. Скручивания 25х3","3. Планка 1 мин х3","4. Подъём ног 20х3"]}],
"Всё тело":[
{day:"ПОНЕДЕЛЬНИК - НОГИ, ВЗРЫВНЫЕ",ex:["1. Разминка","2. Прыжки в длину 3х3","3. Прыжки вверх с камнем 8х3","4. Прыжки жабка 20х3","5. Стоять на ступенях с камнем 15х3"]},
{day:"ВТОРНИК - РУКИ, ГРУДЬ, ПЛЕЧИ",ex:["1. Разминка","2. Отжимания широкие 15х3","3. Сумка / 5л воды, рука к стене 10х3","4. Отжимания на диване 20х3","5. Руки в стороны как крылья 10х3","6. Предплечья с сумкой 15х3"]},
{day:"ЧЕТВЕРГ - СПИНА + ПРЕСС + ВЫНОСЛИВОСТЬ",ex:["1. Разминка","2. Лодочка 15х3","3. Скручивания 20х3","4. Планка 40 сек х3","5. Бёрпи 10х3","6. Бег на месте 1 мин х3"]}]
};

function showQ(){
  document.getElementById("qCount").innerText="Вопрос "+(step+1)+" из 8";
  document.getElementById("bar").style.width=((step+1)/8*100)+"%";
  let t=document.getElementById("qTitle"),b=document.getElementById("qBody");
  document.getElementById("skipBtn").style.display=(step<3)?"none":"block";
  if(step===0){t.innerText="1. Как тебя зовут?";b.innerHTML='<input id="in" placeholder="Введите имя" value="Марат">';}
  if(step===1){t.innerText="2. Какой у тебя вес?";b.innerHTML='<input id="in" type="number" placeholder="Например: 61">';}
  if(step===2){t.innerText="3. Какой у тебя рост?";b.innerHTML='<input id="in" type="number" placeholder="Например: 182">';}
  if(step===3){t.innerText="4. Качать ли ум?";b.innerHTML='<button class="opt" onclick="pick(this,\'mind\',\'Буду учиться\')">📚 Буду учиться</button><button class="opt" onclick="pick(this,\'mind\',\'Пропустить\')">⏭ Пропустить</button>';}
  if(step===4){t.innerText="5. Какие части тела качать?";b.innerHTML=parts.map(p=>'<button class="opt" onclick="togglePart(this,\''+p+'\')">'+p+'</button>').join('');}
  if(step===5){t.innerText="6. Качать будешь выносливость?";b.innerHTML='<button class="opt" onclick="pick(this,\'end\',\'Буду\')">🔥 Буду</button><button class="opt" onclick="pick(this,\'end\',\'Пропустить\')">⏭ Пропустить</button>';}
  if(step===6){t.innerText="7. До какой цели?";b.innerHTML='<button class="opt" onclick="pick(this,\'goal\',\'Один сильный тип\')">💪 Один сильный тип</button><button class="opt" onclick="pick(this,\'goal\',\'Для спорта\')">🏆 Для спорта</button><button class="opt" onclick="pick(this,\'goal\',\'Здоровое тело\')">❤️ Здоровое тело</button>';}
  if(step===7){t.innerText="8. Какая у вас подготовка?";b.innerHTML='<button class="opt" onclick="pick(this,\'level\',\'Новичок\')">А) Новичок</button><button class="opt" onclick="pick(this,\'level\',\'Продвинутый\')">Б) Продвинутый</button><button class="opt" onclick="pick(this,\'level\',\'Профессионал\')">В) Профессионал</button><button class="opt" onclick="pick(this,\'level\',\'В пике сил\')">Г) В пике сил</button>';}
}
function pick(el,k,v){document.querySelectorAll(".opt").forEach(x=>x.classList.remove("on"));el.classList.add("on");answers[k]=v;}
function togglePart(el,p){el.classList.toggle("on");if(selParts.includes(p))selParts=selParts.filter(x=>x!==p);else selParts.push(p);answers.parts=selParts;}
function nextQ(){
  if(step<3){let v=document.getElementById("in").value.trim();if(!v){alert("Напиши, брат, ответ");return;}answers[["name","weight","height"][step]]=v;}
  if(step===4&&selParts.length===0){alert("Выбери, брат, хоть одну часть тела");return;}
  step++;if(step>=8)finish();else showQ();
}
function skipQ(){step++;if(step>=8)finish();else showQ();}
function finish(){
  stat=Object.assign({},baseStat[answers.level]||baseStat["Новичок"]);
  if(answers.mind==="Буду учиться")stat.um+=10;
  localStorage.setItem("marat",JSON.stringify({answers,stat,xp:0,lvl:1,done:0}));
  document.getElementById("quiz").style.display="none";document.getElementById("main").style.display="block";render();
}
function barRow(label,val){return '<div class="barRow">'+label+': '+val+'<div class="barBg"><div class="barFill" style="width:'+Math.min(val,100)+'%"></div></div></div>';}
function render(){
  document.getElementById("lvlBox").innerText="LVL "+lvl;
  let s="";
  if(answers.name)s+="👤 "+answers.name+"<br>";
  if(answers.weight)s+="⚖️ "+answers.weight+" кг  📏 "+answers.height+" см<br>";
  if(answers.mind&&answers.mind!=="Пропустить")s+="📚 Ум: "+answers.mind+"<br>";
  if(answers.parts&&answers.parts.length)s+="🎯 Качаем: "+answers.parts.join(", ")+"<br>";
  if(answers.end&&answers.end!=="Пропустить")s+="🔥 Выносливость: "+answers.end+"<br>";
  if(answers.goal)s+="🏆 Цель: "+answers.goal+"<br>";
  if(answers.level)s+="💪 Подготовка: "+answers.level+"<br>";
  s+=barRow("💪 Моя сила",stat.sila)+barRow("🔥 Выносливость",stat.vyn)+barRow("🧠 Ум",stat.um)+barRow("📅 Дисциплина",stat.dis)+barRow("🛡️ Крепость тела",stat.krep)+barRow("⭐ Опыт",xp)+"<br>✅ Выполнено: "+done;
  document.getElementById("stats").innerHTML="<b>СТАТИСТИКА</b><br>"+s;
  // Собираем дни только по выбранным частям тела, брат
  let days=[],seen={};
  let list=(answers.parts&&answers.parts.length)?answers.parts:["Всё тело"];
  if(list.includes("Всё тело")){days=PLANS["Всё тело"];}
  else{list.forEach(p=>{(PLANS[p]||[]).forEach(d=>{if(!seen[d.day]){seen[d.day]=1;days.push(d);}});});}
  if(days.length>3&&!list.includes("Всё тело"))days=days.slice(0,3);
  document.getElementById("quests").innerHTML=days.map((d,di)=>'<div class="day"><h3>'+d.day+'</h3>'+d.ex.map((e,ei)=>'<div class="quest" id="q'+di+'_'+ei+'"><b>'+e+'</b><br><button onclick="startQuest(this,'+di+','+ei+')">НАЧАТЬ</button></div>').join('')+'</div>').join('');
}
let timerInt=null,sec=0;
async function startQuest(btn,di,ei){
  let v=document.getElementById("cam");v.style.display="block";
  try{let st=await navigator.mediaDevices.getUserMedia({video:true});v.srcObject=st;}catch(e){alert("Разреши камеру, брат");}
  sec=timeMap[answers.level]||30;clearInterval(timerInt);
  document.getElementById("timer").innerText="0:"+String(sec).padStart(2,"0");
  timerInt=setInterval(()=>{sec--;document.getElementById("timer").innerText="0:"+String(Math.max(sec,0)).padStart(2,"0");
    if(sec<=0){clearInterval(timerInt);done++;xp+=10;stat.sila+=3;stat.vyn+=3;stat.krep+=2;stat.dis+=2;if(answers.mind==="Буду учиться")stat.um+=2;
      if(xp>=100){lvl++;xp=0;alert("Брат, новый LVL! Теперь LVL "+lvl+" 💪");}
      else alert("Красавчик, брат, упражнение выполнено! +10 опыта");
      document.getElementById("q"+di+"_"+ei).classList.add("done");
      localStorage.setItem("marat",JSON.stringify({answers,stat,xp,lvl,done}));render();}},1000);
}
function resetAll(){localStorage.removeItem("marat");location.reload();}
let saved=JSON.parse(localStorage.getItem("marat")||"null");
if(saved){answers=saved.answers||saved;stat=saved.stat||baseStat[answers.level]||baseStat["Новичок"];xp=saved.xp||0;lvl=saved.lvl||1;done=saved.done||0;selParts=answers.parts||[];document.getElementById("quiz").style.display="none";document.getElementById("main").style.display="block";render();}else showQ();
