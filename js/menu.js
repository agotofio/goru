
async function loadMenu(){
  const res = await fetch('../data/menu.json');
  return await res.json();
}

const map = [
  {key:'cold_snacks', title:'Холодні закуски'},
  {key:'salads', title:'Салати'},
  {key:'hot_snacks', title:'Гарячі закуски'},
  {key:'boards', title:'Дошки на компанію'},
  {key:'first_dishes', title:'Перші страви'},
  {key:'sides', title:'Гарніри'},
  {key:'sauces', title:'Соуси'},
  {key:'desserts', title:'Десерти'},
  {key:'grill_meat', title:'Мангал • мʼясо'},
  {key:'fish', title:'Страви з риби'},
  {key:'gorynych_dishes', title:'Страви від Горинича'},
  {key:'cocktails', title:'Коктейлі'},
  {key:'coffee_hot', title:'Кава та гарячі напої'},
  {key:'tea_home', title:'Чай домашній'},
  {key:'tea_brew', title:'Чай заварний'},
  {key:'hot_alc', title:'Гарячі алкогольні коктейлі'},
  {key:'addons', title:'Додатково'},
];

function el(tag, cls, html){
  const x=document.createElement(tag);
  if(cls) x.className=cls;
  if(html!==undefined) x.innerHTML=html;
  return x;
}

function renderList(items){
  const wrap = el('div','menu-list');
  items.forEach(it=>{
    const row = el('div','item');
    const left = el('div','item-left');
    left.appendChild(el('div','item-name', it.name));
    if(it.desc) left.appendChild(el('div','item-desc', it.desc));
    const meta = [];
    if(it.weight) meta.push(`Вага: ${it.weight}`);
    if(meta.length) left.appendChild(el('div','item-meta', meta.join(' • ')));
    row.appendChild(left);
    row.appendChild(el('div','item-price', `${it.price} грн`));
    wrap.appendChild(row);
  });
  return wrap;
}

async function init(){
  const data = await loadMenu();
  const tabs = document.getElementById('tabs');
  const title = document.getElementById('catTitle');
  const list = document.getElementById('catList');

  let activeKey = map[0].key;

  function setActive(k){
    activeKey = k;
    [...tabs.children].forEach(b=>b.classList.toggle('active', b.dataset.key===k));
    const m = map.find(x=>x.key===k);
    title.textContent = m ? m.title : 'Меню';
    list.innerHTML='';
    const items = data[k] || [];
    list.appendChild(renderList(items));
  }

  map.forEach((m,i)=>{
    const b = el('button', 'tab' + (i===0?' active':''), m.title);
    b.type='button';
    b.dataset.key = m.key;
    b.addEventListener('click', ()=>setActive(m.key));
    tabs.appendChild(b);
  });

  setActive(activeKey);
}
init().catch(()=>{
  const list=document.getElementById('catList');
  if(list) list.innerHTML='<div class="card">Не вдалося завантажити меню.</div>';
});
