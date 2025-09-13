// ============================================================================
// MODULE MESSENGER - Safe Inter-Module Communication System
// Provides message bus and service registry for decoupled module communication
// ============================================================================

/**
 * ModuleMessenger - Safe communication layer between modules
 * Replaces direct window.module access with managed service registry
 */
class ModuleMessenger {
    constructor() {
        this.services = new Map();
        this.events = new EventTarget();
        this.messageLog = [];
        this.debugMode = false;
    }

    /**
     * Register a module's public interface as a service
     * @param {string} serviceName - Name of the service
     * @param {Object} serviceObject - Object containing public methods
     * @param {Array} methods - Optional: list of allowed method names for security
     */
    registerService(serviceName, serviceObject, methods = null) {
        // Security: Only register allowed methods if specified
        if (methods && Array.isArray(methods)) {
            const filteredService = {};
            methods.forEach(methodName => {
                if (typeof serviceObject[methodName] === 'function') {
                    filteredService[methodName] = serviceObject[methodName].bind(serviceObject);
                }
            });
            this.services.set(serviceName, filteredService);
        } else {
            this.services.set(serviceName, serviceObject);
        }
        
        console.log(`📡 Service registered: ${serviceName}${methods ? ` (${methods.length} methods)` : ''}`);
        this.broadcast('service:registered', { serviceName, methods });
    }

    /**
     * Call a service method safely with error handling
     * @param {string} serviceName - Name of the target service
     * @param {string} methodName - Method to call
     * @param {...*} args - Arguments to pass to the method
     * @returns {*} Method result or null if service/method not available
     */
    call(serviceName, methodName, ...args) {
        const service = this.services.get(serviceName);
        
        if (!service) {
            this.log('warn', `Service not found: ${serviceName}`);
            return null;
        }

        if (typeof service[methodName] !== 'function') {
            this.log('warn', `Method not found: ${serviceName}.${methodName}`);
            return null;
        }

        try {
            const result = service[methodName](...args);
            this.log('info', `Called: ${serviceName}.${methodName}`, args);
            return result;
        } catch (error) {
            this.log('error', `Error calling ${serviceName}.${methodName}:`, error.message);
            return null;
        }
    }

    /**
     * Check if a service and method are available
     * @param {string} serviceName - Service name
     * @param {string} methodName - Method name (optional)
     * @returns {boolean} True if service (and method) exists
     */
    hasService(serviceName, methodName = null) {
        const service = this.services.get(serviceName);
        if (!service) return false;
        if (methodName) return typeof service[methodName] === 'function';
        return true;
    }

    /**
     * Get list of available services
     * @returns {Array} Array of service names
     */
    getServices() {
        return Array.from(this.services.keys());
    }

    /**
     * Get methods available on a service
     * @param {string} serviceName - Service name
     * @returns {Array} Array of method names
     */
    getServiceMethods(serviceName) {
        const service = this.services.get(serviceName);
        if (!service) return [];
        return Object.keys(service).filter(key => typeof service[key] === 'function');
    }

    /**
     * Broadcast an event to all subscribers
     * @param {string} eventType - Event type name
     * @param {*} data - Data to send with event
     */
    broadcast(eventType, data = {}) {
        const event = new CustomEvent(eventType, { 
            detail: { 
                ...data, 
                timestamp: Date.now(),
                source: 'ModuleMessenger' 
            } 
        });
        
        this.events.dispatchEvent(event);
        this.log('info', `Event broadcast: ${eventType}`, data);
    }

    /**
     * Subscribe to events
     * @param {string} eventType - Event type to listen for
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(eventType, callback) {
        this.events.addEventListener(eventType, callback);
        this.log('info', `Subscribed to: ${eventType}`);
        
        // Return unsubscribe function
        return () => {
            this.events.removeEventListener(eventType, callback);
            this.log('info', `Unsubscribed from: ${eventType}`);
        };
    }

    /**
     * Subscribe to events with automatic cleanup
     * @param {string} eventType - Event type
     * @param {Function} callback - Callback function
     * @param {Object} options - Options: { once: boolean, timeout: number }
     */
    subscribeOnce(eventType, callback, options = {}) {
        const { timeout } = options;
        
        const wrappedCallback = (event) => {
            callback(event);
            if (timeoutId) clearTimeout(timeoutId);
        };

        this.events.addEventListener(eventType, wrappedCallback, { once: true });

        let timeoutId = null;
        if (timeout) {
            timeoutId = setTimeout(() => {
                this.events.removeEventListener(eventType, wrappedCallback);
                this.log('warn', `Subscription timeout: ${eventType}`);
            }, timeout);
        }
    }

