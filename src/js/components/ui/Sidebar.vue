<template>
    <div class="sidebar" data-color="orange" data-background-color="black">
        <div class="logo">
            <div class="container-fluid" id="main-logo-container">
                <img src="/assets/img/firebase.png" class="img-fluid" width="30" height="30"/>
                <router-link :to="{ name: 'hostingWizard'}">
                    Firebase DNS Wizard
                </router-link>
            </div>
        </div>
        <div class="sidebar-wrapper">
            <ul class="nav">
                <li class="nav-item" v-for="item in items" :class="{'active': currentRoute === item.name}" v-if="user">
                    <router-link :to="{ name: item.name}" class="nav-link">
                        <i class="material-icons" v-text="item.icon"></i>
                        <p v-text="item.displayName"></p>
                    </router-link>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" v-if="user" @click.prevent="logOut">
                        <i class="material-icons">logout</i>
                        <p>Logout</p>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Sidebar",
        data() {
            return {
                user: firebase.auth().currentUser,
                items: [
                    {
                        name: 'hostingWizard',
                        displayName: 'Hosting',
                        icon: 'dashboard'
                    },
                    {
                        name: 'authenticationWizard',
                        displayName: 'Authentication',
                        icon: 'mail'
                    }
                ]
            };
        },
        computed: {
            currentRoute() {
                return this.$route.name;
            }
        },
        mounted() {
            firebase.auth().onAuthStateChanged(() => {
                this.user = firebase.auth().currentUser;
            })
        },
        methods: {
            logOut() {
                firebase.auth().signOut().then(() => {
                    this.$nextTick(() => {
                        return this.$router.push({name: 'login'});
                    });
                });
            }
        }
    }
</script>

<style scoped>
    #main-logo-container {
        display: flex;
        align-items: center;
        justify-content: space-around
    }
</style>
