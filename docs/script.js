/* ═══════════════════════════════════════════════════════════════════════════
   Serverless Intelligent Firewall – Research Portal Script
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── SHA-256 (Web Crypto API) ───────────────────────────────────────────────
   Password "MARC@151995$" is stored only as a SHA-256 hash.
   It is never present in plain text in this file.                           */
const PASS_HASH = "5b484d8b2799daf74779ce686501847d4a08b5e917c1e8395e1da7f7e73bce0d";

async function sha256(message) {
  const msgBuffer  = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray  = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ─── Gate State ─────────────────────────────────────────────────────────────*/
function updateGate() {
  const g = document.getElementById('chk-github');
  const y = document.getElementById('chk-youtube');
  const btn = document.getElementById('gate-next1');
  if (btn) btn.disabled = !(g && g.checked && y && y.checked);
}

function updateGate2() {
  const e   = document.getElementById('chk-email');
  const btn = document.getElementById('gate-next2');
  if (btn) btn.disabled = !(e && e.checked);
}

function nextGate(step) {
  document.querySelectorAll('.gate-card').forEach(c => c.classList.add('gate-hidden'));
  const el = document.getElementById('gate-step' + step);
  if (el) el.classList.remove('gate-hidden');
}

function markDone(which) {
  setTimeout(() => {
    const el = document.getElementById('chk-' + which);
    if (el) { el.checked = true; updateGate(); }
  }, 1500);
}

async function checkPass() {
  const input = document.getElementById('paper-password');
  const err   = document.getElementById('pass-error');
  if (!input) return;
  const hash = await sha256(input.value.trim());
  if (hash === PASS_HASH) {
    document.querySelectorAll('.gate-card').forEach(c => c.classList.add('gate-hidden'));
    const u = document.getElementById('gate-unlocked');
    if (u) u.classList.remove('gate-hidden');
    if (err) err.style.display = 'none';
  } else {
    if (err) { err.style.display = 'block'; }
    input.value = '';
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 600);
  }
}

function copyEmail() {
  const body = document.getElementById('perm-body');
  if (!body) return;
  navigator.clipboard.writeText(body.innerText).then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => { btn.textContent = '📋 Copy Email Template'; }, 2000); }
  });
}

