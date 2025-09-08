// Italian localization file
const it = {
    // Main header
    "app.title": "🧠 Come l'AI Riconosce le Immagini",
    "app.subtitle": "Guarda una rete neurale imparare a identificare oggetti passo dopo passo! Così funzionano i moderni sistemi AI come il riconoscimento di immagini.",
    
    // Left panel sections
    "controls.image.title": "📸 Immagine e Controlli",
    "controls.teaching.title": "🎓 Risposta Corretta:",
    "controls.teaching.dog": "🐕 Cane",
    "controls.teaching.notdog": "❌ Non Cane",
    "controls.teaching.autoselected": "Auto-selezionato",
    
    // Action buttons
    "buttons.think": "🧠 Pensa",
    "buttons.think.tooltip": "Vedi come l'AI elabora l'immagine",
    "buttons.learn": "📚 Impara",
    "buttons.learn.tooltip": "Guarda l'AI imparare dal suo errore",
    "buttons.fullDemo": "🚀 Demo Completa",
    "buttons.fullDemo.tooltip": "Processo completo di pensiero + apprendimento",
    "buttons.autoTrain": "🎯 Auto-Addestra",
    "buttons.autoTrain.tooltip": "Addestra istantaneamente a precisione perfetta",
    "buttons.reset": "🔄 Reimposta",
    "buttons.reset.tooltip": "Reimposta la memoria dell'AI",
    
    // Tool buttons
    "tools.whatIf": "🔧 E Se?",
    "tools.whatIf.tooltip": "Esplora come i cambiamenti dei pesi influenzano le predizioni",
    "tools.expertView": "🎓 Vista Esperto",
    "tools.expertView.tooltip": "Attiva/disattiva spiegazioni matematiche dettagliate",
    "tools.config": "⚙️ Config",
    "tools.config.tooltip": "Parametri avanzati della rete neurale",
    "tools.pixels": "🔍 Pixel",
    "tools.pixels.tooltip": "Impara come le immagini diventano numeri",
    
    // Network layers
    "network.inputLayer": "Livello Input",
    "network.hiddenLayer": "Livello Nascosto",
    "network.outputLayer": "Livello Output",
    "network.aiPrediction": "Predizione AI",
    
    // System messages
    "system.title": "📋 Messaggi di Sistema",
    "system.ready": "🎮 Pronto! Scegli \"Pensa\", \"Impara\", o \"Demo Completa\"",
    "system.viewMode.student": "👁️ Vista Studente",
    "system.viewMode.expert": "🔬 Vista Esperto",
    "system.clear": "🗑️ Cancella",
    "system.autoScroll": "📜 Auto-scorrimento",
    
    // Language selector
    "language.selector": "🌐 Lingua",
    "language.english": "English",
    "language.italian": "Italiano",
    
    // Pixel Viewer Modal
    "pixelViewer.title": "🔍 Come le Immagini Diventano Pixel",
    "pixelViewer.originalImage": "📸 Immagine Originale",
    "pixelViewer.pixelGrid": "🔍 Griglia 8×8 Pixel",
    "pixelViewer.patternValues": "🧠 Valori Pattern",
    "pixelViewer.hoverInfo": "Passa il mouse sui pixel!",
    "pixelViewer.patterns.a": "Alto-sinistra",
    "pixelViewer.patterns.b": "Alto-destra", 
    "pixelViewer.patterns.c": "Basso-sinistra",
    "pixelViewer.patterns.d": "Basso-destra",
    "pixelViewer.bigIdea": "💡 La Grande Idea",
    "pixelViewer.explanation": "I computer non possono \"vedere\" le immagini come noi. Capiscono solo i numeri! Quindi convertiamo ogni immagine in una griglia di numeri che rappresentano la luminosità. L'AI impara i pattern in questi numeri per riconoscere diversi oggetti.",
    
    // Expert Panel Modal
    "expertPanel.title": "⚙️ Parametri Esperti Rete Neurale",
    "expertPanel.activationFunctions": "🧠 Funzioni di Attivazione",
    "expertPanel.hiddenActivation": "Attivazione Livello Nascosto:",
    "expertPanel.outputActivation": "Attivazione Livello Output:",
    "expertPanel.leakyReLUAlpha": "Alpha Leaky ReLU:",
    "expertPanel.trainingParams": "📚 Parametri di Addestramento",
    "expertPanel.learningRate": "Tasso di Apprendimento:",
    "expertPanel.momentum": "Momentum:",
    "expertPanel.l2Regularization": "Regolarizzazione L2:",
    "expertPanel.maxEpochs": "Epoche Massime:",
    "expertPanel.advancedSettings": "🎛️ Impostazioni Avanzate",
    "expertPanel.adaptiveLearningRate": "Tasso di Apprendimento Adattivo",
    "expertPanel.batchSize": "Dimensione Batch:",
    "expertPanel.networkArchitecture": "🏗️ Architettura Rete (Solo Lettura)",
    "expertPanel.inputSize": "Dimensione Input:",
    "expertPanel.hiddenSize": "Dimensione Nascosto:",
    "expertPanel.outputSize": "Dimensione Output:",
    "expertPanel.resetDefaults": "🔄 Reimposta Predefiniti",
    "expertPanel.apply": "✅ Applica e Riavvia Rete",
    
    // Tutorial
    "tutorial.step": "Passo",
    "tutorial.welcome": "Benvenuto!",
    "tutorial.next": "Avanti →",
    "tutorial.skip": "Salta",
    
    // Forward pass messages - Student view
    "forward.student.start": "🧠 <strong>Guardiamo l'AI Pensare!</strong><br>🎬 È ora di vedere come funziona davvero l'intelligenza artificiale! Come guardare uno studente risolvere un puzzle, la nostra AI guarderà l'immagine, penserà a quello che vede, e farà la sua migliore ipotesi. Pronto a sbirciare dentro un cervello AI?",
    "forward.student.step1": "📷 <strong>PASSO 1: L'AI Guarda la Nostra Immagine</strong><br>👀 Proprio come quando guardi una foto, l'AI esamina ogni dettaglio! Ecco cosa cattura la sua attenzione:<br>• 🐕 Caratteristica Cane A: <strong>{0}%</strong> forza (forse orecchie o forma?)<br>• 🦴 Caratteristica Cane B: <strong>{1}%</strong> forza (forse texture del pelo?)<br>• 👁️ Caratteristica Cane C: <strong>{2}%</strong> forza (forse occhi o naso?)<br>• 🎯 Corrispondenza Pattern: <strong>{3}%</strong> caninità generale<br>💡 <em>Numeri più alti significano 'questo mi sembra molto da cane!'</em>",
    "forward.student.step2": "🤔 <strong>PASSO 2: Le Cellule Cerebrali dell'AI Lavorano Insieme</strong><br>💭 Ora arriva la magia! Le cellule cerebrali dell'AI si uniscono per trovare pattern più grandi, come detective che raccolgono indizi:<br>• 🧠 Cellula Cerebrale 1: <strong>{0}%</strong> eccitata (forse trova 'texture soffice + dimensione giusta')<br>• 🧠 Cellula Cerebrale 2: <strong>{1}%</strong> eccitata (forse trova 'orecchie appuntite + naso bagnato')<br>• 🧠 Cellula Cerebrale 3: <strong>{2}%</strong> eccitata (forse trova 'quattro zampe + coda')<br>• 🧠 Cellula Cerebrale 4: <strong>{3}%</strong> eccitata (forse trova 'faccia amichevole')<br>🎯 <em>Ogni cellula cerebrale è come un detective specializzato che cerca indizi specifici!</em>",
    "forward.student.step3": "🎯 <strong>PASSO 3: Il Momento della Grande Decisione!</strong><br>🎭 Tutte le cellule cerebrali votano insieme come una giuria che prende la decisione finale! Ecco quanto è sicura ogni opzione:<br>• 🐕 <strong>\"È sicuramente un CANE!\"</strong> → <strong>{0}%</strong> sicuro<br>• ❌ <strong>\"No, NON è un cane!\"</strong> → <strong>{1}%</strong> sicuro<br><br>🏆 <strong>Decisione Finale:</strong> {2}",
    "forward.student.result": "🎉 <strong>Pensiero Completato!</strong><br>🧠 L'AI ha preso la sua decisione! Ora puoi insegnargli (se ha sbagliato) o provare una nuova immagine per vedere come se la cava.",
    
    // Forward pass messages - Expert view  
    "forward.expert.start": "🧠 <strong>Propagazione in Avanti Iniziata</strong><br>🔢 Calcolo output della rete usando i pesi attuali:<br>{0}<br>{1}<br>📊 Funzioni di attivazione: {2} (nascosto), {3} (output)",
    "forward.expert.step1": "📥 <strong>Attivazione Livello Input</strong><br>{0}<br><div class=\"op-description\">Pattern caratteristiche: A={1}, B={2}, C={3}, D={4}</div>",
    "forward.expert.step2": "✖️ <strong>Calcolo Livello Nascosto</strong><br>{0}",
    "forward.expert.step3": "➕ <strong>Calcolo Livello Output</strong><br>{0}",
    "forward.expert.result": "🎯 <strong>Propagazione in Avanti Completata</strong><br>⏱️ Tempo di calcolo: {0}ms<br>📊 Predizione finale: {1}<br>🔢 Output grezzi: [{2}]",
    
    // Backward pass messages - Student view
    "backward.student.start": "📚 <strong>TEMPO DI IMPARARE: Ops, Impariamo da Questo!</strong><br>🎯 <strong>La risposta corretta:</strong> \"{0}\"<br>🤖 <strong>Cosa ha indovinato l'AI:</strong> \"{1}\"<br><br>{2}<br>🎓 È ora di insegnare alla nostra AI ad essere più intelligente! Aggiustiamo le sue connessioni cerebrali...",
    "backward.student.step1": "🔍 <strong>PASSO 1: Lavoro da Detective - Cosa Bisogna Sistemare?</strong><br>💡 L'AI esamina le sue due cellule cerebrali di risposta come un detective che risolve un caso:<br>• 🐕 <strong>Cellula cerebrale \"Cane\":</strong> {0}<br>• ❌ <strong>Cellula cerebrale \"Non Cane\":</strong> {1}<br>📏 <strong>Dimensione errore:</strong> {2} (0 = perfetto, più grande = più confuso)<br>🎯 Ora la nostra AI sa esattamente cosa migliorare!",
    "backward.student.step2": "🔍 <strong>PASSO 2: Seguendo gli Indizi all'Indietro</strong><br>🕵️‍♀️ L'AI diventa un detective: \"Quali cellule cerebrali mi hanno portato fuori strada?\" Indaghiamo:<br>• 🧠 Cellula Cerebrale 1: {0}<br>• 🧠 Cellula Cerebrale 2: {1}<br>• 🧠 Cellula Cerebrale 3: {2}<br>• 🧠 Cellula Cerebrale 4: {3}<br>🍞 <em>Come seguire una scia di briciole, stiamo tracciando l'errore fino alla sua fonte!</em>",
    "backward.student.step3": "🎓 <strong>PASSO 3: L'AI Studia e Migliora!</strong><br>🏭 È ora che l'AI aggiorni il suo cervello! Come uno studente che rivede gli appunti dopo un test:<br>• 📉 <strong>Connessioni cattive</strong> → Abbassa il volume (rendi più deboli) 🔇<br>• 📈 <strong>Connessioni utili</strong> → Alza il volume (rendi più forti) 🔊<br>• 🏃‍♀️ <strong>Velocità di apprendimento:</strong> {0}% (quanto velocemente impara dagli errori)<br>💭 <em>\"La prossima volta che vedo qualcosa di simile, ricorderò questa lezione!\"</em><br>🏆 <strong>Risultato:</strong> La nostra AI è diventata un po' più intelligente!",
    "backward.student.complete": "🎉 <strong>Giorno di Laurea!</strong><br>🎓 La nostra AI ha appena finito la sua lezione e ha aggiornato le sue connessioni cerebrali! Ora è un po' più intelligente di prima.<br><br>🔁 <strong>Provalo di nuovo!</strong> Clicca 'Guarda l'AI Pensare' per vedere quanto è migliorata nel riconoscere i cani!",
    
    // Backward pass messages - Expert view
    "backward.expert.start": "📚 <strong>Retropropagazione Iniziata</strong><br>🎯 <strong>Passo 1: Calcolo Errore</strong><br>Target: [{0}] ({1})<br>Predizione: [{2}]<br>Errore: [{3}]<br>📊 Loss: {4} (Errore Quadratico Medio)",
    "backward.expert.step1": "🧮 <strong>Passo 2: Gradienti Livello Output</strong><br>{0}",
    "backward.expert.step2": "⚡ <strong>Passo 3: Gradienti Livello Nascosto (Regola della Catena)</strong><br>{0}",
    "backward.expert.step3": "🔧 <strong>Passo 4: Aggiornamento Pesi (Discesa del Gradiente)</strong><br>{0}",
    "backward.expert.complete": "🎓 <strong>Apprendimento Completato!</strong><br>⏱️ Tempo di studio: {0}ms<br>📝 Connessioni cerebrali aggiornate: {1} totali<br>📊 Dimensione errore: {2} (più piccolo è meglio!)<br>🧠 Le connessioni cerebrali migliorate dell'AI:<br>{3}<br>{4}<br>🎯 <strong>Riassunto Matematico:</strong> Usata discesa del gradiente per minimizzare funzione loss L(W) calcolando ∇L e aggiornando pesi via W := W - η∇L<br>📈 <strong>Prossimi passi:</strong> Esegui propagazione in avanti per osservare predizioni migliorate",
    
    // Common messages
    "messages.needForward": "⚠️ <strong>Aspetta!</strong><br>👀 Prima guardiamo l'AI pensare! Clicca 'Guarda l'AI Pensare' per vedere come elabora l'immagine.",
    "messages.needLabel": "⚠️ <strong>Serve il Tuo Aiuto!</strong><br>🎯 Per favore, dì all'AI qual è la risposta corretta cliccando 'Questo è un CANE' o 'Questo NON è un cane' sopra!",
    "messages.newImageSelected": "🖼️ <strong>Nuova Immagine Selezionata!</strong><br>🧠 L'AI ricorda ancora le sue lezioni precedenti! Nota che i numeri della forza delle connessioni non sono cambiati - quella è la sua \"memoria\" dall'apprendimento precedente!",
    "messages.correctAnswer": "✅ <strong>Ottimo lavoro!</strong> L'AI ha azzeccato! Ora aiutiamola a diventare ancora più sicura...",
    "messages.wrongAnswer": "😅 <strong>Opportunità di apprendimento!</strong> Tutti fanno errori - è così che si impara!",
    
    // View mode messages
    "viewMode.studentEnabled": "🎓 <strong>Vista studente abilitata!</strong><br>🌈 Pronto per la tua avventura di apprendimento con spiegazioni semplici e divertenti!<br><em>Tutti i messaggi saranno ora mostrati in modalità studente.</em>",
    "viewMode.expertEnabled": "🎓 <strong>Vista esperto abilitata!</strong><br>📊 Pronto per spiegazioni matematiche dettagliate con equazioni e dettagli tecnici!<br><em>Tutti i messaggi saranno ora mostrati in modalità esperto.</em>",
    
    // Message log
    "log.student.header": "🎓 Avventura di Apprendimento",
    "log.expert.header": "📋 Dettagli Matematici",
    "log.student.complete": "📖 La tua storia completa di apprendimento AI - rivedila al tuo ritmo!",
    "log.expert.complete": "🎓 Tutti i passaggi matematici preservati sopra",
    "log.cleared.student": "🗑️ <strong>Barra Laterale Studente Cancellata</strong><br>🎓 Tutte le lezioni precedenti cancellate. Pronto per la tua prossima avventura di apprendimento!",
    "log.cleared.expert": "🗑️ <strong>Barra Laterale Esperto Cancellata</strong><br>📊 Tutte le analisi matematiche precedenti cancellate. Pronto per nuove spiegazioni dettagliate!",
    
    // Training states
    "training.superLearning": "🎢 <strong>PASSO 3: Potenziamento Apprendimento AI!</strong><br>🎲 L'AI è confusa (indovina 50/50) E alcune cellule cerebrali sono \"addormentate\"<br>🔋 Stiamo potenziando il suo potere di apprendimento per svegliare quei neuroni assonnati!<br>💡 Pensalo come alzare la luminosità su una lampadina fioca!",
    "training.boostMode": "⚡ <strong>MODALITÀ POTENZIAMENTO:</strong> Neuroni deboli rilevati con predizione confusa. Amplificando segnale di apprendimento per apprendimento rivoluzionario!"
};