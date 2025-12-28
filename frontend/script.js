
const popup=document.getElementById('popup');
const payment=document.getElementById('paymentPopup');
const success=document.getElementById('successPopup');
document.getElementById('openBooking').onclick=()=>popup.style.display='flex';
document.getElementById('openBookingHero').onclick=()=>popup.style.display='flex';
document.getElementById('openPayment').onclick=()=>{popup.style.display='none';payment.style.display='flex';document.getElementById('paymentAmount').innerText='800 грн';};
document.getElementById('confirmPayment').onclick=()=>{payment.style.display='none';success.style.display='flex';};
document.getElementById('closeSuccess').onclick=()=>success.style.display='none';
