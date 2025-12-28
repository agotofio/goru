
const BOOKING = {
  depositPerPerson: 400,
  banquetDeposit: 5000,
  minMinutes: 20
};

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }

const bookingModal = qs('#bookingModal');
const paymentModal = qs('#paymentModal');

function openModal(el){
  if(!el) return;
  el.style.display='flex';
  el.setAttribute('aria-hidden','false');
}
function closeModal(el){
  if(!el) return;
  el.style.display='none';
  el.setAttribute('aria-hidden','true');
}

qsa('[data-open-booking]').forEach(btn=>btn.addEventListener('click',()=>openModal(bookingModal)));
qsa('[data-close-booking]').forEach(btn=>btn.addEventListener('click',()=>closeModal(bookingModal)));
qsa('[data-close-payment]').forEach(btn=>btn.addEventListener('click',()=>closeModal(paymentModal)));

[bookingModal,paymentModal].forEach(m=>{
  if(!m) return;
  m.addEventListener('click', (e)=>{ if(e.target===m) closeModal(m); });
});

document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape'){
    closeModal(paymentModal);
    closeModal(bookingModal);
  }
});

const form = qs('#bookingForm');
const depositSum = qs('#depositSum');
const payAmount = qs('#payAmount');
const confirmPay = qs('#confirmPaymentBtn');
const typeSel = qs('#bookingType');

function calcDeposit(){
  if(!form) return 0;
  const fd = new FormData(form);
  const type = fd.get('type');
  const guests = Math.max(1, parseInt(fd.get('guests') || '1', 10));
  const deposit = (type === 'banquet') ? BOOKING.banquetDeposit : guests * BOOKING.depositPerPerson;
  return deposit;
}

function updateDepositUI(){
  const d = calcDeposit();
  if(depositSum) depositSum.textContent = String(d);
  if(payAmount) payAmount.textContent = String(d);
}

if(form){
  form.addEventListener('click', (e)=>{
    const stepBtn = e.target.closest('[data-step]');
    if(stepBtn){
      const inp = qs('input[name="guests"]', form);
      const delta = parseInt(stepBtn.getAttribute('data-step'), 10);
      const cur = parseInt(inp.value || '1', 10);
      inp.value = String(Math.max(1, cur + delta));
      updateDepositUI();
    }
  });

  // quick time chips
  const chipsWrap = qs('[data-time-chips]', form);
  if(chipsWrap){
    chipsWrap.addEventListener('click', (e)=>{
      const chip = e.target.closest('.chip');
      if(!chip) return;
      const t = qs('input[name="time"]', form);
      t.value = chip.textContent.trim();
    });
  }

  qsa('input,select', form).forEach(el=>{
    el.addEventListener('input', updateDepositUI);
    el.addEventListener('change', updateDepositUI);
  });

  updateDepositUI();

  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    // validate min minutes
    const fd = new FormData(form);
    const date = fd.get('date');
    const time = fd.get('time');
    const phone = (fd.get('phone')||'').toString().trim();

    if(!date || !time || !phone){
      showToast('Будь ласка, заповніть дату, час і телефон.');
      return;
    }

    const start = new Date(`${date}T${time}:00`);
    const now = new Date();
    const diffMin = (start - now) / 60000;

    if(diffMin < BOOKING.minMinutes){
      showToast('Бронювання можливе мінімум за 20 хвилин.');
      return;
    }

    const booking = {
      date, time,
      guests: parseInt(fd.get('guests')||'1',10),
      hall: fd.get('hall'),
      type: fd.get('type'),
      phone,
      deposit: calcDeposit(),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('gorynych_last_booking', JSON.stringify(booking));

    closeModal(bookingModal);
    openModal(paymentModal);
    updateDepositUI();
  });
}

if(confirmPay){
  confirmPay.addEventListener('click', ()=>{
    const raw = localStorage.getItem('gorynych_last_booking');
    const b = raw ? JSON.parse(raw) : null;
    closeModal(paymentModal);
    showToast('✅ Бронювання підтверджено. Дякуємо!');
    // (Тестовий режим) — тут потім підключимо реальну оплату і бекенд.
  });
}
