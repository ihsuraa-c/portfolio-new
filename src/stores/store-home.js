import { defineStore } from 'pinia';

export const useHomeStore = defineStore('home', {
    state: () => ({
        component: 'Home',
        slug: '',
        header: {
            title: 'Welcome to Aarushi\'s Magical Studio of Design',
            subtitle: 'Where creativity and code blend like potions in a cauldron',
            action: 'Explore My Works',
            parallax: {
                location: './images/journey.jpg'
            }
        },
        content: {
            title: 'About Me',
            description: [
                'Hi there! I\'m Aarushi Chawla, a second-year Computer Science and Design student at IIIT-Delhi, just beginning my journey into the world where logic meets creativity. Think of me as a curious young witch still discovering the right mix of spells—learning to balance the precision of code with the expressive power of design.',
                'While I\'m still at the early stages of exploring visual storytelling and UI/UX design, I\'m constantly learning and experimenting. This portfolio is my first step into that world—a beginner\'s collection of ideas, projects, and possibilities. I believe that even small designs can spark big emotions, just like how a simple wand flick can unlock something extraordinary.',
                'My toolkit is growing by the day, currently featuring Adobe Illustrator, Photoshop, Figma, and of course, my favorite creative fuel: a notebook full of ideas and endless cups of chai.',
                'I\'m especially interested in how design can be used to tell stories, build identities, and make learning more accessible—helping every young wizard and witch find their way, no matter where they come from.'
            ]
        },
        footer: {

        }
    }),

    getters: {

    },

    actions: {

    },
});
