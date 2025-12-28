
function showToast(msg){
  const t=document.getElementById('toast');
  if(!t) return;
  t.textContent=msg;
  t.style.display='block';
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>{t.style.display='none';},2800);
}
