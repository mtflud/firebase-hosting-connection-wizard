<template>
    <div class="row">
        <div class="w-100">
            <div class="card">
                <div class="card-header card-header-warning">
                    <h4 class="card-title">Hi there!</h4>
                    <p class="card-category">Let's get you authenticated</p>
                </div>
                <div class="card-body">
                    <p>Welcome to the Firebase Domain Connection Wizard! To start, please
                        authenticate with Google. Make sure you're using an owner account of your Firebase project</p>
                    <img src="/assets/img/google_signin_button.png" class="img-fluid" @click="login" id="google-button"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    let provider;
    export default {
        name: "Login",
        mounted() {
            provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/siteverification.verify_only');
        },
        methods: {
            login() {
                firebase.auth().signInWithPopup(provider).then(result => {
                    const token = result.credential.accessToken;
                    // :: Save token on LS
                    localStorage.setItem('gToken', token);
                    return this.$router.push({name: 'hostingWizard'});
                }).catch(err => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const email = error.email;
                    const credential = error.credential;
                    console.log(errorCode, errorMessage, email, credential);
                    alert("Whoops! Something went worng, please try again!");
                });
            }
        }
    }
</script>

<style scoped>
#google-button {
    cursor: pointer;
    height: 40px;
    object-fit: contain;
}
</style>
