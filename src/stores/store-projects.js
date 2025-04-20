import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {
    state: () => ({
        component: 'Crafts',
        slug: 'projects',
        header: {
            title: 'Design Spells & Enchantments',
            subtitle: 'My magical collection of design works',
            parallax: {
                location: './images/wands.jpg'
            }
        },
        content: {
            title: 'Design Portfolio',
            description: [
                'Welcome to my little corner of design magic—where I\'m learning to turn ideas into visuals that (hopefully) spark a little wonder. From playful UI/UX concepts to branding experiments, each piece is a step in my journey of figuring out how design can tell stories, solve problems, and feel a bit magical.',
                '(✨ Still a beginner! So I\'ve also included some course projects and early explorations as part of this portfolio. Every great wizard starts somewhere, right?)'
            ]
        },
        projects: [
            {
                id: 1,
                name: 'Research Collab',
                description: 'A collaborative platform designed specifically for IIITD students and professors to streamline research collaboration. Features include direct research position applications, project management tools, and real-time collaboration capabilities.',
                image: './images/r1.jpg',
                url: 'https://github.com/GodMakesMe/ResearchCollab',
                language: 'JavaScript',
                tags: ['Academic', 'Collaboration', 'Research Platform']
            },
            {
                id: 2,
                name: 'Angry Birds Java',
                description: 'A Java-based implementation of the popular Angry Birds game, featuring physics-based gameplay and interactive elements.',
                image: './images/a1.jpg',
                url: 'https://github.com/uG2005/Angry_Birds_Java',
                language: 'Java',
                tags: ['Game Development', 'Physics', 'Java']
            },
            {
                id: 3,
                name: 'RISC-V Assembler & Simulator',
                description: 'A Python program that converts Assembly code to Machine code and simulates the instruction cycle for RISC-V architecture.',
                image: './images/wands.jpg',
                url: 'https://github.com/ihsuraa-c/RISC-V-Assembler-and-Simulator',
                language: 'Python',
                tags: ['Assembly', 'RISC-V', 'Simulation']
            },
            {
                id: 4,
                name: 'Food Recommendation System',
                description: 'A web application that recommends recipes based on specified ingredients, helping users discover new dishes they can make with available ingredients.',
                image: './images/wands.jpg',
                url: 'https://github.com/kanav57/Food-Recommendation-System-by-specified-Ingredients',
                language: 'Python',
                tags: ['Food', 'Recommendation', 'Web App']
            }
        ]
    }),

    getters: {
        getProjects: (state) => state.projects
    },

    actions: {
        // Add any project-related actions here if needed
    },
});
