
const popup=document.getElementById('popup');
const success=document.getElementById('success');
const guests=document.getElementById('guests');
const sum=document.getElementById('sum');

['openBooking','openBooking2','openBooking3'].forEach(id=>{
  document.getElementById(id).onclick=()=>popup.style.display='flex';
});

guests.oninput=()=>sum.innerText='Сума: '+(guests.value*400)+' грн';

document.getElementById('pay').onclick=()=>{
  popup.style.display='none';
  success.style.display='flex';
};
