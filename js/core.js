import { allCharacters_data, packs_data } from './data.js';
import { initializeApp, setupProgressiveFlow, applyTypewriterEffects } from './ui.js';

// Load heavy UI module lazily on DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
  await initializeApp(allCharacters_data, packs_data);
  setupProgressiveFlow();
  applyTypewriterEffects();
});