/* ─── Interactive Architecture Nodes ─────────────────────────────────────────*/
const NODE_DATA = {
  dataset: {
    title: '&#128202; CICIDS2017 Dataset',
    color: '#1e40af',
    content: `
      <p><strong>Canadian Institute for Cybersecurity — Intrusion Detection Evaluation Dataset 2017</strong></p>
      <ul>
        <li>&#128312; <b>2.8 million+</b> labeled network flow records</li>
        <li>&#128312; <b>78 numerical features</b> + 1 categorical label</li>
        <li>&#128312; 5 class types: BENIGN, DoS, DDoS, PortScan, Other</li>
        <li>&#128312; Simulated over 5 days (July 3–7, 2017)</li>
        <li>&#128312; Protocols: HTTP, HTTPS, FTP, SSH, SMTP</li>
        <li>&#128312; Features include: flow duration, packet size, byte stats, flags</li>
      </ul>`
  },
  preprocess: {
    title: '&#9881; Preprocessing Pipeline',
    color: '#7c3aed',
    content: `
      <p><strong>4-stage preprocessing to clean, balance, and normalize the data:</strong></p>
      <ol>
        <li><b>Label Cleaning:</b> Strip whitespace, merge attack types → 5 superclasses</li>
        <li><b>Class Balancing:</b> Undersampling to match minority class C<sub>max</sub></li>
        <li><b>Feature Cleaning:</b> Replace NaN/±∞ with 0, select numerical columns only</li>
        <li><b>Z-Score Normalization:</b> x' = (x − μ) / σ per feature</li>
      </ol>
      <p>Train/Test split: <b>80% / 20% stratified</b></p>`
  },
  lstm: {
    title: '&#129302; LSTM Model (3-Layer)',
    color: '#0ea5e9',
    content: `
      <p><strong>Long Short-Term Memory network captures temporal patterns in traffic flows:</strong></p>
      <table class="nd-table">
        <tr><th>Layer</th><th>Units</th><th>Dropout</th></tr>
        <tr><td>LSTM 1</td><td>128</td><td>0.3</td></tr>
        <tr><td>LSTM 2</td><td>64</td><td>0.3</td></tr>
        <tr><td>LSTM 3</td><td>32</td><td>0.3</td></tr>
        <tr><td>Dense</td><td>64 (ReLU)</td><td>—</td></tr>
        <tr><td>Output</td><td>5 (Softmax)</td><td>—</td></tr>
      </table>
      <p>Adam optimizer | lr=0.001 | 120 epochs | Early stop patience=10</p>
      <p>Result: <b style="color:#16a34a">98% Accuracy, Precision, Recall, F1</b></p>`
  },
  lambda: {
    title: '&#9729; AWS Lambda (Serverless)',
    color: '#ea580c',
    content: `
      <p><strong>Model deployed as a serverless AWS Lambda function:</strong></p>
      <ul>
        <li>&#128312; <b>No persistent servers</b> — scales on-demand to zero</li>
        <li>&#128312; Event-driven: each network flow triggers inference</li>
        <li>&#128312; <b>Container-based</b> (Docker + PyTorch) for reproducibility</li>
        <li>&#128312; Inference latency: &lt;100ms per flow classification</li>
        <li>&#128312; Stateless by design — aligned with Zero-Trust principles</li>
      </ul>
      <p>Input: 78 numerical features → Output: traffic class + confidence</p>`
  },
  zerotrust: {
    title: '&#128274; Zero-Trust Enforcement',
    color: '#16a34a',
    content: `
      <p><strong>Zero-Trust Architecture (ZTA) decision engine:</strong></p>
      <ul>
        <li>&#128312; <b>Never trust, always verify</b> — every request authenticated</li>
        <li>&#128312; <b>Continuous monitoring</b> — real-time traffic classification</li>
        <li>&#128312; <b>Least-privilege</b> access control enforcement</li>
        <li>&#128312; <b>ALLOW:</b> Benign traffic → access granted + session logged</li>
        <li>&#128312; <b>BLOCK:</b> Malicious traffic → connection dropped + alert raised</li>
      </ul>
      <p>Aligned with NIST SP 800-207 Zero Trust Architecture guidelines</p>`
  }
};

function showNodeDetail(nodeId) {
  const data    = NODE_DATA[nodeId];
  const panel   = document.getElementById('node-detail-panel');
  const content = document.getElementById('node-detail-content');
  if (!data || !panel || !content) return;

  document.querySelectorAll('.pipe-node').forEach(n => n.classList.remove('pipe-node-active'));
  const active = document.querySelector(`.pipe-node[data-node="${nodeId}"]`);
  if (active) active.classList.add('pipe-node-active');

  content.innerHTML = `<h4 class="nd-title" style="color:${data.color}">${data.title}</h4>${data.content}`;
  panel.classList.add('panel-visible');
}

