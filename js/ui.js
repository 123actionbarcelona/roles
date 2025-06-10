import { allCharacters_data, packs_data, specialIconDetails, comboIconDetails } from "./data.js";
import { getGenderedInterpretationText, triggerGoldenGlow } from "./utils.js";



// 👉👉 A PARTIR DE AQUÍ PEGAR EL BLOQUE 2: INICIALIZACIÓN Y GESTIÓN DEL ESTADO GLOBAL 👈👈

function initializeApp(initialChars, initialPacks) {
    const packs = initialPacks;

    try {
        const domElementIds = [
            'player-count', 'player-names-grid-container', 'start-assignment',
            'player-count-error', 'setup-section', 'main-content-area',
            'assignment-table-body', 'female-characters-grid', 'male-characters-grid',
            'back-to-setup-btn',
            'darkModeToggleBtn', 'darkModeToggleBtnSetup',
            'print-dashboard-btn',
            'detective-guide-section', 'guide-header-tab',
            'assignment-dashboard-buttons-container',
            'toast-notification', 'toast-message',
            'host-name-input',
            'event-date-input',
            'has-honoree-checkbox', 'honorees-container', 'add-honoree-btn',
            'decrement-player-count', 'increment-player-count',
            'initial-report-target',
            'intro-line-1-heading'
        ];
        const domElements = {};
        let allElementsFound = true;
        domElementIds.forEach(id => {
            const element = document.getElementById(id);
            if (!element && id !== 'guide-header-tab' && id !== 'load-config-btn') {
                console.error(`ERROR DOM: ID '${id}' NO encontrado.`);
                allElementsFound = false;
            }
            else { domElements[id] = element; }
        });
        if (!allElementsFound) { console.error("ERROR FATAL: Elementos DOM esenciales no encontrados."); return; }

        const darkModeButtons = [
            domElements['darkModeToggleBtn'],
            domElements['darkModeToggleBtnSetup']
        ].filter(Boolean);

        function updateDarkModeVisuals() {
            const isDarkMode = document.documentElement.classList.contains('dark-mode');
            darkModeButtons.forEach(btn => {
                const toggleTextSpan = btn.querySelector('.toggle-text');
                const moonIcon = btn.querySelector('.fa-moon');
                const sunIcon = btn.querySelector('.fa-sun');
                if (toggleTextSpan) toggleTextSpan.textContent = isDarkMode ? 'Modo Día' : 'Modo Noche';
                if (moonIcon) moonIcon.style.display = isDarkMode ? 'none' : 'inline-block';
                if (sunIcon) sunIcon.style.display = isDarkMode ? 'inline-block' : 'none';
            });
        }

        darkModeButtons.forEach(btn => {
            btn.onclick = null;
            btn.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark-mode');
                updateDarkModeVisuals();
            });
        });
        updateDarkModeVisuals();

        let currentCharacters = [];
        let availablePlayerNames = [];
        let assignedPlayerMap = new Map();
        let hostName = "";
        let honoreeNames = [];
        let eventDateValue = "";

        // La función addHonoreeInput se definirá en el Bloque 3, pero se llama desde aquí.
        if (domElements['has-honoree-checkbox']) {
            domElements['has-honoree-checkbox'].addEventListener('change', function() {
                const honoreesContainer = domElements['honorees-container'];
                const addBtn = domElements['add-honoree-btn'];
                if (this.checked) {
                    addBtn.style.display = 'inline-block';
                    if (honoreesContainer.children.length === 0) {
                        addHonoreeInput();
                    }
                } else {
                    addBtn.style.display = 'none';
                    honoreesContainer.innerHTML = '';
                }
                generatePlayerNameInputs(parseInt(domElements['player-count'].value),
                    Array.from(domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])')).map(ip => ip.value)
                );
            });
        }
        if (domElements['add-honoree-btn']) {
            domElements['add-honoree-btn'].addEventListener('click', () => {
                addHonoreeInput();
            });
        }

         if (domElements['host-name-input']) {
            domElements['host-name-input'].addEventListener('blur', () => {
                 hostName = domElements['host-name-input'].value.trim();
                 generatePlayerNameInputs(parseInt(domElements['player-count'].value),
                    Array.from(domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])')).map(ip => ip.value)
                 );
            });
            domElements['host-name-input'].addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (domElements['has-honoree-checkbox']) {
                        domElements['has-honoree-checkbox'].focus();
                    } else if (domElements['event-date-input']) {
                        domElements['event-date-input'].focus();
                    } else {
                         const firstPlayerInput = domElements['player-names-grid-container'].querySelector('input.player-name-box:not([readonly])');
                        if (firstPlayerInput) {
                            firstPlayerInput.focus();
                        } else if (domElements['player-count']) {
                            domElements['player-count'].focus();
                        }
                    }
                }
            });
        }
        if (domElements['event-date-input']) {
            domElements['event-date-input'].addEventListener('change', () => {
                eventDateValue = domElements['event-date-input'].value;
            });
             domElements['event-date-input'].addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                     const hasHonoreeChecked = domElements['has-honoree-checkbox'] ? domElements['has-honoree-checkbox'].checked : false;
                    let nextFocusElement = null;

                    if (hasHonoreeChecked) {
                        nextFocusElement = domElements['honorees-container'].querySelector('.honoree-name-input');
                         if (!nextFocusElement && domElements['add-honoree-btn'] && domElements['add-honoree-btn'].style.display !== 'none') {
                            nextFocusElement = domElements['add-honoree-btn'];
                        }
                    }

                    if (!nextFocusElement) {
                        nextFocusElement = domElements['player-count'];
                    }


                    if (nextFocusElement) {
                        nextFocusElement.focus();
                    }
                }
            });
        }

        let toastTimeout; // La definición de showToastNotification estará en el bloque 3

        function initializeFreshSetupState() {
            if (!domElements['setup-section'] || !domElements['main-content-area'] ||
                !domElements['player-count'] || !domElements['player-names-grid-container']) {
                console.error("Cannot initialize fresh setup state, core elements missing.");
                return;
            }

            domElements['setup-section'].style.display = 'block';
            domElements['main-content-area'].classList.add('hidden-section');
            domElements['main-content-area'].classList.remove('visible-section');
            if(domElements['player-count-error']) domElements['player-count-error'].style.display = 'none';

            if(domElements['female-characters-grid']) domElements['female-characters-grid'].innerHTML = '';
            if(domElements['male-characters-grid']) domElements['male-characters-grid'].innerHTML = '';
            if (domElements['assignment-table-body']) domElements['assignment-table-body'].innerHTML = '';

            currentCharacters = [];
            availablePlayerNames = [];
            assignedPlayerMap.clear();

            if(domElements['host-name-input']) domElements['host-name-input'].value = hostName; else hostName = "";
            if(domElements['event-date-input']) domElements['event-date-input'].value = eventDateValue; else eventDateValue = "";

            if(domElements['has-honoree-checkbox']) {
                domElements['has-honoree-checkbox'].checked = honoreeNames.length > 0;
                const event = new Event('change');
                domElements['has-honoree-checkbox'].dispatchEvent(event);
                 if (honoreeNames.length > 0 && domElements['honorees-container']) {
                    domElements['honorees-container'].innerHTML = '';
                    honoreeNames.forEach(name => addHonoreeInput(name));
                 }
            } else {
                honoreeNames = [];
                if(domElements['honorees-container']) domElements['honorees-container'].innerHTML = '';
                if(domElements['add-honoree-btn']) domElements['add-honoree-btn'].style.display = 'none';
            }

            domElements['player-count'].value = domElements['player-count'].value || "8";

            const existingNames = Array.from(domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])'))
                                       .map(input => input.value.trim())
                                       .filter(name => name);

            generatePlayerNameInputs(parseInt(domElements['player-count'].value), existingNames);
        }

        if(domElements['decrement-player-count'] && domElements['increment-player-count'] && domElements['player-count']) {
            domElements['decrement-player-count'].addEventListener('click', () => {
                let currentValue = parseInt(domElements['player-count'].value);
                const minValue = parseInt(domElements['player-count'].min);
                if (currentValue > minValue) {
                    domElements['player-count'].value = currentValue - 1;
                    domElements['player-count'].dispatchEvent(new Event('input', { bubbles: true }));
                }
            });

            domElements['increment-player-count'].addEventListener('click', () => {
                let currentValue = parseInt(domElements['player-count'].value);
                const maxValue = parseInt(domElements['player-count'].max);
                if (currentValue < maxValue) {
                    domElements['player-count'].value = currentValue + 1;
                    domElements['player-count'].dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
        }

        if(domElements['player-count']){domElements['player-count'].addEventListener('input',()=>{const c=parseInt(domElements['player-count'].value);const mn=parseInt(domElements['player-count'].min);const mx=parseInt(domElements['player-count'].max);if(c>=mn&&c<=mx){generatePlayerNameInputs(c, Array.from(domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])')).map(ip => ip.value));}else if(domElements['player-names-grid-container']&&domElements['player-names-grid-container'].innerHTML!==""&&(c<mn||c>mx)){if(c<mn&&c>=1)generatePlayerNameInputs(mn);else if(c>mx)generatePlayerNameInputs(mx);}});}

        // Las funciones de renderizado y acciones principales se definen en los siguientes bloques.
        // A continuación, se asocian los eventos a las funciones que se definirán más adelante.

        if(domElements['start-assignment'])domElements['start-assignment'].addEventListener('click',handleStartAssignment);
        if(domElements['back-to-setup-btn']) domElements['back-to-setup-btn'].addEventListener('click', handleBackToSetup);
        if (domElements['print-dashboard-btn']) {
            domElements['print-dashboard-btn'].addEventListener('click', async () => {
                // ... La lógica de esta función es extensa y se moverá al Bloque 4
            });
        }

// 👉👉 FIN BLOQUE 2: INICIALIZACIÓN Y GESTIÓN DEL ESTADO GLOBAL 👈👈


// 👉👉 A PARTIR DE AQUÍ PEGAR EL BLOQUE 3: RENDERIZADO DE UI Y COMPONENTES VISUALES 👈👈
// 👉👉 INICIO BLOQUE 3: RENDERIZADO DE UI Y COMPONENTES VISUALES 👈👈

        function addHonoreeInput(name = "") {
            const container = domElements['honorees-container'];
            const inputGroup = document.createElement('div');
            inputGroup.className = 'honoree-input-group';

            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.placeholder = `Nombre Homenajeado/a ${container.children.length + 1}`;
            newInput.className = 'player-name-box honoree-name-input';
            newInput.value = name;
            newInput.addEventListener('blur', () => {
                generatePlayerNameInputs(parseInt(domElements['player-count'].value),
                    Array.from(domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])')).map(ip => ip.value)
                );
            });
            newInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const allHonoreeInputs = Array.from(container.querySelectorAll('.honoree-name-input'));
                    const currentIndex = allHonoreeInputs.indexOf(this);
                    if (currentIndex > -1 && currentIndex < allHonoreeInputs.length - 1) {
                        allHonoreeInputs[currentIndex + 1].focus();
                    } else {
                        if (domElements['add-honoree-btn'] && domElements['add-honoree-btn'].style.display !== 'none') {
                            domElements['add-honoree-btn'].focus();
                        } else {
                            const firstPlayerInput = domElements['player-names-grid-container'].querySelector('input.player-name-box:not([readonly])');
                            if (firstPlayerInput) {
                                firstPlayerInput.focus();
                            }
                        }
                    }
                }
            });

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.className = 'remove-honoree-btn';
            removeBtn.onclick = function() {
                inputGroup.remove();
                generatePlayerNameInputs(parseInt(domElements['player-count'].value),
                    Array.from(domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])')).map(ip => ip.value)
                );
            };

            inputGroup.appendChild(newInput);
            inputGroup.appendChild(removeBtn);
            container.appendChild(inputGroup);
        }

        function showToastNotification(message, type = 'info', duration = 3000) {
            const toast = domElements['toast-notification'];
            const messageSpan = domElements['toast-message'];
            const iconElement = toast.querySelector('.fas');

            if (!toast || !messageSpan || !iconElement) {
                console.warn("Toast elements not found, falling back to alert.");
                alert(`${type.toUpperCase()}: ${message}`);
                return;
            }
            messageSpan.textContent = message;
            toast.className = 'show';
            iconElement.className = 'fas';

            if (type === 'success') {
                toast.classList.add('success');
                iconElement.classList.add('fa-check-circle');
            } else if (type === 'error') {
                toast.classList.add('error');
                iconElement.classList.add('fa-times-circle');
            } else {
                toast.classList.add('info');
                iconElement.classList.add('fa-info-circle');
            }
            toast.classList.add('show');
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }

        function generatePlayerNameInputs(count, existingPlayerNamesFromGrid = []) {
            if (!domElements['player-names-grid-container']) { return; }

            const currentHostNameVal = domElements['host-name-input'] ? domElements['host-name-input'].value.trim() : "";
            const currentHonoreeInputs = domElements['honorees-container'] ? Array.from(domElements['honorees-container'].querySelectorAll('.honoree-name-input')) : [];
            const currentHonoreeCleanNamesArr = currentHonoreeInputs.map(input => input.value.trim()).filter(name => name);

            let preservedEditableNames = [];
            if (existingPlayerNamesFromGrid.length > 0) {
                let tempPreserved = [...existingPlayerNamesFromGrid];
                if (currentHostNameVal) tempPreserved = tempPreserved.filter(name => name !== (currentHostNameVal + " 🎩"));
                currentHonoreeCleanNamesArr.forEach(hName => {
                    tempPreserved = tempPreserved.filter(name => name !== (hName + " 🌟"));
                });
                preservedEditableNames = tempPreserved;
            } else if (domElements['player-names-grid-container'].children.length > 0) {
                preservedEditableNames = Array.from(domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])'))
                                              .map(input => input.value.trim());
            }


            domElements['player-names-grid-container'].innerHTML = '';
            let playerBoxIndex = 0;
            let editableNamesIndex = 0;

            if (currentHostNameVal) {
                if (playerBoxIndex < count) {
                    const input = document.createElement('input');
                    input.type = 'text'; input.classList.add('player-name-box');
                    input.value = currentHostNameVal + " 🎩"; input.readOnly = true;
                    input.title = "Anfitrión/Host (configurado arriba)";
                    domElements['player-names-grid-container'].appendChild(input);
                    playerBoxIndex++;
                }
            }

            currentHonoreeCleanNamesArr.forEach(honoreeCleanName => {
                if (playerBoxIndex < count) {
                    const input = document.createElement('input');
                    input.type = 'text'; input.classList.add('player-name-box');
                    input.value = honoreeCleanName + " 🌟"; input.readOnly = true;
                    input.title = "Homenajeado/a (configurado arriba)";
                    domElements['player-names-grid-container'].appendChild(input);
                    playerBoxIndex++;
                }
            });

            for (let i = playerBoxIndex; i < count; i++) {
                const input = document.createElement('input');
                input.type = 'text'; input.classList.add('player-name-box');

                if (editableNamesIndex < preservedEditableNames.length) {
                    input.value = preservedEditableNames[editableNamesIndex];
                    editableNamesIndex++;
                } else {
                    input.value = '';
                }

                input.placeholder = `Jugador ${i + 1 - playerBoxIndex + (currentHostNameVal ? 1 : 0) + currentHonoreeCleanNamesArr.length}`;
                if (i === playerBoxIndex && !currentHostNameVal && currentHonoreeCleanNamesArr.length === 0) {
                     input.placeholder = "(Tu nombre como jugador)";
                }
                input.setAttribute('aria-label', input.placeholder);
                input.style.animationDelay = `${(i - playerBoxIndex) * 0.05}s`;
                domElements['player-names-grid-container'].appendChild(input);

                input.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        const allPlayerInputs = Array.from(domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])'));
                        const currentIndex = allPlayerInputs.indexOf(this);
                        if (currentIndex > -1 && currentIndex < allPlayerInputs.length - 1) {
                            allPlayerInputs[currentIndex + 1].focus();
                        } else if (currentIndex === allPlayerInputs.length - 1) {
                            if(domElements['start-assignment']) domElements['start-assignment'].focus();
                        }
                    }
                });
                 input.addEventListener('blur', () => {}); // Se deja el listener vacío por si se reintroduce lógica
                if (i === playerBoxIndex && !input.value) {
                     setTimeout(() => input.focus(), 50);
                }
            }
        }

        function setupCharacterSelection(playerCount) {
            if (!domElements['female-characters-grid'] || !domElements['male-characters-grid'] || !domElements['player-count-error'] || !domElements['main-content-area']) { return; }
            domElements['female-characters-grid'].innerHTML = ''; domElements['male-characters-grid'].innerHTML = '';
            const charNames = packs[playerCount];
            if (!charNames) {
                showToastNotification(`Error interno cargando pack para ${playerCount}.`, 'error');
                domElements['main-content-area'].classList.remove('visible-section'); domElements['main-content-area'].classList.add('hidden-section'); return;
            }
            currentCharacters = charNames.map(name => {
                const oCharData = allCharacters_data.find(char => char.name === name);
                if (!oCharData) { console.warn(`Advertencia: No se encontraron datos para el personaje ${name} en allCharacters_data.`); return null; }
                return JSON.parse(JSON.stringify(oCharData));
            }).filter(Boolean);

            currentCharacters.forEach((char, i) => {
                const grid = char.gender === 'F' ? domElements['female-characters-grid'] : domElements['male-characters-grid'];
                if (grid) { renderCharacterCard(char, grid, i * 0.07); }
            });
        }

        function getExtroversionPill(level, gender) {
            const map = {"E":"🔥","I":"🙈","N":"🎭","U":"❔"};
            const cls = {"E":"extroversion-Extrovertido","I":"extroversion-Introvertido","N":"extroversion-Neutro","U":"extroversion-Indefinido"};
            const key = (level && map[level[0].toUpperCase()]) ? level[0].toUpperCase() : "U";
            let fullTextDisplay;
            if (key === "U") {
                fullTextDisplay = "N/D";
            } else {
                fullTextDisplay = getGenderedInterpretationText(level, gender);
            }
            return `<span class='extroversion-pill ${cls[key]}'>${map[key]} <strong>${fullTextDisplay.toUpperCase()}</strong></span>`;
        }

        function createPlayerAssignmentElement(char, id) {
            return availablePlayerNames.length > 0 ? `<select class="player-assignment-select" id="player-${id}" data-charname="${char.name}"><option value="">-- Seleccionar --</option></select>` : `<input type="text" class="player-assignment-input" id="player-${id}" data-charname="${char.name}" placeholder="Nombre jugador/a">`;
        }

        function createExtroversionLevelElement(char, id) {
            const infoIconActivator = `<i class="fas fa-info-circle special-icon-fa"></i>`;
            let iconsHTML = "";
            let popoverDetails = null;
            let decorativeEmojis = "";
            let popoverDataType = "";

            if (char.isBirthdayFriendly && char.isSeniorFriendly) {
                popoverDetails = comboIconDetails.birthday_senior;
                decorativeEmojis = `🌟👵🏻`;
                popoverDataType = "combo-birthday-senior";
            } else if (char.isKidFriendly && char.isSeniorFriendly) {
                popoverDetails = comboIconDetails.kid_senior;
                decorativeEmojis = `🧸👵🏻`;
                popoverDataType = "combo-kid-senior";
            } else if (char.isBirthdayFriendly) {
                popoverDetails = specialIconDetails.isBirthdayFriendly;
                decorativeEmojis = `🌟`;
                popoverDataType = "single-birthday";
            } else if (char.isKidFriendly) {
                popoverDetails = specialIconDetails.isKidFriendly;
                decorativeEmojis = `🧸`;
                popoverDataType = "single-kid";
            } else if (char.isSeniorFriendly) {
                popoverDetails = specialIconDetails.isSeniorFriendly;
                decorativeEmojis = `👵🏻`;
                popoverDataType = "single-senior";
            }

            if (popoverDetails) {
                iconsHTML = `
                    <div class="icono-info" data-icon-type="${popoverDataType}">
                        <span class="decorative-emoji">${decorativeEmojis}</span>
                        ${infoIconActivator}
                        <div class="popover-wrapper">
                            <div class="popover">
                                <div class="popover-header">
                                    <h4 class="popover-title">${popoverDetails.title}</h4>
                                </div>
                                <div class="popover-body">
                                    <p class="popover-text">${popoverDetails.text}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            return `<div class="extroversion-level-wrapper">
                        <div class="extroversion-level-container">${getExtroversionPill(char.interpretationLevel, char.gender)}</div>
                        <div class="card-icons-indicators">${iconsHTML}</div>
                    </div>`;
        }

        function renderCharacterCard(character, gridDiv, animationDelayValue) {
            const frame = document.createElement('div');
            frame.classList.add('character-frame');
            frame.classList.add('deal-animation');
            frame.style.animationDelay = `${animationDelayValue}s`;

            frame.dataset.charnameForMandatory = character.name;
            const charId = character.name.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
            const imageClass = `character-portrait-image ${character.preferCenterImage ? 'img-position-center' : ''}`;
            const imageHtml = character.imageUrl ? `<img src="${character.imageUrl}" alt="${character.name}" class="${imageClass}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` : '';
            const placeholderHtml = `<div class="character-portrait-image-placeholder" style="${character.imageUrl ? 'display:none;' : 'display:flex;' }"><i class="fas fa-user-secret fa-3x"></i><p>Retrato</p></div>`;
            const shareButtonHtml = `
<div class="character-card-actions">
  <button class="copy-char-btn-frame">
    <img src="Fotos_Personajes/whatapp-logo.WEBP" alt="WhatsApp" />
    Compartir por WhatsApp
  </button>
</div>`;
            const nameHtml = `<h4>${character.name}</h4>`;
            frame.innerHTML = `${imageHtml}${placeholderHtml}<div class="character-portrait-content">${nameHtml}<div class="character-details-section"><p id="desc-${charId}" class="character-description">${character.description||'Descripción no disponible.'}</p></div><div class="character-details-section">${createExtroversionLevelElement(character, charId)}</div>${createPlayerAssignmentElement(character, charId)}${shareButtonHtml}</div>`;
            gridDiv.appendChild(frame);
            attachCardEventListeners(frame, character, charId);
        }

        function attachCardEventListeners(frame, character, charId) {
            const playerIO = frame.querySelector(`#player-${charId}`);
            if(playerIO){
                playerIO.addEventListener(playerIO.tagName==='SELECT'?'change':'input',function(){
                    const currentSelectedPlayerName=this.value.trim();
                    const characterName=this.dataset.charname;
                    const previousPlayerForThisChar=assignedPlayerMap.get(characterName);
                    if(currentSelectedPlayerName){
                        let existingCharForThisPlayer=null;
                        for(const[char,player]of assignedPlayerMap.entries()){if(player===currentSelectedPlayerName&&char!==characterName){existingCharForThisPlayer=char;break;}}
                        if(existingCharForThisPlayer){
                            showToastNotification(`"${currentSelectedPlayerName.replace("🎩","").replace("🌟","").trim()}" ya está asignado a "${existingCharForThisPlayer}".`, 'error');
                            this.value=previousPlayerForThisChar||"";
                            this.classList.toggle('assigned',!!previousPlayerForThisChar);
                        } else {
                            assignedPlayerMap.set(characterName,currentSelectedPlayerName);
                            this.classList.add('assigned');
                        }
                    }else{
                        assignedPlayerMap.delete(characterName);
                        this.classList.remove('assigned');
                    }
                    updateAllPlayerSelects();
                    updateAssignmentDashboard();
                });
            }
            const cB=frame.querySelector('.copy-char-btn-frame');
            if(cB){cB.addEventListener('click', async ()=>{
                const d=currentCharacters.find(c=>c.name===character.name);
                const pA=(playerIO?(playerIO.value.trim()||"[Nombre del Jugador]"):"[Nombre del Jugador]").replace("🎩","").replace("🌟","").trim();
                if(d){
                    const txt = `¡Hola ${pA}!\n\nAquí tienes los detalles de tu sospechoso para el Cluedo en vivo “El Testamento de Mr. Collins”:\n\n🕵️ SOSPECHOSO: ${d.name}\n📜 DESCRIPCIÓN: ${d.description}\n\n🔗 Accede a tu ficha completa aquí: ${d.fichaLink||'N/A'}\n\n¡Recuerda que toda la información de la ficha es confidencial! 🤫`;

                    const isiPhone = /iPhone/i.test(navigator.userAgent);
                    if (isiPhone && navigator.share) {
                        try {
                            await navigator.share({
                                title: `Sospechoso: ${d.name}`,
                                text: txt
                            });
                            showToastNotification('¡Detalles compartidos!', 'success');
                        } catch (error) {
                            console.error('Error al compartir:', error);
                        }
                    } else {
                        openShareMenu(cB, txt, d.name);
                    }
                }
            });}
        }

        function updateAllPlayerSelects() {
             if(availablePlayerNames.length===0)return;
            document.querySelectorAll('.character-portrait-content select.player-assignment-select').forEach(sel=>{
                const charNameForThisSelect=sel.dataset.charname;

                let optionsHtml='<option value="">-- Seleccionar --</option>';
                availablePlayerNames.forEach(playerName=>{
                    let isPlayerAssignedElsewhereFlag=false;
                    for(const[assignedChar,assignedPlayer]of assignedPlayerMap.entries()){
                        if(assignedPlayer===playerName && assignedChar!==charNameForThisSelect){
                            isPlayerAssignedElsewhereFlag=true;
                            break;
                        }
                    }

                    let displayText = playerName;
                    if (playerName.includes("🎩")) {
                        displayText = playerName + " (Anfitrión)";
                    } else if (playerName.includes("🌟")) {
                        displayText = playerName + " (Homenajeado)";
                    }
                    optionsHtml += `<option value="${playerName}" ${isPlayerAssignedElsewhereFlag ? 'disabled' : ''}>${displayText}</option>`;
                });
                sel.innerHTML=optionsHtml;

                const playerActuallyAssignedToThisChar = assignedPlayerMap.get(charNameForThisSelect);
                if(playerActuallyAssignedToThisChar){
                    sel.value=playerActuallyAssignedToThisChar;
                    sel.classList.add('assigned');
                } else {
                    sel.value="";
                    sel.classList.remove('assigned');
                }
            });
        }

        function getRandomSmallAngle() {
            const maxAngle = 5;
            return (Math.random() * (maxAngle * 2)) - maxAngle;
        }

        function updateAssignmentDashboard() {
            if(!domElements['assignment-table-body']){return;}domElements['assignment-table-body'].innerHTML='';if(currentCharacters.length===0)return;
            currentCharacters.forEach(char=>{
                const rawPlayerName = assignedPlayerMap.get(char.name);
                const displayPlayerName = rawPlayerName ? rawPlayerName.replace("🎩"," (Anfitrión)").replace("🌟"," (Homenajeado)") : '<em>S/A</em>';

                const r=domElements['assignment-table-body'].insertRow();const cI=r.insertCell();
                if(char.imageUrl){
                    const i=document.createElement('img');
                    i.src=char.imageUrl;
                    i.alt=char.name;
                    i.style.transform = `rotate(${getRandomSmallAngle()}deg)`;
                    i.onerror=function(){
                        this.onerror=null;
                        this.src='https://placehold.co/50x65/ccc/fff?text=X';
                        this.alt=`${char.name} (imagen no disponible)`;
                        this.style.transform = 'none';
                    };
                    cI.appendChild(i);
                }else{
                    cI.innerHTML='<i class="fas fa-image" style="font-size:24px;color:#ccc;"></i>';
                }
                const cN=r.insertCell();
                cN.innerHTML=`${char.name}`;
                const cP=r.insertCell();cP.innerHTML=displayPlayerName;
                const cL=r.insertCell();cL.innerHTML=getExtroversionPill(char.interpretationLevel, char.gender);
            });
        }

        // --- INICIO: Lógica de Popovers ---
        let activePopoverElements = null;
        let activeShareMenu = null;

        function adjustPopoverPosition(iconTriggerElement, popoverWrapper, popover, frame) {
            const iconContainer = iconTriggerElement.closest('.icono-info');
            if (!iconContainer || !popoverWrapper || !popover || !frame) return;

            const iconContainerRect = iconContainer.getBoundingClientRect();
            const frameRect = frame.getBoundingClientRect();
            const popoverHeight = popover.offsetHeight;
            const popoverWidth = popover.offsetWidth;
            const arrowAndGapHeight = 12;
            const popoverMarginFromControls = 5;

            if (popoverWidth === 0 || popoverHeight === 0) return;

            const currentPopoverWrapperRect = popoverWrapper.getBoundingClientRect();

            let boundaryCorrectionShiftPx = 0;
            if (currentPopoverWrapperRect.left < frameRect.left) {
                boundaryCorrectionShiftPx = frameRect.left - currentPopoverWrapperRect.left;
            } else if (currentPopoverWrapperRect.right > frameRect.right) {
                boundaryCorrectionShiftPx = frameRect.right - currentPopoverWrapperRect.right;
            }

            const visualNudgePx = -1.5;

            popoverWrapper.style.transform = `translateX(-50%) translateX(${boundaryCorrectionShiftPx + visualNudgePx}px)`;

            popover.classList.remove('popover-above');
            popoverWrapper.style.top = `calc(100% + ${arrowAndGapHeight}px)`;
            popoverWrapper.style.bottom = 'auto';

            const selectElement = frame.querySelector('.player-assignment-select');
            let contentAreaBottomLimit = frameRect.bottom;
            if (selectElement) {
                const selectRect = selectElement.getBoundingClientRect();
                contentAreaBottomLimit = selectRect.top - popoverMarginFromControls;
            }
            contentAreaBottomLimit = Math.max(contentAreaBottomLimit, iconContainerRect.bottom + arrowAndGapHeight + 20);

            const popoverTopEdgeIfBelow = iconContainerRect.bottom + arrowAndGapHeight;
            const popoverBottomIfBelow = popoverTopEdgeIfBelow + popoverHeight;
            const popoverBottomEdgeIfAbove = iconContainerRect.top - arrowAndGapHeight;
            const popoverTopIfAbove = popoverBottomEdgeIfAbove - popoverHeight;

            const fitsNicelyBelow = popoverBottomIfBelow <= contentAreaBottomLimit;
            const fitsWithinFrameAbove = popoverTopIfAbove >= frameRect.top;

            if (!fitsNicelyBelow && fitsWithinFrameAbove) {
                popoverWrapper.style.top = 'auto';
                popoverWrapper.style.bottom = `calc(100% + ${arrowAndGapHeight}px)`;
                popover.classList.add('popover-above');
            }
        }

        function openPopover(iconTriggerElement) {
            const iconContainer = iconTriggerElement.closest('.icono-info');
            if (!iconContainer) return;

            document.querySelectorAll('.icono-info.active').forEach(activeIconContainer => {
                if (activeIconContainer !== iconContainer) closePopover(activeIconContainer);
            });

            iconContainer.classList.add('active');
            iconContainer.closest('.character-frame')?.classList.add('popover-active-frame');

            const popoverWrapper = iconContainer.querySelector('.popover-wrapper');
            const popover = iconContainer.querySelector('.popover');
            const frame = iconContainer.closest('.character-frame');

            if (popoverWrapper && popover && frame) {
                popover.classList.remove('popover-above');
                popoverWrapper.style.top = `calc(100% + 12px)`;
                popoverWrapper.style.bottom = 'auto';
                popoverWrapper.style.transform = 'translateX(-50%)';

                requestAnimationFrame(() => {
                    adjustPopoverPosition(iconTriggerElement, popoverWrapper, popover, frame);
                    activePopoverElements = { iconEl: iconContainer, wrapper: popoverWrapper, popoverEl: popover, frameEl: frame, triggerEl: iconTriggerElement };
                });
            }
        }

        function closePopover(iconContainer) {
            if (!iconContainer || !iconContainer.classList.contains('active')) return;
            iconContainer.classList.remove('active');
            iconContainer.closest('.character-frame')?.classList.remove('popover-active-frame');

            const popoverWrapper = iconContainer.querySelector('.popover-wrapper');
            if (popoverWrapper) {
                popoverWrapper.style.transform = 'translateX(-50%)';
            }
            if (activePopoverElements && activePopoverElements.iconEl === iconContainer) {
                activePopoverElements = null;
            }
        }

        function togglePopover(iconTriggerElement) {
            const iconContainer = iconTriggerElement.closest('.icono-info');
            if (!iconContainer) return;
            if (iconContainer.classList.contains('active')) {
                closePopover(iconContainer);
            } else {
                openPopover(iconTriggerElement);
            }
        }

        document.addEventListener('click', function(e) {
            const clickedIconTrigger = e.target.closest('.special-icon-fa');
            const clickedIconContainer = e.target.closest('.icono-info');

            if (e.target.closest('.popover')) return;

            if (clickedIconTrigger) {
                e.stopPropagation();
                togglePopover(clickedIconTrigger);
            } else {
                if (!clickedIconContainer) {
                        document.querySelectorAll('.icono-info.active').forEach(activeIconEl => {
                            closePopover(activeIconEl);
                        });
                }
            }
        });

        window.addEventListener('resize', () => {
            if (activePopoverElements && activePopoverElements.iconEl.classList.contains('active')) {
                activePopoverElements.wrapper.style.transform = 'translateX(-50%)';
                activePopoverElements.popoverEl.classList.remove('popover-above');
                activePopoverElements.wrapper.style.top = `calc(100% + 12px)`;
                activePopoverElements.wrapper.style.bottom = 'auto';

                requestAnimationFrame(() => {
                    const originalIconTrigger = activePopoverElements.triggerEl;
                    if (originalIconTrigger) {
                            adjustPopoverPosition(
                            originalIconTrigger,
                            activePopoverElements.wrapper,
                            activePopoverElements.popoverEl,
                            activePopoverElements.frameEl
                        );
                    }
                });
            }
        });

        function closeActiveShareMenu() {
            if (activeShareMenu) {
                activeShareMenu.remove();
                document.removeEventListener('click', handleShareMenuOutside);
                activeShareMenu = null;
            }
        }

        function handleShareMenuOutside(e) {
            if (activeShareMenu && !activeShareMenu.contains(e.target) && e.target !== activeShareMenu.trigger) {
                closeActiveShareMenu();
            }
        }

        function openShareMenu(trigger, txt, name) {
            closeActiveShareMenu();

            const menu = document.createElement('div');
            menu.className = 'share-menu';
            menu.innerHTML = `
                <a href="https://wa.me/?text=${encodeURIComponent(txt)}" target="_blank">🟢 WhatsApp</a>
                <button type="button" class="share-copy-option">📋 Copiar al portapapeles</button>
                <a href="mailto:?subject=${encodeURIComponent('Tu personaje en el Cluedo: ' + name)}&body=${encodeURIComponent(txt)}">✉️ Enviar por email</a>
            `;
            document.body.appendChild(menu);
            const rect = trigger.getBoundingClientRect();
            menu.style.left = rect.left + window.scrollX + 'px';
            menu.style.top = rect.bottom + window.scrollY + 'px';

            menu.querySelector('.share-copy-option').addEventListener('click', () => {
                navigator.clipboard.writeText(txt)
                    .then(() => showToastNotification('Texto copiado al portapapeles', 'success'))
                    .catch(() => showToastNotification('Error al copiar texto', 'error'));
                closeActiveShareMenu();
            });

            activeShareMenu = menu;
            activeShareMenu.trigger = trigger;
            setTimeout(() => document.addEventListener('click', handleShareMenuOutside));
        }
        // --- FIN: Lógica de Popovers ---

// 👉👉 FIN BLOQUE 3: RENDERIZADO DE UI Y COMPONENTES VISUALES 👈👈


// 👉👉 A PARTIR DE AQUÍ PEGAR EL BLOQUE 4: ACCIONES PRINCIPALES Y EXPORTACIÓN 👈👈
// 👉👉 INICIO BLOQUE 4: ACCIONES PRINCIPALES Y EXPORTACIÓN 👈👈

        function handleBackToSetup() {
            if (!domElements['setup-section'] || !domElements['main-content-area']) return;

            domElements['main-content-area'].classList.add('hidden-section');
            domElements['main-content-area'].classList.remove('visible-section');
            domElements['setup-section'].style.display = 'block';

            // Reinitialize setup so player name inputs regenerate with preserved data
            initializeFreshSetupState();

            domElements['setup-section'].scrollIntoView({ behavior: 'smooth', block: 'start' });

            showToastNotification('Has vuelto a la configuración. Los datos se conservan.', 'info');
        }

        function handleStartAssignment() {
            if (!domElements['player-count'] || !domElements['player-count-error'] || !domElements['main-content-area'] ||
                !domElements['player-names-grid-container'] || !domElements['setup-section']) { return; }

            hostName = domElements['host-name-input'] ? domElements['host-name-input'].value.trim() : "";
            eventDateValue = domElements['event-date-input'] ? domElements['event-date-input'].value : "";

            if (!eventDateValue) {
                showToastNotification('Por favor, selecciona la fecha del evento para continuar.', 'error');
                if (domElements['event-date-input']) domElements['event-date-input'].focus();
                return;
            }

            const honoreeNameInputs = domElements['honorees-container'] ? Array.from(domElements['honorees-container'].querySelectorAll('.honoree-name-input')) : [];
            honoreeNames = honoreeNameInputs.map(input => input.value.trim()).filter(name => name);


            const playerCount = parseInt(domElements['player-count'].value);
            if (!packs[playerCount]) {
                showToastNotification(`No hay pack para ${playerCount} jugadores. Packs: ${Object.keys(packs).join(', ')}.`, 'error');
                domElements['main-content-area'].classList.remove('visible-section'); domElements['main-content-area'].classList.add('hidden-section'); return;
            }

            availablePlayerNames = [];
            if (hostName) {
                availablePlayerNames.push(hostName + " 🎩");
            }
            honoreeNames.forEach(hNameClean => {
                if (hNameClean) {
                   availablePlayerNames.push(hNameClean + " 🌟");
                }
            });
            const nameInputs = domElements['player-names-grid-container'].querySelectorAll('input.player-name-box:not([readonly])');
            nameInputs.forEach(input => {
                const cleanName = input.value.trim();
                if (cleanName) {
                    availablePlayerNames.push(cleanName);
                }
            });

            const totalPreFilledNames = (hostName ? 1 : 0) + honoreeNames.length;
            const expectedEditableNames = playerCount - totalPreFilledNames;
            const actualEditableNamesEntered = nameInputs.length > 0 ? Array.from(nameInputs).filter(input => input.value.trim()).length : 0;

            if (availablePlayerNames.length !== playerCount) {
                 showToastNotification(`El número de jugadores (${playerCount}) no coincide con los nombres proporcionados (${availablePlayerNames.length}, incluyendo anfitrión/homenajeados). Revisa los campos. Asegúrate de que todos los jugadores tengan nombre.`, 'error', 6000);
                 return;
            }
            if (expectedEditableNames > 0 && actualEditableNamesEntered < expectedEditableNames) {
                showToastNotification(`Faltan nombres de jugadores. Se esperan ${expectedEditableNames} nombres adicionales.`, 'error', 5000);
                return;
            }


            const cleanPlayerNamesForCheck = availablePlayerNames.map(nameWithEmoji =>
                nameWithEmoji.replace("🎩","").replace("🌟","").trim().toLowerCase()
            );
            const uniqueNames = new Set(cleanPlayerNamesForCheck);

            if (uniqueNames.size !== cleanPlayerNamesForCheck.length) {
                const nameCounts = {};
                let duplicateNameFoundForMessage = "";
                for (const originalName of availablePlayerNames) {
                    const cleanName = originalName.replace("🎩","").replace("🌟","").trim().toLowerCase();
                    nameCounts[cleanName] = (nameCounts[cleanName] || 0) + 1;
                    if (nameCounts[cleanName] > 1) {
                        duplicateNameFoundForMessage = originalName.replace("🎩","").replace("🌟","").trim();
                        break;
                    }
                }
                showToastNotification(`Error: El nombre "${duplicateNameFoundForMessage}" está duplicado. Por favor, usa nombres únicos o añade un distintivo (ej: Ana S.).`, 'error', 6000);
                return;
            }


            assignedPlayerMap.clear();
            domElements['player-count-error'].style.display = 'none'; domElements['setup-section'].style.display = 'none';
            domElements['main-content-area'].classList.remove('hidden-section');
            domElements['main-content-area'].classList.add('visible-section');
            if (domElements['action-buttons-section']) {
                 domElements['action-buttons-section'].scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else if (domElements['guide-header-tab']) {
                domElements['guide-header-tab'].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setupCharacterSelection(playerCount);
            updateAllPlayerSelects();
            updateAssignmentDashboard();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Se sobreescribe el listener del botón de imprimir para añadir la lógica completa
        if (domElements['print-dashboard-btn']) {
            domElements['print-dashboard-btn'].addEventListener('click', async () => {
                showToastNotification('Generando PDF artístico...', 'info', 6000);

                if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
                    showToastNotification("Error: La librería jsPDF no está cargada.", 'error');
                    return;
                }

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

                const page = { width: doc.internal.pageSize.getWidth(), height: doc.internal.pageSize.getHeight() };
                const margin = 10;
                const columnMargin = 5;
                const cardMarginY = 4;
                const numColumns = 3;

                const card = {
                    width: (page.width - (margin * 2) - (columnMargin * (numColumns - 1))) / numColumns,
                    height: 25
                };
                const colors = { dark: '#2c1f1b', gold: '#8c703c', light_gold: '#c0a062', bg: '#faf3e0' };

                const hostPlayerName = hostName ? hostName + " 🎩" : null;
                const honoreePlayerNames = honoreeNames.map(name => name + " 🌟");

                const sortedCharacters = [...currentCharacters].sort((a, b) => {
                    const playerA = assignedPlayerMap.get(a.name);
                    const playerB = assignedPlayerMap.get(b.name);
                    const isAHonoree = honoreePlayerNames.includes(playerA);
                    const isBHonoree = honoreePlayerNames.includes(playerB);
                    const isAHost = playerA === hostPlayerName;
                    const isBHost = playerB === hostPlayerName;
                    if (isAHonoree && !isBHonoree) return -1;
                    if (!isAHonoree && isBHonoree) return 1;
                    if (isAHost && !isBHost && !isAHonoree && !isBHonoree) return -1;
                    if (!isAHost && isBHost && !isAHonoree && !isBHonoree) return 1;
                    if (isAHonoree && isBHost) return -1;
                    if (isAHost && isBHonoree) return 1;
                    return 0;
                });

                const totalCards = sortedCharacters.length;

                doc.setDrawColor(colors.gold);
                doc.setLineWidth(1);
                doc.rect(margin / 2, margin / 2, page.width - margin, page.height - margin);
                doc.setDrawColor(colors.dark);
                doc.setLineWidth(0.2);
                doc.rect((margin / 2) + 1.5, (margin / 2) + 1.5, page.width - margin - 3, page.height - margin - 3);

                try { doc.setFont('PlayfairDisplay-Bold', 'bold'); } catch (e) { doc.setFont('Helvetica', 'bold'); }
                doc.setFontSize(20);
                doc.setTextColor(colors.dark);
                doc.text("Panel Detectivesco", page.width / 2, margin + 8, { align: 'center' });

                doc.setFont('Helvetica', 'italic');
                doc.setFontSize(8);
                doc.setTextColor(colors.gold);
                doc.text(`El Testamento de Mr. Collins`, page.width - margin, page.height - (margin / 2) - 3, { align: 'right' });

                const drawInfoLine = (y, label, value) => {
                    const valueX = eventInfoX + 55;
                    try { doc.setFont('Lora', 'bold'); } catch (e) { doc.setFont('Helvetica', 'bold'); }
                    doc.setFontSize(12);
                    doc.text(label, eventInfoX, y);
                    doc.text(value, valueX, y, { charSpace: 0.1 });
                    return y + 8;
                };

                let yPos = margin + 22;
                const eventInfoX = margin + 5;

                doc.setTextColor(colors.dark);

                if (eventDateValue) {
                    const dateObj = new Date(eventDateValue + 'T00:00:00');
                    const formattedDate = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
                    yPos = drawInfoLine(yPos, "Fecha:", formattedDate);
                }

                yPos = drawInfoLine(yPos, "Nº de Sospechosos:", String(totalCards));

                if (hostName) {
                    yPos = drawInfoLine(yPos, "Anfitrión:", hostName);
                }

                if (honoreeNames && honoreeNames.length > 0) {
                    yPos = drawInfoLine(yPos, "Homenajeado/a(s):", honoreeNames.join(', '));
                }

                yPos += 3;
                doc.setDrawColor(colors.light_gold);
                doc.setLineWidth(0.5);
                doc.line(margin, yPos, page.width - margin, yPos);
                yPos += 8;

                for (let i = 0; i < totalCards; i++) {
                    const char = sortedCharacters[i];
                    const col = i % numColumns;
                    const row = Math.floor(i / numColumns);

                    const cardX = margin + (col * (card.width + columnMargin));
                    const cardY = yPos + (row * (card.height + cardMarginY));

                    doc.setFillColor(colors.bg);
                    doc.setDrawColor(colors.light_gold);
                    doc.setLineWidth(0.4);
                    doc.roundedRect(cardX, cardY, card.width, card.height, 2, 2, 'FD');

                    const textX = cardX + card.width / 2;

                    try { doc.setFont('Special Elite', 'normal'); } catch(e) { doc.setFont('Courier', 'normal'); }
                    doc.setFontSize(11);
                    doc.setTextColor(colors.dark);
                    doc.text(char.name.toUpperCase(), textX, cardY + 8, { align: 'center' });

                    doc.setDrawColor(colors.light_gold);
                    doc.setLineWidth(0.2);
                    doc.line(cardX + 4, cardY + 10.5, cardX + card.width - 4, cardY + 10.5);

                    const playerName = assignedPlayerMap.get(char.name) || 'S/A';
                    const cleanPlayerName = playerName.replace(/🎩|🌟/g, '').trim();

                    try { doc.setFont('Lora', 'bold'); } catch(e) { doc.setFont('Helvetica', 'bold'); }
                    doc.setFontSize(12);
                    doc.setTextColor(colors.gold);
                    doc.text(cleanPlayerName, textX, cardY + 18, { align: 'center' });
                }

                const pdfBlob = doc.output('blob');
                const pdfFile = new File([pdfBlob], "panel_detectivesco_final.pdf", { type: "application/pdf" });

                showToastNotification('PDF artístico generado.', 'success', 3000);

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
                    try {
                        await navigator.share({ files: [pdfFile], title: 'Panel Detectivesco - Intriga', text: 'Aquí está el panel de asignaciones del juego de intriga.' });
                    } catch (error) {
                        if (error.name !== 'AbortError') {
                            showToastNotification('Error al compartir. Iniciando descarga...', 'error');
                            doc.save("panel_detectivesco_final.pdf");
                        }
                    }
                } else {
                    doc.save("panel_detectivesco_final.pdf");
                }
            });
        }

        initializeFreshSetupState();

        const initialReportTargetElement = domElements['initial-report-target'];
        const coffinIconContainer = domElements['intro-line-1-heading'];

        if (coffinIconContainer && initialReportTargetElement) {
            const coffinIconSpan = coffinIconContainer.querySelector('.coffin-icon');
            if (coffinIconSpan) {
                coffinIconSpan.style.cursor = 'pointer';
                coffinIconSpan.setAttribute('title', 'Ver detalles del informe');

                coffinIconSpan.addEventListener('click', () => {
                    if (initialReportTargetElement) {
                        initialReportTargetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        requestAnimationFrame(() => {
                            triggerGoldenGlow(initialReportTargetElement);
                        });
                    }
                });
            }
        }

    }catch(e){console.error("ASIGNADOR ERROR GRAL:",e,e.stack);const b=document.body;if(b){let d=document.getElementById('critical-error');if(!d){d=document.createElement('div');d.id='critical-error';d.style.cssText='display:block;position:fixed;bottom:5px;left:50%;transform:translateX(-50%);z-index:10000;padding:15px;width:90%;max-width:700px;text-align:center;background-color:maroon;color:white;font-size:12px;border-radius:8px;';b.appendChild(d);}d.innerHTML=`Error: ${e.message}. Revisa consola (F12).`;}}
} // Fin de la función initializeApp



function runTypewriterOnElement(el, speed = 75) {
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

function applyTypewriterEffects() {
  const elements = [
    document.getElementById('typewriter-title'),
    document.querySelector('label[for="clave"]')
  ];
  elements.forEach(el => runTypewriterOnElement(el));
}

function setupProgressiveFlow() {
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
    dateInput.addEventListener('change', () => {
      if (dateInput.value) showBloque(3);
    });
  }
  if (hostInput) {
    hostInput.addEventListener('input', () => {
      if (hostInput.value.trim().length > 0) showBloque(4);
    });
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


function validarClave() {
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
                requestAnimationFrame(() => {
                    triggerGoldenGlow(reportTarget);
                });
            } else {
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
        }, 500);
    }
  } else {
    if(error) error.style.display = 'block';
  }
}

// 👉👉 FIN BLOQUE 4: ACCIONES PRINCIPALES Y EXPORTACIÓN �👈
export { initializeApp, setupProgressiveFlow, applyTypewriterEffects, validarClave };
