const API = "https://store-lens-production.up.railway.app";
let role='OWNER';

if(localStorage.getItem('token'))
  location.href=localStorage.getItem('role')==='OWNER'?'/ownerdash/owner.html':'/employeedash/employee.html';

function go(t){
  document.querySelectorAll('.tab').forEach((el,i)=>el.classList.toggle('on',(i===0&&t==='login')||(i===1&&t==='reg')));
  document.getElementById('s-login').classList.toggle('on',t==='login');
  document.getElementById('s-reg').classList.toggle('on',t==='reg');
}
function setRole(r,el){
  role=r;
  document.querySelectorAll('.rc').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
}
function setRT(t,el){
  document.querySelectorAll('.stab').forEach(s=>s.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('rf-own').classList.toggle('on',t==='owner');
  document.getElementById('rf-emp').classList.toggle('on',t==='emp');
}
function alert2(id,type,msg){
  const el=document.getElementById(id);
  el.className='al '+type;el.textContent=msg;el.style.display='block';
  setTimeout(()=>el.style.display='none',5000);
}

async function login(){
  const phnum=document.getElementById('lp').value.trim();
  const password=document.getElementById('lw').value;
  if(!phnum||!password)return alert2('lal','err','Please fill in all fields.');
  try{
    const r=await fetch(`${API}/api/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phnum,password,role})});
    const d=await r.json();
    if(!r.ok)return alert2('lal','err',d.message||'Login failed.');
    localStorage.setItem('token',d.token);
    localStorage.setItem('role',d.role);
    localStorage.setItem('shopId',d.shopId);
    localStorage.setItem('name',d.name);
    location.href=d.role==='OWNER'?'/ownerdash/owner.html':'/employeedash/employee.html';
  }catch(e){alert2('lal','err','Cannot connect to server.');}
}

async function regOwner(){
  const ownname=document.getElementById('on').value.trim();
  const ownphnum=document.getElementById('op').value.trim();
  const password=document.getElementById('ow').value;
  const confirm=document.getElementById('oc').value;
  if(!ownname||!ownphnum||!password||!confirm)return alert2('ral','err','Please fill in all fields.');
  if(password!==confirm)return alert2('ral','err','Passwords do not match.');
  if(password.length<6)return alert2('ral','err','Password must be at least 6 characters.');
  try{
    const r=await fetch(`${API}/api/auth/register/owner`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ownname,ownphnum,password})});
    const d=await r.json();
    if(!r.ok)return alert2('ral','err',d.message||'Registration failed.');
    alert2('ral','ok',d.message);
    ['on','op','ow','oc'].forEach(id=>document.getElementById(id).value='');
  }catch(e){alert2('ral','err','Cannot connect to server.');}
}

async function regEmp(){
  const empname=document.getElementById('en').value.trim();
  const empphnum=document.getElementById('ep').value.trim();
  const shopId=document.getElementById('es').value.trim();
  const password=document.getElementById('ew').value;
  const confirm=document.getElementById('ec').value;
  if(!empname||!empphnum||!shopId||!password||!confirm)return alert2('ral','err','Please fill in all fields.');
  if(password!==confirm)return alert2('ral','err','Passwords do not match.');
  if(password.length<6)return alert2('ral','err','Password must be at least 6 characters.');
  try{
    const r=await fetch(`${API}/api/auth/register/employee`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({empname,empphnum,password,shopId:parseInt(shopId)})});
    const d=await r.json();
    if(!r.ok)return alert2('ral','err',d.message||'Registration failed.');
    alert2('ral','ok',d.message+' Wait for owner approval before logging in.');
    ['en','ep','es','ew','ec'].forEach(id=>document.getElementById(id).value='');
  }catch(e){alert2('ral','err','Cannot connect to server.');}
}
