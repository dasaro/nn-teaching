function runComprehensiveTests() {
    console.log('🧪 RUNNING COMPREHENSIVE NEURAL NETWORK TESTS...\n');
    
    const tests = [
        { name: 'Dead Neuron Prevention', fn: testDeadNeuronPrevention },
        { name: 'Weight Initialization', fn: testWeightInitialization },
        { name: 'Generalization', fn: testGeneralization },
        { name: '100% Accuracy Achievement', fn: test100PercentAccuracy }
    ];
    
    const results = [];
    
    tests.forEach(test => {
        console.log(`\n--- ${test.name.toUpperCase()} ---`);
        const result = test.fn();
        result.testName = test.name;
        results.push(result);
        console.log(result.message);
    });
    
    // Summary
    console.log('\n=== TEST SUMMARY ===');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    results.forEach(result => {
        console.log(`${result.testName}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    });
    
    console.log(`\nOverall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 ALL TESTS PASSED! The neural network is working properly.');
    } else {
        console.log('⚠️ Some tests failed. Check the issues above.');
    }
    
    return {
        passed: passed,
        total: total,
        results: results,
        success: passed === total
    };
}

if (typeof window !== 'undefined') window.runComprehensiveTests = runComprehensiveTests;