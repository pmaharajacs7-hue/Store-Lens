const API = "https://store-lens-production.up.railway.app";
const token=localStorage.getItem('token');
const role=localStorage.getItem('role');

if(!token||role!=='EMPLOYEE')location.href='/login/index.html';

const name=localStorage.getItem('name')||'Employee';
const shopId=localStorage.getItem('shopId');
document.getElementById('uname').textContent=name;
document.getElementById('ushop').textContent='Shop ID: '+shopId;
document.getElementById('avt').textContent=name.charAt(0).toUpperCase();
document.getElementById('s-name').textContent=name;
document.getElementById('s-shop').textContent='#'+shopId;

function H(){return{'Authorization':'Bearer '+token,'Content-Type':'application/json'}}
function logout(){localStorage.clear();location.href='/login/index.html'}

function toast(msg,type='ok'){
  const t=document.getElementById('toast');
  t.innerHTML=msg;  // ← changed from textContent to innerHTML
  t.className='toast '+type;t.style.display='block';
  clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3500);
}

function onInput(){
  if(!document.getElementById('sq').value.trim()){
    document.getElementById('results').style.display='none';
    document.getElementById('emptyState').style.display='none';
    document.getElementById('initState').style.display='block';
    document.getElementById('sessionCard').style.display='flex';
  }
}

async function doSearch(){
  const q=document.getElementById('sq').value.trim();
  if(!q)return toast('Please type a product name.','err');
  try{
    const r=await fetch(`${API}/api/products/search?query=${encodeURIComponent(q)}`,{headers:H()});
    if(r.status===403)return toast('Access denied.','err');
    const prods=await r.json();
    document.getElementById('initState').style.display='none';
    document.getElementById('sessionCard').style.display='none';
    if(!prods.length){
      document.getElementById('results').style.display='none';
      document.getElementById('emptyState').style.display='block';
      document.getElementById('emptyMsg').textContent=`No products found for "${q}"`;
      return;
    }
    document.getElementById('emptyState').style.display='none';
    document.getElementById('results').style.display='block';
    document.getElementById('res-title').textContent=`Results for "${q}"`;
    document.getElementById('res-count').textContent=prods.length+' item'+(prods.length!==1?'s':'')+' found';
    renderProds(prods);
  }catch(e){toast('Search failed. Check server connection.','err')}
}

/* ── RENDER PRODUCT CARDS WITH SELL BUTTON ── */
function renderProds(prods){
  document.getElementById('prodGrid').innerHTML=prods.map(p=>{
    const [bc,bl]=p.stockStatus==='IN_STOCK'?['badge-in','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> In Stock']
                 :p.stockStatus==='LOW_STOCK'?['badge-low','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg> Low Stock']
                 :['badge-out','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D3E0E3"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg> Out of Stock'];
    const canSell=p.pro_count>0;
    return`<div class="prod-card" id="card-${p.proId}">
      <div class="prod-name"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 45 238 136Zm-160 93 78-45-237-137-78 45 237 137Z"/></svg> ${p.proName}</div>
      <div class="loc-box"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg> ${p.pro_location}</div>
      <div class="prod-row"><span class="lbl">Price</span><span class="val">₹${p.pro_amount.toFixed(2)}</span></div>
      <div class="prod-row"><span class="lbl">In Stock</span><span class="val" id="stock-${p.proId}">${p.pro_count} units</span></div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px">
        <span class="badge ${bc}" id="badge-${p.proId}">${bl}</span>
        <button onclick='openSell(${JSON.stringify(p)})'
          ${canSell?'':'disabled'}
          style="padding:7px 16px;
                 background:${canSell?'rgba(59,130,246,.15)':'rgba(100,100,100,.08)'};
                 border:1px solid ${canSell?'rgba(59,130,246,.35)':'rgba(100,100,100,.15)'};
                 border-radius:8px;
                 color:${canSell?'#60a5fa':'#4b5563'};
                 font-size:.78rem;font-family:'Syne',sans-serif;font-weight:700;
                 cursor:${canSell?'pointer':'not-allowed'};">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"/></svg> ${canSell?'Sell':'No Stock'}
        </button>
      </div>
    </div>`;
  }).join('');
}

/* ── SELL MODAL ── */
let sellTarget=null;

