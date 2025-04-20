import { defineStore } from 'pinia';

export const useContactStore = defineStore('contact', {
    state: () => ({
        component: 'Owl',
        slug: 'contact',
        header: {
            title: 'Contact Me',
            subtitle: 'Send an owl to my design studio',
            parallax: {
                location: './images/message.jpg'
            }
        },
        content: {
            title: 'Send a Magical Message',
            card_title: 'Send me an owl',
            description: [
                'Ready to create some magic together? Send me an owl with your ideas or questions about design, UI/UX, or creative collaborations.',
                'You can reach me directly at my magical address: aarushi23012@iiitd.ac.in — I\'ll respond with the swiftness of a Nimbus 2000!'
            ],
            email: 'aarushi23012@iiitd.ac.in'
        },
        footer: {

        }
    }),

    getters: {

    },

    actions: {

    },
});
