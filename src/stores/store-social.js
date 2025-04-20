import { defineStore } from 'pinia';

export const useSocialStore = defineStore('social', {
    state: () => ({
        visitors: [],
        lastUpdate: null,
        visitorNames: [
            'Harry Potter',
            'Hermione Granger',
            'Ron Weasley',
            'Luna Lovegood',
            'Neville Longbottom',
            'Ginny Weasley',
            'Draco Malfoy',
            'Cedric Diggory',
            'Cho Chang',
            'Fred Weasley',
            'George Weasley'
        ]
    }),

    actions: {
        addVisitor() {
            const visitorId = Math.random().toString(36).substring(7);
            const randomName = this.visitorNames[Math.floor(Math.random() * this.visitorNames.length)];
            
            const visitor = {
                id: visitorId,
                name: randomName,
                timestamp: Date.now()
            };

            // Get existing visitors from localStorage
            const storedVisitors = JSON.parse(localStorage.getItem('portfolioVisitors') || '[]');
            
            // Add new visitor
            storedVisitors.push(visitor);
            
            // Keep only the last 5 visitors
            const recentVisitors = storedVisitors.slice(-5);
            
            // Update localStorage
            localStorage.setItem('portfolioVisitors', JSON.stringify(recentVisitors));
            
            // Update store state
            this.visitors = recentVisitors;
            this.lastUpdate = Date.now();
        },

        getRecentVisitors() {
            const storedVisitors = JSON.parse(localStorage.getItem('portfolioVisitors') || '[]');
            this.visitors = storedVisitors;
            return storedVisitors;
        },

        clearOldVisitors() {
            const now = Date.now();
            const storedVisitors = JSON.parse(localStorage.getItem('portfolioVisitors') || '[]');
            const recentVisitors = storedVisitors.filter(visitor => 
                now - visitor.timestamp < 5 * 60 * 1000 // Keep visitors from last 5 minutes
            );
            localStorage.setItem('portfolioVisitors', JSON.stringify(recentVisitors));
            this.visitors = recentVisitors;
        }
    }
}); 