function openSell(p){
  sellTarget=p;
  document.getElementById('sell-pname').textContent=p.proName;
  document.getElementById('sell-loc').textContent=p.pro_location;
  document.getElementById('sell-available').textContent=p.pro_count+' units';
  document.getElementById('sell-price').textContent='₹'+p.pro_amount.toFixed(2);
  document.getElementById('sell-qty').value='';
  document.getElementById('sell-err').style.display='none';
  document.getElementById('sellOverlay').classList.add('on');
  setTimeout(()=>document.getElementById('sell-qty').focus(),150);
}

function closeSell(){
  document.getElementById('sellOverlay').classList.remove('on');
  sellTarget=null;
}

async function confirmSell(){
  const qty=parseInt(document.getElementById('sell-qty').value);
  const errDiv=document.getElementById('sell-err');
  errDiv.style.display='none';

  if(!qty||qty<=0){
    errDiv.textContent='Please enter a valid quantity.';
    errDiv.style.display='block';
    return;
  }
  if(qty>sellTarget.pro_count){
    errDiv.textContent=`Only ${sellTarget.pro_count} units available in stock.`;
    errDiv.style.display='block';
    return;
  }

  try{
    const r=await fetch(`${API}/api/products/sell/${sellTarget.proId}`,{
      method:'POST',
      headers:H(),
      body:JSON.stringify({quantity:qty})
    });
    const d=await r.json();
    if(!r.ok){
      errDiv.textContent=d.message||'Sale failed.';
      errDiv.style.display='block';
      return;
    }

    // ✅ Update the card live — no page reload needed
    document.getElementById(`stock-${sellTarget.proId}`).textContent=d.pro_count+' units';
    const[bc,bl]=d.stockStatus==='IN_STOCK'?['badge-in','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> In Stock']
                :d.stockStatus==='LOW_STOCK'?['badge-low','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm28.5 188.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Z"/></svg> Low Stock']
                :['badge-out','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg> Out of Stock'];
        const badgeEl=document.getElementById(`badge-${sellTarget.proId}`);
        badgeEl.className='badge '+bc;
        badgeEl.innerHTML=bl;  // ← changed

    toast(`<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> Sold ${qty} unit${qty>1?'s':''} of "${sellTarget.proName}" successfully!`);
    closeSell();
  }catch(e){
    errDiv.textContent='Connection error. Try again.';
    errDiv.style.display='block';
  }
}

/* ── VOICE SEARCH ── */
let recorder=null,chunks=[],isRec=false;

async function toggleMic(){
  if(isRec){stopMic();}else{await startMic();}
}

async function startMic(){
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    recorder=new MediaRecorder(stream);
    chunks=[];
    recorder.ondataavailable=e=>chunks.push(e.data);
    recorder.onstop=async()=>{
      const blob=new Blob(chunks,{type:'audio/webm'});
      stream.getTracks().forEach(t=>t.stop());
      await transcribe(blob);
    };
    recorder.start();isRec=true;
    document.getElementById('micBtn').classList.add('rec');
    document.getElementById('micBtn').innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M480-480ZM282-282q-82-82-82-198t82-198q82-82 198-82t198 82q82 82 82 198t-82 198q-82 82-198 82t-198-82Zm339.5-56.5Q680-397 680-480t-58.5-141.5Q563-680 480-680t-141.5 58.5Q280-563 280-480t58.5 141.5Q397-280 480-280t141.5-58.5Z"/></svg>';
    document.getElementById('vhint').classList.add('rec');
    document.getElementById('vtext').textContent='Recording… tap again to stop';
  }catch(e){toast('Microphone access denied.','err')}
}

function stopMic(){
  if(recorder&&recorder.state!=='inactive')recorder.stop();
  isRec=false;
  document.getElementById('micBtn').classList.remove('rec');
  document.getElementById('micBtn').innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M395-435q-35-35-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35q-50 0-85-35Zm85-205Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm68.5-371.5Q520-503 520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480q17 0 28.5-11.5Z"/></svg>';
  document.getElementById('vhint').classList.remove('rec');
  document.getElementById('vtext').textContent='Transcribing…';
}

async function transcribe(blob){
  try{
    const fd=new FormData();
    fd.append('audio',blob,'recording.webm');
    const r=await fetch(`${API}/api/voice/transcribe`,{method:'POST',headers:{'Authorization':'Bearer '+token},body:fd});
    if(!r.ok)throw new Error();
    const d=await r.json();
    const txt=(d.text||'').trim();
    document.getElementById('sq').value=txt;
    document.getElementById('vtext').textContent=`Heard: "${txt}"`;
    if(txt)await doSearch();
  }catch(e){
    document.getElementById('vtext').textContent='Transcription failed. Try again.';
    toast('Voice transcription failed.','err');
  }
}
