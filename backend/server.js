
import express from 'express';
const app = express();
app.use(express.json());
app.post('/api/booking',(req,res)=>{
  console.log('NEW BOOKING',req.body);
  res.json({ok:true});
});
app.listen(3001,()=>console.log('Backend ready'));