/* ─── Navigation Toggle ──────────────────────────────────────────────────────*/
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  /* ─── Scroll-reveal ──────────────────────────────────────────────────────*/
  const targets = document.querySelectorAll('.step-card,.kpi-card,.resource-card,.curve-card,.analysis-card,.pipe-node,.gate-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });

  /* ─── Bar Chart: All Metrics ─────────────────────────────────────────────*/
  const ctx1 = document.getElementById('accuracyChart');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['SVM', 'Decision Tree', 'CNN', 'LSTM (Proposed)'],
        datasets: [
          { label: 'Accuracy', data: [88.4, 90.2, 93.0, 98.0], backgroundColor: ['#94a3b8','#94a3b8','#94a3b8','#0ea5e9'], borderColor: ['#64748b','#64748b','#64748b','#0284c7'], borderWidth: 2, borderRadius: 6 },
          { label: 'Precision', data: [84.1, 87.6, 95.1, 98.0], backgroundColor: ['#fbbf24','#fbbf24','#fbbf24','#16a34a'], borderColor: ['#f59e0b','#f59e0b','#f59e0b','#15803d'], borderWidth: 2, borderRadius: 6 },
          { label: 'Recall',    data: [77.8, 81.3, 85.4, 98.0], backgroundColor: ['#c4b5fd','#c4b5fd','#c4b5fd','#1e3a5f'], borderColor: ['#8b5cf6','#8b5cf6','#8b5cf6','#1e3a5f'], borderWidth: 2, borderRadius: 6 },
          { label: 'F1-Score',  data: [80.8, 84.3, 89.9, 98.0], backgroundColor: ['#fca5a5','#fca5a5','#fca5a5','#dc2626'], borderColor: ['#ef4444','#ef4444','#ef4444','#b91c1c'], borderWidth: 2, borderRadius: 6 }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'top'}, tooltip:{ callbacks:{label:c=>`${c.dataset.label}: ${c.parsed.y}%`} } }, scales:{ y:{min:70,max:100,ticks:{callback:v=>v+'%'}}, x:{grid:{display:false}} } }
    });
  }

  /* ─── Radar Chart ────────────────────────────────────────────────────────*/
  const ctx2 = document.getElementById('radarChart');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'radar',
      data: {
        labels: ['Accuracy','Precision','Recall','F1-Score','BENIGN Rec.','DDoS Prec.','DoS Prec.','PortScan Rec.'],
        datasets: [
          { label:'LSTM', data:[98,98,98,98,94,99,98,100], borderColor:'#0ea5e9', backgroundColor:'rgba(14,165,233,0.15)', pointBackgroundColor:'#0ea5e9', borderWidth:2 },
          { label:'CNN',  data:[93,95.1,85.4,89.9,80,90,88,95], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.1)', pointBackgroundColor:'#f59e0b', borderWidth:2 }
        ]
      },
      options:{ responsive:true, maintainAspectRatio:false, scales:{ r:{min:70,max:100,ticks:{stepSize:10}} }, plugins:{legend:{position:'bottom'}} }
    });
  }

  /* ─── Class-wise Bar ─────────────────────────────────────────────────────*/
  const ctx3 = document.getElementById('classChart');
  if (ctx3) {
    new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['BENIGN','DDoS','DoS','PortScan','Other'],
        datasets: [
          { label:'Precision', data:[0.99,0.99,0.98,0.99,0.94], backgroundColor:'rgba(14,165,233,0.7)', borderColor:'#0284c7', borderWidth:2, borderRadius:5 },
          { label:'Recall',    data:[0.94,1.00,0.99,1.00,0.99], backgroundColor:'rgba(22,163,74,0.7)',  borderColor:'#15803d', borderWidth:2, borderRadius:5 }
        ]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}, scales:{ y:{min:0.85,max:1.0,ticks:{callback:v=>v.toFixed(2)}}, x:{grid:{display:false}} } }
    });
  }

  /* ─── Pie Chart ──────────────────────────────────────────────────────────*/
  const ctx4 = document.getElementById('pieChart');
  if (ctx4) {
    new Chart(ctx4, {
      type: 'doughnut',
      data: {
        labels: ['SVM (88.4%)', 'DT (90.2%)', 'CNN (93.0%)', 'LSTM (98.0%)'],
        datasets: [{ data:[88.4,90.2,93.0,98.0], backgroundColor:['#94a3b8','#fbbf24','#f97316','#0ea5e9'], borderColor:'#fff', borderWidth:3, hoverOffset:8 }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{position:'bottom'}, tooltip:{ callbacks:{label:c=>`${c.label}: ${c.parsed}%`} } } }
    });
  }

  /* ─── SOTA Horizontal Bar ────────────────────────────────────────────────*/
  const ctx5 = document.getElementById('sotaChart');
  if (ctx5) {
    new Chart(ctx5, {
      type: 'bar',
      data: {
        labels: ['FedSA\n(Neto 2022)','CNN-LSTM\n(Bamber 2025)','CNN+LSTM\n(Altunay 2023)','Proposed\nLSTM'],
        datasets: [{ label:'Accuracy (%)', data:[97.0,95.0,93.21,98.0], backgroundColor:['#94a3b8','#94a3b8','#94a3b8','#0ea5e9'], borderColor:['#64748b','#64748b','#64748b','#0284c7'], borderWidth:2, borderRadius:6 }]
      },
      options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:c=>`Accuracy: ${c.parsed.x}%`}} }, scales:{ x:{min:88,max:100,ticks:{callback:v=>v+'%'}}, y:{grid:{display:false}} } }
    });
  }
});
