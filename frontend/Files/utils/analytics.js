/**
 * Analytics utility for tracking app usage
 * Note: In a real app, this would connect to an analytics service
 */

// Mock analytics implementation
class Analytics {
    constructor() {
        this.isInitialized = false;
        this.userId = null;
        this.sessionId = null;
        this.events = [];
    }

    // Initialize analytics
    init() {
        if (this.isInitialized) return;

        this.isInitialized = true;
        this.sessionId = this.generateSessionId();

        console.log('Analytics initialized with session ID:', this.sessionId);

        // Track app open event
        this.trackEvent('app_open');
    }

    // Generate unique session ID
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Set user ID
    setUserId(userId) {
        this.userId = userId;
        console.log('Analytics user ID set:', userId);
    }

    // Track events
    trackEvent(eventName, eventParams = {}) {
        if (!this.isInitialized) {
            console.warn('Analytics not initialized');
            return;
        }

        const event = {
            eventName,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: this.userId,
            ...eventParams
        };

        this.events.push(event);
        console.log('Analytics event tracked:', eventName, eventParams);

        // In a real app, you would send this to your analytics service
    }

    // Track screen views
    trackScreenView(screenName, screenParams = {}) {
        this.trackEvent('screen_view', {
            screen_name: screenName,
            ...screenParams
        });
    }

    // Track user actions
    trackUserAction(actionName, actionParams = {}) {
        this.trackEvent('user_action', {
            action_name: actionName,
            ...actionParams
        });
    }

    // Track errors
    trackError(errorName, errorDetails = {}) {
        this.trackEvent('error', {
            error_name: errorName,
            ...errorDetails
        });
    }

    // Track health metrics
    trackHealthMetric(metricName, value, additionalParams = {}) {
        this.trackEvent('health_metric', {
            metric_name: metricName,
            metric_value: value,
            ...additionalParams
        });
    }

    // Flush events (in a real app, this would send queued events)
    flush() {
        if (!this.isInitialized || this.events.length === 0) return;

        console.log(`Analytics: flushing ${this.events.length} events`);
        this.events = [];
    }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;