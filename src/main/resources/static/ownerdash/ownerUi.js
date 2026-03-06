const API = 'http://localhost:8080';
const token=localStorage.getItem('token');
const role=localStorage.getItem('role');

if(!token||role!=='OWNER')location.href='/login/index.html';

const name=localStorage.getItem('name')||'Owner';
document.getElementById('uname').textContent=name;
document.getElementById('ushop').textContent='Shop ID: '+localStorage.getItem('shopId');
document.getElementById('avt').textContent=name.charAt(0).toUpperCase();

function H(){return{'Authorization':'Bearer '+token,'Content-Type':'application/json'}}

function toast(msg,type='ok'){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='toast '+type;t.style.display='block';
  clearTimeout(t._t);t._t=setTimeout(()=>t.style.display='none',3500);
}

function logout(){localStorage.clear();location.href='/login/index.html'}

function show(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('on'));
  document.getElementById('pg-' + page).classList.add('on');
  if (el) el.classList.add('on');
  if (page === 'dashboard') loadDash();
  if (page === 'products') loadProds();
  if (page === 'employees') loadEmps();
  if (page === 'sales') loadSalesChart();
}

async function loadDash(){
  try{
    const [pr,er]=await Promise.all([
      fetch(`${API}/api/products`,{headers:H()}),
      fetch(`${API}/api/owner/employees/pending`,{headers:H()})
    ]);
    const prods=await pr.json();
    const pends=await er.json();
    document.getElementById('ds-total').textContent=prods.length;
    document.getElementById('ds-low').textContent=prods.filter(p=>p.stockStatus==='LOW_STOCK').length;
    document.getElementById('ds-out').textContent=prods.filter(p=>p.stockStatus==='OUT_OF_STOCK').length;
    const pc=Array.isArray(pends)?pends.length:0;
    document.getElementById('ds-pend').textContent=pc;
    const badge=document.getElementById('pendBadge');
    badge.textContent=pc;badge.style.display=pc>0?'inline':'none';
  }catch(e){toast('Failed to load dashboard','err')}
}

async function loadProds(){
  const tbody=document.getElementById('prodTbody');
  tbody.innerHTML='<tr class="empty-row"><td colspan="7">Loading…</td></tr>';
  try{
    const r=await fetch(`${API}/api/products`,{headers:H()});
    const prods=await r.json();
    if(!prods.length){tbody.innerHTML='<tr class="empty-row"><td colspan="7">No products yet. Add your first product.</td></tr>';return}
    tbody.innerHTML=prods.map((p,i)=>{
      const [bc,bl]=p.stockStatus==='IN_STOCK'?['badge-in',' <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg> In Stock']:p.stockStatus==='LOW_STOCK'?['badge-low','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg> Low']:['badge-out','<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg> Out'];
      return`<tr>
        <td style="color:var(--muted)">${i+1}</td>
        <td style="font-weight:500;color:var(--text)">${esc(p.proName)}</td>
        <td><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="M536.5-503.5Q560-527 560-560t-23.5-56.5Q513-640 480-640t-56.5 23.5Q400-593 400-560t23.5 56.5Q447-480 480-480t56.5-23.5ZM480-186q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg> ${esc(p.pro_location)}</td>
        <td>₹${p.pro_amount.toFixed(2)}</td>
        <td>${p.pro_count}</td>
        <td><span class="badge ${bc}">${bl}</span></td>
        <td><div class="act-row">
          <button class="btn-edit" onclick='openEdit(${JSON.stringify(p)})'>Edit</button>
          <button class="btn-del" onclick="delProd(${p.proId})">Delete</button>
        </div></td>
      </tr>`;
    }).join('');
  }catch(e){toast('Failed to load products','err')}
}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