    /**
     * Request/Response pattern for service communication
     * @param {string} serviceName - Target service
     * @param {string} requestType - Type of request
     * @param {*} data - Request data
     * @param {number} timeout - Response timeout in ms
     * @returns {Promise} Promise that resolves with response or rejects on timeout
     */
    async request(serviceName, requestType, data = {}, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const responseEvent = `response:${requestId}`;

            // Set up response listener
            const unsubscribe = this.subscribe(responseEvent, (event) => {
                clearTimeout(timeoutId);
                unsubscribe();
                resolve(event.detail.data);
            });

            // Set up timeout
            const timeoutId = setTimeout(() => {
                unsubscribe();
                reject(new Error(`Request timeout: ${serviceName}.${requestType}`));
            }, timeout);

            // Send request
            this.broadcast(`request:${serviceName}:${requestType}`, {
                requestId,
                data,
                responseEvent
            });
        });
    }

    /**
     * Respond to a request
     * @param {string} responseEvent - Response event name
     * @param {*} data - Response data
     */
    respond(responseEvent, data) {
        this.broadcast(responseEvent, { data });
    }

    /**
     * Enable/disable debug logging
     * @param {boolean} enabled - Enable debug mode
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
        console.log(`📡 MessengerDebug: ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Get communication statistics
     * @returns {Object} Stats about service usage
     */
    getStats() {
        const stats = {
            totalServices: this.services.size,
            services: {},
            totalMessages: this.messageLog.length,
            messagesByType: {}
        };

        // Count methods per service
        for (const [serviceName, service] of this.services) {
            stats.services[serviceName] = {
                methodCount: Object.keys(service).filter(key => typeof service[key] === 'function').length,
                methods: Object.keys(service).filter(key => typeof service[key] === 'function')
            };
        }

        // Count messages by type
        this.messageLog.forEach(msg => {
            stats.messagesByType[msg.type] = (stats.messagesByType[msg.type] || 0) + 1;
        });

        return stats;
    }

    /**
     * Internal logging with optional persistence
     * @param {string} level - Log level (info, warn, error)
     * @param {string} message - Log message
     * @param {*} data - Additional data
     */
    log(level, message, data = null) {
        const logEntry = {
            timestamp: Date.now(),
            level,
            message,
            data
        };

        this.messageLog.push(logEntry);
        
        // Keep log size manageable
        if (this.messageLog.length > 1000) {
            this.messageLog = this.messageLog.slice(-500);
        }

        if (this.debugMode) {
            console.log(`📡 [${level.toUpperCase()}] ${message}`, data || '');
        }
    }

    /**
     * Clear message log
     */
    clearLog() {
        this.messageLog = [];
        console.log('📡 Message log cleared');
    }

    /**
     * Export diagnostics for debugging
     * @returns {Object} Diagnostic information
     */
    getDiagnostics() {
        return {
            services: this.getServices(),
            stats: this.getStats(),
            recentMessages: this.messageLog.slice(-20),
            systemHealth: {
                servicesRegistered: this.services.size,
                messagesLogged: this.messageLog.length,
                uptimeMs: Date.now() - (this.startTime || Date.now())
            }
        };
    }
}

// ============================================================================
// GLOBAL INITIALIZATION
// ============================================================================

// Create global instance
if (typeof window !== 'undefined') {
    // Initialize messenger
    window.messenger = new ModuleMessenger();
    window.messenger.startTime = Date.now();
    
    // Add convenience methods to global scope
    window.callService = (serviceName, methodName, ...args) => 
        window.messenger.call(serviceName, methodName, ...args);
    
    window.broadcastEvent = (eventType, data) => 
        window.messenger.broadcast(eventType, data);
    
    window.subscribeToEvent = (eventType, callback) => 
        window.messenger.subscribe(eventType, callback);

    console.log('📡 ModuleMessenger initialized - Safe inter-module communication available');
    
    // Register with module system
    if (window.moduleLoaded) {
        window.moduleLoaded('module-messenger');
    }
    
    // Broadcast initialization
    setTimeout(() => {
        window.messenger.broadcast('system:messenger-ready', {
            services: window.messenger.getServices(),
            features: ['service-registry', 'event-bus', 'request-response', 'diagnostics']
        });
    }, 100);
}

// ============================================================================
// MIGRATION HELPERS
// ============================================================================

/**
 * Helper function to migrate from direct window access to messenger
 * @param {string} windowProperty - Original window property name
 * @param {string} serviceName - New service name
 * @returns {Proxy} Proxy that redirects calls to messenger
 */
function createMigrationProxy(windowProperty, serviceName) {
    return new Proxy({}, {
        get(target, prop) {
            console.warn(`⚠️ Migration: Use messenger.call('${serviceName}', '${prop}') instead of window.${windowProperty}.${prop}`);
            return window.messenger.call(serviceName, prop);
        }
    });
}

// Export migration helper
if (typeof window !== 'undefined') {
    window.createMigrationProxy = createMigrationProxy;
}