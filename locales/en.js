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
    "network.hiddenLayerN": "Hidden Layer {0}",
    "network.outputLayer": "Output Layer",
    "network.aiPrediction": "AI Prediction",
    
    // System messages
    "system.title": "📋 System Messages",
    "system.ready": "🎮 Ready! Pick \"Think\", \"Learn\", or \"Full Demo\"",
    "system.viewMode.student": "👁️ Student View",
    "system.viewMode.expert": "🔬 Expert View",
    "system.clear": "🗑️ Clear",
    "system.autoScroll": "📜 Auto-scroll",
    "system.autoScrollOn": "📜 Auto-scroll",
    "system.autoScrollOff": "📜 Manual",
    "system.autoScrollDisable": "Disable auto-scroll",
    "system.autoScrollEnable": "Enable auto-scroll",
    
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
    "expertPanel.architecture": "Architecture:",
    "expertPanel.outputSize": "Output Size:",
    "expertPanel.totalWeights": "Total Weights:",
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
    "forward.student.step3": "🎯 <strong>STEP 3: The Big Decision Moment!</strong><br>🎭 All the brain cells vote together like a jury making their final decision! Here's how confident each option feels:<br>• 🐕 <strong>\"{0}\"</strong> → <strong>{1}%</strong> confident<br>• ❌ <strong>\"{2}\"</strong> → <strong>{3}%</strong> confident<br><br>🏆 <strong>Final Decision:</strong> {4}",
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
    "training.boostMode": "⚡ <strong>BOOST MODE:</strong> Weak neurons detected with confused prediction. Amplifying learning signal for breakthrough learning!",
    
    // Document title
    "document.title": "Neural Network Learning Demo",
    
    // Activation function options
    "activation.leakyRelu": "Leaky ReLU",
    "activation.sigmoid": "Sigmoid", 
    "activation.tanh": "Tanh",
    "activation.softmax": "Softmax",
    
    // Tutorial elements
    "tutorial.step1": "Step 1",
    "tutorial.nextArrow": "Next →",
    
    // What If dialog
    "whatIf.title": "🔧 Weight Explorer",
    "whatIf.description": "Experiment with connection weights to see how they affect predictions!",
    "whatIf.inputToHidden": "📥 Input → Hidden Connections",
    "whatIf.hiddenToOutput": "📤 Hidden → Output Connections", 
    "whatIf.toHiddenNeuron": "To Hidden Neuron H{0}",
    "whatIf.toDogOutput": "To Dog Output",
    "whatIf.toNotDogOutput": "To Not Dog Output",
    "whatIf.noGradientData": "No gradient data available. Run training to see gradient flow.",
    
    // Weight strength descriptions
    "weights.veryStrong": "Very Strong",
    "weights.strong": "Strong", 
    "weights.medium": "Medium",
    "weights.weak": "Weak",
    "weights.veryWeak": "Very Weak",
    "weights.inhibitory": "Inhibitory",
    
    // Training status messages
    "training.epoch": "Epoch {0}",
    "training.loss": "Loss: {0}",
    "training.accuracy": "Accuracy: {0}%",
    "training.timeRemaining": "~{0}s remaining",
    "training.converged": "Converged! 🎉",
    "training.completed": "Training completed successfully!",
    
    // Error messages
    "error.loadingFailed": "Failed to load neural network",
    "error.trainingFailed": "Training failed to converge",
    "error.invalidInput": "Invalid input provided",
    
    // Speed control
    "speed.label": "Animation Speed",
    "speed.slow": "Slow",
    "speed.fast": "Fast",
    
    // Dynamic messages that appear in JavaScript
    "js.recording": "Recording...",
    "js.complete": "Complete",
    "js.calculating": "Calculating...",
    "js.updating": "Updating weights...",
    
    // Prediction labels
    "prediction.canine": "CANINE",
    "prediction.nonCanine": "NON-CANINE",
    "prediction.dog": "DOG",
    "prediction.notDog": "NOT DOG",
    
    // Result messages
    "result.correct": "Correct!",
    "result.wrong": "Wrong!",
    "result.correctCheck": "Correct ✓",
    "result.incorrectX": "Incorrect ✗",
    "result.aiGotItRight": "🎉 Great job! The AI got it right!",
    "result.aiWillLearn": "📚 The AI will learn from this mistake!",
    
    // Dynamic completion messages
    "completion.thinkingDone": "🎉 Thinking complete! The AI made its guess. Now click 'Learn' to see how it can improve from mistakes!",
    "completion.setCorrectAnswer": "🎉 Thinking complete! Set the correct answer above, then click 'Learn' to see how the AI improves!",
    
    // Voting messages for predictions
    "vote.definitelyDog": "It's definitely a DOG!",
    "vote.nopeNotDog": "Nope, NOT a dog!",
    "vote.prettyDog": "I'm pretty sure this is a DOG!",
    "vote.dontThinkDog": "I don't think this is a dog.",
    "vote.dogWon": "(The dog vote won!)",
    "vote.notDogWon": "(The not-dog vote won!)",
    
    // UI state messages
    "ui.thinking": "Thinking...",
    "ui.confidenceCalculation": "Confidence Calculation",
    "ui.readyToExplore": "🎮 <strong>Ready to Explore!</strong><br>🚀 Choose \"Watch AI Think\" to see how the AI makes decisions, or \"Watch AI Learn\" to see how it gets smarter. Try the full demo for the complete experience!",
    "ui.pickAction": "🎮 <strong>Ready to Explore!</strong><br>🚀 Pick \"Watch AI Think\", \"Watch AI Learn\", or \"Full Demo\" to see the neural network in action!",
    "ui.systemReady": "🎮 <strong>System Ready</strong><br>📊 All network parameters initialized. Ready to demonstrate forward propagation, backpropagation, or full training cycle.",
    "ui.systemReadySelect": "🎮 <strong>System Ready</strong><br>📈 Select demonstration mode: Forward propagation, Backpropagation, or Complete cycle.",
    
    // Additional expert view messages
    "expert.matrixMultiplication": "Matrix Multiplication",
    "expert.finalPrediction": "Final Prediction",
    "expert.currentActivation": "Current activation function:",
    "expert.outputActivation": "Output activation:",
    "expert.readyBackprop": "Ready for backpropagation with target:",
    "expert.needTargetLabel": "Need target label for backpropagation training",
    "expert.confidence": "Confidence:",
    "expert.networkOutput": "Network output:",
    
    // Connection editor
    "connectionEditor.weight": "Weight:",
    "connectionEditor.reset": "Reset",
    "connectionEditor.apply": "Apply",
    "connectionEditor.close": "Close",
    
    // Neuron hover menu
    "neuronHover.calculation": "Calculation",
    "neuronHover.inputValue": "Input Value",
    "neuronHover.weights": "Weights",
    "neuronHover.sum": "Sum",
    "neuronHover.activation": "Activation",
    "neuronHover.finalValue": "Final Value",
    "neuronHover.formula": "Formula",
    "neuronHover.step1": "Step 1: Multiply inputs by weights",
    "neuronHover.step2": "Step 2: Add all products together", 
    "neuronHover.step3": "Step 3: Apply activation function",
    "neuronHover.noCalculation": "No calculation available",
    "neuronHover.inputLayer": "Input Layer Neuron",
    "neuronHover.hiddenLayer": "Hidden Layer Neuron",
    "neuronHover.outputLayer": "Output Layer Neuron",
    "neuronHover.directInput": "Direct input value (no calculation)",
    "neuronHover.weightedSum": "Weighted sum of inputs",
    "neuronHover.activationFunction": "After applying activation function",
    
    // Activation function visualization
    "activation.title": "🧠 How Activation Functions Work",
    "activation.subtitle": "Understanding the brain-inspired mathematics behind neural networks",
    "activation.biologicalTitle": "🔬 Biological Inspiration",
    "activation.biologicalExplanation": "Real neurons in your brain work like switches - they only \"fire\" (send a signal) when they receive enough excitatory input. Negative inputs are inhibitory (suppress firing), positive inputs are excitatory (encourage firing), and zero means no connection exists.",
    "activation.mathematicalTitle": "📊 Mathematical Behavior",
    "activation.currentFunction": "Current Function",
    "activation.inputRange": "Input Range",
    "activation.outputRange": "Output Range", 
    "activation.characteristics": "Key Characteristics",
    "activation.interactiveTitle": "🎮 Interactive Exploration",
    "activation.dragPoint": "Drag the red point to see how different inputs transform",
    "activation.inputValue": "Input",
    "activation.outputValue": "Output",
    "activation.leakyReLU": "Leaky ReLU",
    "activation.sigmoid": "Sigmoid",
    "activation.tanh": "Tanh",
    "activation.relu": "ReLU",
    "activation.leakyReLUDesc": "Allows small negative values to pass through, preventing \"dead neurons\"",
    "activation.sigmoidDesc": "Squashes all values between 0 and 1, like a biological probability",
    "activation.tanhDesc": "Centers output around 0, making learning more stable",
    "activation.reluDesc": "Simple threshold: positive values pass, negative become zero",
    "activation.biologicalConnection": "🧬 Connection to Biology",
    "activation.negativeInput": "Negative Input (Inhibitory)",
    "activation.zeroInput": "Zero Input (No Connection)", 
    "activation.positiveInput": "Positive Input (Excitatory)",
    "activation.neuronFiring": "Neuron Response",
    "activation.inhibited": "Strongly inhibited - neuron stays quiet",
    "activation.silent": "No signal - neuron remains at baseline",
    "activation.excited": "Activated - neuron fires proportionally to strength",
    "activation.close": "Close"
};