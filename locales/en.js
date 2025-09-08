// English localization file - Original authentic text from the application
window.i18nLocales = window.i18nLocales || {};
window.i18nLocales.en = {
    // Main header
    "app.title": "🧠 How AI Recognizes Images",
    "app.subtitle": "Watch a neural network learn to identify objects step by step! This is how modern AI systems like image recognition work.",
    
    // Left panel sections
    "controls.image.title": "📸 Image & Controls",
    "controls.teaching.title": "🎓 Correct Answer:",
    "controls.teaching.dog": "🐕 Dog",
    "controls.teaching.notdog": "❌ Not Dog",
    "controls.teaching.autoselected": "Auto-selected",
    
    // Action buttons
    "buttons.think": "🧠 Think",
    "buttons.think.tooltip": "See how the AI processes the image",
    "buttons.learn": "📚 Learn",
    "buttons.learn.tooltip": "Watch the AI learn from its mistake",
    "buttons.fullDemo": "🚀 Full Demo",
    "buttons.fullDemo.tooltip": "Complete thinking + learning process",
    "buttons.autoTrain": "🎯 Auto-Train",
    "buttons.autoTrain.tooltip": "Instantly train to perfect accuracy",
    "buttons.reset": "🔄 Reset",
    "buttons.reset.tooltip": "Reset the AI's memory",
    
    // Tool buttons
    "tools.whatIf": "🔧 What If?",
    "tools.whatIf.tooltip": "Explore how changing weights affects predictions",
    "tools.expertView": "🎓 Expert View",
    "tools.expertView.tooltip": "Toggle detailed mathematical explanations",
    "tools.config": "⚙️ Config",
    "tools.config.tooltip": "Advanced neural network parameters",
    "tools.pixels": "🔍 Pixels",
    "tools.pixels.tooltip": "Learn how images become numbers",
    
    // Network layers
    "network.inputLayer": "Input Layer",
    "network.hiddenLayer": "Hidden Layer",
    "network.outputLayer": "Output Layer",
    "network.aiPrediction": "AI Prediction",
    
    // System messages
    "system.title": "📋 System Messages",
    "system.ready": "🎮 Ready! Pick \"Think\", \"Learn\", or \"Full Demo\"",
    "system.viewMode.student": "👁️ Student View",
    "system.viewMode.expert": "🔬 Expert View",
    "system.clear": "🗑️ Clear",
    "system.autoScroll": "📜 Auto-scroll",
    
    // Language selector
    "language.selector": "🌐 Language",
    "language.english": "English",
    "language.italian": "Italiano",
    
    // Pixel Viewer Modal
    "pixelViewer.title": "🔍 How Images Become Pixels",
    "pixelViewer.originalImage": "📸 Original Image",
    "pixelViewer.pixelGrid": "🔍 8×8 Pixels",
    "pixelViewer.patternValues": "🧠 Pattern Values",
    "pixelViewer.hoverInfo": "Hover over pixels!",
    "pixelViewer.patterns.a": "Top-left",
    "pixelViewer.patterns.b": "Top-right", 
    "pixelViewer.patterns.c": "Bottom-left",
    "pixelViewer.patterns.d": "Bottom-right",
    "pixelViewer.bigIdea": "💡 The Big Idea",
    "pixelViewer.explanation": "Computers can't \"see\" images like we do. They only understand numbers! So we convert every image into a grid of numbers representing brightness. The AI learns patterns in these numbers to recognize different objects.",
    
    // Expert Panel Modal
    "expertPanel.title": "⚙️ Expert Neural Network Parameters",
    "expertPanel.activationFunctions": "🧠 Activation Functions",
    "expertPanel.hiddenActivation": "Hidden Layer Activation:",
    "expertPanel.outputActivation": "Output Layer Activation:",
    "expertPanel.leakyReLUAlpha": "Leaky ReLU Alpha:",
    "expertPanel.trainingParams": "📚 Training Parameters",
    "expertPanel.learningRate": "Learning Rate:",
    "expertPanel.momentum": "Momentum:",
    "expertPanel.l2Regularization": "L2 Regularization:",
    "expertPanel.maxEpochs": "Max Epochs:",
    "expertPanel.advancedSettings": "🎛️ Advanced Settings",
    "expertPanel.adaptiveLearningRate": "Adaptive Learning Rate",
    "expertPanel.batchSize": "Batch Size:",
    "expertPanel.networkArchitecture": "🏗️ Network Architecture (Read-Only)",
    "expertPanel.inputSize": "Input Size:",
    "expertPanel.hiddenSize": "Hidden Size:",
    "expertPanel.outputSize": "Output Size:",
    "expertPanel.resetDefaults": "🔄 Reset to Defaults",
    "expertPanel.apply": "✅ Apply & Restart Network",
    
    // Tutorial
    "tutorial.step": "Step",
    "tutorial.welcome": "Welcome!",
    "tutorial.next": "Next →",
    "tutorial.skip": "Skip",
    
    // Forward pass messages - Student view (authentic original text)
    "forward.student.start": "🧠 <strong>Let's Watch the AI Think!</strong><br>🎬 Time to see how artificial intelligence really works! Like watching a student solve a puzzle, our AI will look at the picture, think about what it sees, and make its best guess. Ready to peek inside an AI brain?",
    "forward.student.step1": "📷 <strong>STEP 1: The AI Looks at Our Picture</strong><br>👀 Just like when you look at a photo, the AI examines every detail! Here's what catches its attention:<br>• 🐕 Dog Feature A: <strong>{0}%</strong> strength (maybe ears or shape?)<br>• 🦴 Dog Feature B: <strong>{1}%</strong> strength (maybe fur texture?)<br>• 👁️ Dog Feature C: <strong>{2}%</strong> strength (maybe eyes or nose?)<br>• 🎯 Pattern Match: <strong>{3}%</strong> overall doggy-ness<br>💡 <em>Higher numbers mean 'this looks very dog-like to me!'</em>",
    "forward.student.step2": "🤔 <strong>STEP 2: The AI's Brain Cells Work Together</strong><br>💭 Now comes the magic! The AI's brain cells team up to find bigger patterns, like detectives gathering clues:<br>• 🧠 Brain Cell 1: <strong>{0}%</strong> excited (maybe finds 'fluffy texture + right size')<br>• 🧠 Brain Cell 2: <strong>{1}%</strong> excited (maybe finds 'pointy ears + wet nose')<br>• 🧠 Brain Cell 3: <strong>{2}%</strong> excited (maybe finds 'four legs + tail')<br>• 🧠 Brain Cell 4: <strong>{3}%</strong> excited (maybe finds 'friendly face')<br>🎯 <em>Each brain cell is like a specialist detective looking for specific clues!</em>",
    "forward.student.step3": "🎯 <strong>STEP 3: The Big Decision Moment!</strong><br>🎭 All the brain cells vote together like a jury making their final decision! Here's how confident each option feels:<br>• 🐕 <strong>\"It's definitely a DOG!\"</strong> → <strong>{0}%</strong> confident<br>• ❌ <strong>\"Nope, NOT a dog!\"</strong> → <strong>{1}%</strong> confident<br><br>🏆 <strong>Final Decision:</strong> {2}",
    "forward.student.result": "🎉 <strong>Thinking Complete!</strong><br>🧠 The AI has made its decision! Now you can either teach it (if it was wrong) or try a new image to see how it does.",
    
    // Forward pass messages - Expert view  
    "forward.expert.start": "🧠 <strong>Forward Propagation Started</strong><br>🔢 Computing network output using current weights:<br>{0}<br>{1}<br>📊 Activation functions: {2} (hidden), {3} (output)",
    "forward.expert.step1": "📥 <strong>Input Layer Activation</strong><br>{0}<br><div class=\"op-description\">Feature patterns: A={1}, B={2}, C={3}, D={4}</div>",
    "forward.expert.step2": "✖️ <strong>Hidden Layer Computation</strong><br>{0}",
    "forward.expert.step3": "➕ <strong>Output Layer Computation</strong><br>{0}",
    "forward.expert.result": "🎯 <strong>Forward Pass Complete</strong><br>⏱️ Computation time: {0}ms<br>📊 Final prediction: {1}<br>🔢 Raw outputs: [{2}]",
    
    // Backward pass messages - Student view (authentic original text)
    "backward.student.start": "📚 <strong>LEARNING TIME: Oops, Let's Learn from This!</strong><br>🎯 <strong>The correct answer:</strong> \"{0}\"<br>🤖 <strong>What the AI guessed:</strong> \"{1}\"<br><br>{2}<br>🎓 Time to teach our AI to be smarter! Let's adjust its brain connections...",
    "backward.student.step1": "🔍 <strong>STEP 1: Detective Work - What Needs Fixing?</strong><br>💡 The AI examines its two answer brain cells like a detective solving a case:<br>• 🐕 <strong>\"Dog\" brain cell:</strong> {0}<br>• ❌ <strong>\"Not Dog\" brain cell:</strong> {1}<br>📏 <strong>Mistake size:</strong> {2} (0 = perfect, bigger = more confused)<br>🎯 Now our AI knows exactly what to improve!",
    "backward.student.step2": "🔍 <strong>STEP 2: Following the Clues Backwards</strong><br>🕵️‍♀️ The AI becomes a detective: \"Which brain cells led me astray?\" Let's investigate:<br>• 🧠 Brain Cell 1: {0}<br>• 🧠 Brain Cell 2: {1}<br>• 🧠 Brain Cell 3: {2}<br>• 🧠 Brain Cell 4: {3}<br>🍞 <em>Like following a trail of breadcrumbs, we're tracing the mistake back to its source!</em>",
    "backward.student.step3": "🎓 <strong>STEP 3: The AI Studies and Improves!</strong><br>🏭 Time for the AI to update its brain! Like a student reviewing their notes after a test:<br>• 📉 <strong>Bad connections</strong> → Turn down the volume (make weaker) 🔇<br>• 📈 <strong>Helpful connections</strong> → Turn up the volume (make stronger) 🔊<br>• 🏃‍♀️ <strong>Learning speed:</strong> {0}% (how fast it learns from mistakes)<br>💭 <em>\"Next time I see something like this, I'll remember this lesson!\"</em><br>🏆 <strong>Result:</strong> Our AI just got a little bit smarter!",
    "backward.student.complete": "🎉 <strong>Graduation Day!</strong><br>🎓 Our AI just finished its lesson and updated its brain connections! It's now a little bit smarter than before.<br><br>🔁 <strong>Try it again!</strong> Click 'Watch AI Think' to see how much better it got at recognizing dogs!",
    
    // Backward pass messages - Expert view
    "backward.expert.start": "📚 <strong>Backpropagation Started</strong><br>🎯 <strong>Step 1: Error Calculation</strong><br>Target: [{0}] ({1})<br>Prediction: [{2}]<br>Error: [{3}]<br>📊 Loss: {4} (Mean Squared Error)",
    "backward.expert.step1": "🧮 <strong>Step 2: Output Layer Gradients</strong><br>{0}",
    "backward.expert.step2": "⚡ <strong>Step 3: Hidden Layer Gradients (Chain Rule)</strong><br>{0}",
    "backward.expert.step3": "🔧 <strong>Step 4: Weight Updates (Gradient Descent)</strong><br>{0}",
    "backward.expert.complete": "🎓 <strong>Learning Complete!</strong><br>⏱️ Study time: {0}ms<br>📝 Brain connections updated: {1} total<br>📊 Mistake size: {2} (smaller is better!)<br>🧠 The AI's improved brain connections:<br>{3}<br>{4}<br>🎯 <strong>Mathematical Summary:</strong> Used gradient descent to minimize loss function L(W) by computing ∇L and updating weights via W := W - η∇L<br>📈 <strong>Next steps:</strong> Run forward pass to observe improved predictions",
    
    // Common messages (authentic original text)
    "messages.needForward": "⚠️ <strong>Hold on!</strong><br>👀 First let's watch the AI think! Click 'Watch AI Think' to see how it processes the image.",
    "messages.needLabel": "⚠️ <strong>Need Your Help!</strong><br>🎯 Please tell the AI what the correct answer is by clicking 'This is a DOG' or 'This is NOT a dog' above!",
    "messages.newImageSelected": "🖼️ <strong>New Image Selected!</strong><br>🧠 The AI still remembers its previous lessons! Notice the connection strength numbers didn't change - that's its \"memory\" from earlier learning!",
    "messages.correctAnswer": "✅ <strong>Great job!</strong> The AI got it right! Now let's help it become even more confident...",
    "messages.wrongAnswer": "😅 <strong>Learning opportunity!</strong> Everyone makes mistakes - that's how we learn!",
    
    // View mode messages (authentic original text)
    "viewMode.studentEnabled": "🎓 <strong>Student view enabled!</strong><br>🌈 Ready for your learning adventure with simple, fun explanations!<br><em>All messages will now be shown in student mode.</em>",
    "viewMode.expertEnabled": "🎓 <strong>Expert view enabled!</strong><br>📊 Ready for detailed mathematical explanations with equations and technical details!<br><em>All messages will now be shown in expert mode.</em>",
    
    // Message log
    "log.student.header": "🎓 Learning Adventure",
    "log.expert.header": "📋 Mathematical Details",
    "log.student.complete": "📖 Your complete AI learning story - review at your own pace!",
    "log.expert.complete": "🎓 All mathematical steps preserved above",
    "log.cleared.student": "🗑️ <strong>Student Sidebar Cleared</strong><br>🎓 All previous lessons cleared. Ready for your next learning adventure!",
    "log.cleared.expert": "🗑️ <strong>Expert Sidebar Cleared</strong><br>📊 All previous mathematical analysis cleared. Ready for new detailed explanations!",
    
    // Training states (authentic original text)
    "training.superLearning": "🎢 <strong>STEP 3: AI Learning Boost!</strong><br>🎲 The AI is confused (guessing 50/50) AND some brain cells are \"asleep\"<br>🔋 We're boosting its learning power to wake up those sleepy neurons!<br>💡 Think of it like turning up the brightness on a dim lightbulb!",
    "training.boostMode": "⚡ <strong>BOOST MODE:</strong> Weak neurons detected with confused prediction. Amplifying learning signal for breakthrough learning!"
};