async function addProduct(){
  const proName=document.getElementById('np-name').value.trim();
  const pro_location=document.getElementById('np-loc').value.trim();
  const pro_amount=document.getElementById('np-amt').value;
  const pro_count=document.getElementById('np-cnt').value;
  if(!proName||!pro_location||!pro_amount||!pro_count)return toast('Please fill in all fields.','err');
  try{
    const r=await fetch(`${API}/api/products/create`,{method:'POST',headers:H(),body:JSON.stringify({proName,pro_location,pro_amount:parseFloat(pro_amount),pro_count:parseInt(pro_count)})});
    const d=await r.json();
    if(!r.ok)return toast(d.message||'Failed','err');
    toast('Product added successfully!');
    ['np-name','np-loc','np-amt','np-cnt'].forEach(id=>document.getElementById(id).value='');
  }catch(e){toast('Error adding product','err')}
}

function openEdit(p){
  document.getElementById('e-id').value=p.proId;
  document.getElementById('e-name').value=p.proName;
  document.getElementById('e-loc').value=p.pro_location;
  document.getElementById('e-amt').value=p.pro_amount;
  document.getElementById('e-cnt').value=p.pro_count;
  document.getElementById('editOverlay').classList.add('on');
}
function closeEdit(){document.getElementById('editOverlay').classList.remove('on')}

async function saveEdit(){
  const proId=document.getElementById('e-id').value;
  const proName=document.getElementById('e-name').value.trim();
  const pro_location=document.getElementById('e-loc').value.trim();
  const pro_amount=document.getElementById('e-amt').value;
  const pro_count=document.getElementById('e-cnt').value;
  try{
    const r=await fetch(`${API}/api/products/update/${proId}`,{method:'PUT',headers:H(),body:JSON.stringify({proName,pro_location,pro_amount:parseFloat(pro_amount),pro_count:parseInt(pro_count)})});
    if(!r.ok){const d=await r.json();return toast(d.message||'Failed','err')}
    toast('Product updated!');closeEdit();loadProds();
  }catch(e){toast('Error updating','err')}
}

async function delProd(proId){
  if(!confirm('Delete this product? This cannot be undone.'))return;
  try{
    const r=await fetch(`${API}/api/products/delete/${proId}`,{method:'DELETE',headers:H()});
    if(!r.ok){const d=await r.json();return toast(d.message||'Failed','err')}
    toast('Product deleted.','info');loadProds();
  }catch(e){toast('Error deleting','err')}
}

async function uploadCSV(){
  const file=document.getElementById('csvFile').files[0];
  if(!file)return toast('Please select a CSV file.','err');
  const fd=new FormData();fd.append('file',file);
  try{
    const r=await fetch(`${API}/api/products/upload-csv`,{method:'POST',headers:{'Authorization':'Bearer '+token},body:fd});
    const d=await r.json();
    if(!r.ok)return toast(d.message||'Upload failed','err');
    toast(`${d.length} products imported!`);
    document.getElementById('csvFile').value='';
  }catch(e){toast('Error uploading CSV','err')}
}

async function loadEmps(){
  try{
    const [pr,ar]=await Promise.all([
      fetch(`${API}/api/owner/employees/pending`,{headers:H()}),
      fetch(`${API}/api/owner/employees`,{headers:H()})
    ]);
    const pend=await pr.json();
    const all=await ar.json();
    const appr=all.filter(e=>e.approved);

    const pendDiv=document.getElementById('pendDiv');
    if(!pend.length){
      pendDiv.innerHTML='<div style="color:var(--muted);font-size:.875rem;padding:10px 0">No pending requests.</div>';
    } else {
      pendDiv.innerHTML=`<div class="tbl-wrap"><table>
        <thead><tr><th>Name</th><th>Phone</th><th>Actions</th></tr></thead>
        <tbody>${pend.map(e=>`<tr>
          <td style="font-weight:500;color:var(--text)">${esc(e.empname)}</td>
          <td>${esc(e.empphnum)}</td>
          <td><div class="act-row">
            <button class="btn-ok" onclick="approveEmp(${e.empId})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="m381-240 424-424-57-56-368 367-169-170-57 57 227 226Zm0 113L42-466l169-170 170 170 366-367 172 168-538 538Z"/></svg> Approve</button>
            <button class="btn-rej" onclick="rejectEmp(${e.empId})"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FDF3D0"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg> Reject</button>
          </div></td>
        </tr>`).join('')}</tbody>
      </table></div>`;
    }

    const appDiv=document.getElementById('appDiv');
    if(!appr.length){
      appDiv.innerHTML='<div style="color:var(--muted);font-size:.875rem;padding:10px 0">No approved employees yet.</div>';
    } else {
      appDiv.innerHTML=`<div class="tbl-wrap"><table>
        <thead><tr><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
        <tbody>${appr.map(e=>`<tr>
          <td style="font-weight:500;color:var(--text)">${esc(e.empname)}</td>
          <td>${esc(e.empphnum)}</td>
          <td><span class="badge badge-in">Active</span></td>
        </tr>`).join('')}</tbody>
      </table></div>`;
    }

    const pc=pend.length;
    const badge=document.getElementById('pendBadge');
    badge.textContent=pc;badge.style.display=pc>0?'inline':'none';
  }catch(e){toast('Failed to load employees','err')}
}

