import { triggerGoldenGlow } from './state.js';

export function runTypewriterOnElement(el, speed = 75) {
  if (!el) return;
  const fullText = el.textContent.trim();
  el.textContent = '';
  const textSpan = document.createElement('span');
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.appendChild(textSpan);
  el.appendChild(cursor);
  let index = 0;
  (function typeNext() {
    textSpan.textContent = fullText.slice(0, index + 1);
    index++;
    if (index < fullText.length) {
      setTimeout(typeNext, speed);
    } else {
      cursor.classList.add('hide-typewriter-cursor');
    }
  })();
}

export function applyTypewriterEffects() {
  const elements = [
    document.getElementById('typewriter-title'),
    document.querySelector('label[for="clave"]')
  ];
  elements.forEach(el => runTypewriterOnElement(el));
}

export function setupProgressiveFlow() {
  const bloques = Array.from(document.querySelectorAll('#setup-section .bloque'));
  if (bloques.length === 0) return;
  bloques.forEach((bloq, idx) => {
    bloq.classList.add('hidden-section');
    bloq.classList.remove('visible-section');
  });
  const showBloque = num => {
    const b = document.querySelector('.bloque-' + num);
    if (b && b.classList.contains('hidden-section')) {
      b.classList.remove('hidden-section');
      b.classList.add('visible-section');
      triggerGoldenGlow(b);
    }
  };
  showBloque(2);
  const dateInput = document.getElementById('event-date-input');
  const hostInput = document.getElementById('host-name-input');
  const honYes = document.getElementById('honoree-yes');
  const honNo = document.getElementById('honoree-no');
  const honChk = document.getElementById('has-honoree-checkbox');
  const playerCountInput = document.getElementById('player-count');
  const namesContainer = document.getElementById('player-names-grid-container');
  if (dateInput) {
    dateInput.addEventListener('change', () => { if (dateInput.value) showBloque(3); });
  }
  if (hostInput) {
    hostInput.addEventListener('input', () => { if (hostInput.value.trim().length > 0) showBloque(4); });
  }
  const handleHonoreeChoice = hasHonoree => {
    if (honChk) {
      honChk.checked = hasHonoree;
      honChk.dispatchEvent(new Event('change'));
    }
    showBloque(5);
  };
  if (honYes && honNo) {
    honYes.addEventListener('click', () => handleHonoreeChoice(true));
    honNo.addEventListener('click', () => handleHonoreeChoice(false));
  } else if (honChk) {
    honChk.addEventListener('change', () => showBloque(5));
  }
  if (playerCountInput) {
    playerCountInput.addEventListener('input', () => {
      const val = parseInt(playerCountInput.value);
      const min = parseInt(playerCountInput.min);
      const max = parseInt(playerCountInput.max);
      if (!isNaN(val) && val >= min && val <= max) showBloque(6);
    });
  }
  if (namesContainer) {
    namesContainer.addEventListener('input', () => {
      const total = parseInt(playerCountInput?.value || '0');
      const filled = Array.from(namesContainer.querySelectorAll('input.player-name-box')).filter(el => el.value.trim()).length;
      if (filled === total) showBloque(7);
    });
  }
}

export function validarClave() {
  const clave = document.getElementById('clave')?.value?.trim().toLowerCase();
  const intro = document.getElementById('intro-detective');
  const error = document.getElementById('mensaje-error');
  const reportTarget = document.getElementById('initial-report-target');
  if (clave === 'cluedo') {
    if(intro) {
        intro.style.transition = "opacity 0.5s ease";
        intro.style.opacity = "0";
        setTimeout(() => {
            intro.style.display = 'none';
            if (reportTarget) {
                reportTarget.scrollIntoView({ behavior: 'instant', block: 'start' });
                requestAnimationFrame(() => { triggerGoldenGlow(reportTarget); });
            } else {
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        }, 500);
    }
  } else {
    if(error) error.style.display = 'block';
  }
}

// expose validarClave for inline onclick usage
window.validarClave = validarClave;
window.addEventListener('load', applyTypewriterEffects);
