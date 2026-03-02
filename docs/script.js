/* ═══════════════════════════════════════════════════════════════════════════
   Serverless Intelligent Firewall – Research Portal Script
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Mobile Navigation Toggle ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // Close nav when a link is clicked
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
      });
    });
  }

  /* ─── Active nav link on scroll ─────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + entry.target.id) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  /* ─── Accuracy Bar Chart ─────────────────────────────────────────────────── */
  const ctx = document.getElementById('accuracyChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['SVM', 'Decision Tree', 'CNN', 'LSTM (Proposed)'],
        datasets: [
          {
            label: 'Accuracy (%)',
            data: [88.4, 90.2, 93.0, 98.0],
            backgroundColor: [
              'rgba(148, 163, 184, 0.7)',
              'rgba(148, 163, 184, 0.7)',
              'rgba(148, 163, 184, 0.7)',
              'rgba(14, 165, 233, 0.85)',
            ],
            borderColor: [
              'rgba(148, 163, 184, 1)',
              'rgba(148, 163, 184, 1)',
              'rgba(148, 163, 184, 1)',
              'rgba(2, 132, 199, 1)',
            ],
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: 'Precision (%)',
            data: [84.1, 87.6, 95.1, 98.0],
            backgroundColor: [
              'rgba(253, 186, 116, 0.5)',
              'rgba(253, 186, 116, 0.5)',
              'rgba(253, 186, 116, 0.5)',
              'rgba(22, 163, 74, 0.7)',
            ],
            borderColor: [
              'rgba(249, 115, 22, 1)',
              'rgba(249, 115, 22, 1)',
              'rgba(249, 115, 22, 1)',
              'rgba(22, 163, 74, 1)',
            ],
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: 'Recall (%)',
            data: [77.8, 81.3, 85.4, 98.0],
            backgroundColor: [
              'rgba(196, 181, 253, 0.5)',
              'rgba(196, 181, 253, 0.5)',
              'rgba(196, 181, 253, 0.5)',
              'rgba(30, 58, 95, 0.7)',
            ],
            borderColor: [
              'rgba(139, 92, 246, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(30, 58, 95, 1)',
            ],
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: 'F1-Score (%)',
            data: [80.8, 84.3, 89.9, 98.0],
            backgroundColor: [
              'rgba(252, 165, 165, 0.5)',
              'rgba(252, 165, 165, 0.5)',
              'rgba(252, 165, 165, 0.5)',
              'rgba(220, 38, 38, 0.5)',
            ],
            borderColor: [
              'rgba(239, 68, 68, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(239, 68, 68, 1)',
              'rgba(185, 28, 28, 1)',
            ],
            borderWidth: 2,
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: "'Source Sans 3', sans-serif", size: 12 },
              padding: 16,
            }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`
            }
          }
        },
        scales: {
          y: {
            min: 70,
            max: 100,
            ticks: {
              callback: val => val + '%',
              font: { family: "'Source Sans 3', sans-serif", size: 11 }
            },
            grid: { color: 'rgba(0,0,0,0.06)' }
          },
          x: {
            ticks: { font: { family: "'Source Sans 3', sans-serif", size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  /* ─── Scroll-reveal animation ────────────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    '.step-card, .kpi-card, .resource-card, .arch-node, .curve-card, .analysis-card'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
  });
});