async function approveEmp(empId){
  try{
    const r=await fetch(`${API}/api/owner/employees/${empId}/approve`,{method:'POST',headers:H()});
    if(!r.ok){const d=await r.json();return toast(d.message||'Failed','err')}
    toast('Employee approved!');loadEmps();loadDash();
  }catch(e){toast('Error','err')}
}
async function loadDash(){
try{

const [pr,er]=await Promise.all([
fetch(`${API}/api/products`,{headers:H()}),
fetch(`${API}/api/owner/employees/pending`,{headers:H()})
]);

const prods=await pr.json();
const pends=await er.json();

document.getElementById('ds-total').textContent=prods.length;
document.getElementById('ds-low').textContent=prods.filter(p=>p.stockStatus==='LOW_STOCK').length;
document.getElementById('ds-out').textContent=prods.filter(p=>p.stockStatus==='OUT_OF_STOCK').length;

const pc=Array.isArray(pends)?pends.length:0;
document.getElementById('ds-pend').textContent=pc;

loadSalesChart();

}catch(e){
toast('Failed to load dashboard','err')
}
}
async function rejectEmp(empId){
  if(!confirm('Reject and remove this employee?'))return;
  try{
    const r=await fetch(`${API}/api/owner/employees/${empId}/reject`,{method:'DELETE',headers:H()});
    if(!r.ok){const d=await r.json();return toast(d.message||'Failed','err')}
    toast('Employee rejected.','info');loadEmps();loadDash();
  }catch(e){toast('Error','err')}
}
let salesChart = null;

async function loadSalesChart() {
  document.getElementById('chartMsg').textContent = 'Loading…';
  document.getElementById('chartMsg').style.display = 'block';
  document.getElementById('salesCanvas').style.display = 'none';

  try {
    const r = await fetch(`${API}/api/sales/chart`, { headers: H() });
    const d = await r.json();
    console.log("Sales API response:", d);
    if (!d.products || d.products.length === 0) {
      document.getElementById('chartMsg').textContent = 'No sales data in the last 10 days.';
      return;
    }

    document.getElementById('chartMsg').style.display = 'none';
    document.getElementById('salesCanvas').style.display = 'block';

    const colors = [
      '#f59e0b','#3b82f6','#10b981','#ef4444',
      '#8b5cf6','#ec4899','#06b6d4','#84cc16'
    ];

    const datasets = d.products.map((p, i) => ({
      label: p.name,
      data: p.amount,
      backgroundColor: colors[i % colors.length] + '33',
      borderColor: colors[i % colors.length],
      borderWidth: 2,
      borderRadius: 6,
    }));

    if (salesChart) salesChart.destroy();

    salesChart = new Chart(document.getElementById('salesCanvas'), {
      type: 'bar',
      data: { labels: d.dates, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#f0f0f5', font: { family: 'DM Sans' } }
          }
        },
        scales: {
          x: {
            ticks: { color: '#6b7280' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            beginAtZero: true,
           ticks: {
              color: '#6b7280',
              callback: v => '₹' + v
            },
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        }
      }
    });
  } catch(e) {
    document.getElementById('chartMsg').textContent = 'Failed to load chart.';
  }
}
loadDash();
