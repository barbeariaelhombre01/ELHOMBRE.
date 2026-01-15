// ============================================================
// script.js – interações e animações (Ken Burns + Box Promo)
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      const [top, mid, bot] = hamburger.querySelectorAll('span');
      const on = hamburger.classList.contains('active');
      top.style.transform = on
        ? 'translateY(8px) rotate(45deg)'
        : 'translateY(0) rotate(0)';
      mid.style.opacity = on ? '0' : '1';
      bot.style.transform = on
        ? 'translateY(-8px) rotate(-45deg)'
        : 'translateY(0) rotate(0)';
    });
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.querySelectorAll('span').forEach((s) => {
            s.style.transform = '';
            s.style.opacity = '';
          });
        }
      })
    );
  }

  /* ========================================================
     Smooth Scroll
  ======================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) =>
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    })
  );

  /* ========================================================
     Reveal on Scroll
  ======================================================== */
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              { opacity: 0, transform: 'translateY(50px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            { duration: 700, easing: 'ease-out', fill: 'forwards' }
          );
          reveal.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document
    .querySelectorAll(
      '.service, .about-item, .promo, .testimonial, .plan-card, .service2'
    )
    .forEach((el) => {
      el.style.opacity = '0';
      reveal.observe(el);
    });

 




  /* ========================================================
     Box Promo – Plano cortes ILIMITADOS (80 segundos)
  ======================================================== */
  /* ========================================================
   Promo Toast Rotativo (15s) – Alterna entre dois planos
======================================================== */
  (function initRotatingPromo() {

    // Dados dos planos (pode adicionar mais no array futuramente)
    const planos = [
      {
        titulo: 'Cortes ILIMITADOS',
        preco: 'R$79,90/mês',
        descricao: 'Cortes ilimitados + agendamento prioritário',
        botao: 'ASSINAR',
        link: 'https://cashbarber.com.br/Elhombrebarbearia/inicio/plano'
      },
      {
        titulo: 'Corte + Barba ILIMITADOS',
        preco: 'R$152,90/mês',
        descricao: 'Cortes e barba ilimitados + agendamento prioritário',
        botao: 'ASSINAR',
        link: 'https://cashbarber.com.br/Elhombrebarbearia/inicio/plano'
      }
    ];

    let index = 0;
    const INTERVALO = 5000; // 5s
    const FADE_MS   = 500;   // duração da transição (coerente com CSS)

    // Cria container
    const toast = document.createElement('div');
    toast.className = 'promo-toast';

    toast.innerHTML = `
      <div class="promo-toast-content">
        <button class="promo-toast-close" aria-label="Fechar">&times;</button>
        <h4 class="promo-toast-title"></h4>
        <p class="promo-toast-price"></p>
        <p class="promo-desc"></p>
        <button class="promo-toast-btn" type="button"></button>
      </div>
    `;

    document.body.appendChild(toast);

    // Referências
    const titleEl = toast.querySelector('.promo-toast-title');
    const priceEl = toast.querySelector('.promo-toast-price');
    const descEl  = toast.querySelector('.promo-desc');
    const btnEl   = toast.querySelector('.promo-toast-btn');
    const closeEl = toast.querySelector('.promo-toast-close');

    function aplicarPlano(p) {
      titleEl.textContent = p.titulo;
      priceEl.textContent = p.preco;
      descEl.textContent  = p.descricao;
      btnEl.textContent   = p.botao;
      btnEl.onclick = () => window.open(p.link, '_blank');
    }

    // Primeira carga
    aplicarPlano(planos[index]);
    setTimeout(() => toast.classList.add('show'), 600);

    // Rotação
    function trocarPlano() {
      // inicia fade-out do conteúdo
      toast.classList.add('promo-switching');
      setTimeout(() => {
        // avança índice
        index = (index + 1) % planos.length;
        aplicarPlano(planos[index]);
        // inicia fade-in
        toast.classList.remove('promo-switching');
      }, FADE_MS); // espera terminar o fade-out antes de trocar o texto
    }

    const intervalId = setInterval(trocarPlano, INTERVALO);

    // Fechar manualmente
    closeEl.addEventListener('click', () => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      clearInterval(intervalId);
    });

  })();


  document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.querySelectorAll('.plan-card').forEach(c => {
      if(c!==card) c.style.filter='brightness(.82) saturate(.85)';
    });
  });
  card.addEventListener('mouseleave', () => {
    document.querySelectorAll('.plan-card').forEach(c => c.style.filter='');
  });
});
/* Accordion – Plano (mobile) */
document.querySelectorAll('.plan-toggle').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    btn.nextElementSibling.style.maxHeight = expanded ? null : btn.nextElementSibling.scrollHeight + 'px';
  });
});
document.querySelectorAll('.product-card').forEach(card=>{
  card.addEventListener('click', ()=>{
    // só habilita flip por clique em telas touch (ou se quiser sempre)
    if (matchMedia('(hover: none)').matches) {
      card.classList.toggle('flipped');
    }
  });
});

});