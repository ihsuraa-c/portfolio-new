import { defineStore } from 'pinia';
import axios from "axios";

export const useProfileStore = defineStore('profile', {
    state: () => ({
        component: 'Profile',
        username: 'aarushichawla',
        org: 'iiitd',
        name: 'Aarushi',
        initial: '',
        surname: 'Chawla',
        social: {
            facebook: 'https://www.instagram.com/ihsuraa_c/',
            github: 'https://github.com/ihsuraa-c',
            twitter: 'https://x.com/ihsuraa_c',
            linkedin: 'https://www.linkedin.com/in/ihsuraac'
        },
        // GitHub Personal Token
        github_personal_token: import.meta.env.VITE_GITHUB_PERSONAL_TOKEN,
        repositories: [],
        message: 'Fetching Design Works...'
    }),

    getters: {
        getMessage(state) {
            return state.message;
        }
    },

    actions: {
        async fetchOrgRepositories() {
            const org = this.org;
            const token = this.github_personal_token;

            const response = await axios.get(`https://api.github.com/orgs/${org}/repos?per_page=100`, {
                headers: {
                    'Authorization': `${token}`
                }
            });
            return response.data;
        },
        async fetchRepositories() {
            const username = this.username;
            const token = this.github_personal_token;
            let response;

            try {
                response = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                this.message = 'Design works fetched successfully!'
                setTimeout(() => {
                    this.message = null;
                }, 1000);
            } catch (error) {
                this.message = 'Error fetching design works!'
            }

            const orgRepos = await this.fetchOrgRepositories();
            const allRepos = [...response.data, ...orgRepos];

            // Filter the repositories array base on repoNames
            const filteredRepos = allRepos.filter(
                repo =>
                    // Design portfolio projects would be listed here
                    (repo.name === 'ui-ux-wizardry') ||
                    (repo.name === 'magical-branding') ||
                    (repo.name === 'visual-storytelling') ||
                    (repo.name === 'accessible-design-spells')
            );

            this.repositories = filteredRepos.map(repo => ({
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                license: repo.license?.name || '',
                visibility: repo.visibility,
                url: repo.html_url,
                watchers: repo.watchers_count
            }));
        }
    },
});
