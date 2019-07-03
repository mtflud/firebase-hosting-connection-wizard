import HostingWizard from "./components/wizards/hosting/HostingWizard";
import AuthenticationWizard from "./components/wizards/authentication/AuthenticationWizard";
import Login from "./components/Login";

const checkNotLoggedIn = (to, from, next) => {
    let user = firebase.auth().currentUser;
    if (user) {
        return next({name: 'hostingWizard'});
    }
    next();
};

const checkLoggedIn = (to, from, next) => {
    let user = firebase.auth().currentUser;
    if (!user) {
        return next({name: 'login'});
    }
    next();
};

const routes = [
    {
        path: '/',
        component: Login,
        name: 'login',
        beforeEnter: checkNotLoggedIn
    },
    {
        path: '/hosting',
        component: HostingWizard,
        name: 'hostingWizard',
        beforeEnter: checkLoggedIn
    },
    {
        path: '/authentication',
        component: AuthenticationWizard,
        name: 'authenticationWizard',
        beforeEnter: checkLoggedIn
    }
];


export default routes;
