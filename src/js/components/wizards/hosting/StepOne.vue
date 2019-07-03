<template>
    <div>
        <h2>Let's get started</h2>
        <p>This wizard will guide you step-by-step on how to connect your custom domain name with
            Firebase Hosting. Please follow the instructions to get your site up and running in no
            time!</p>
        <p>First, start by telling us more information about your DNS:</p>
        <form>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label class="bmd-label-floating">What's the domain name you're trying to
                            connect?</label>
                        <input type="text" class="form-control" v-model="hostName"
                               @keydown.enter="getVerificationRecord"
                               placeholder="e.g myproject.com">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label class="bmd-label-floating">What's your DNS provider?</label>
                        <select class="custom-select" v-model="provider"
                                @change="selectProviderInstructions">
                            <option value="" selected>Select an option...</option>
                            <option v-for="provider in providerList" v-text="provider.name"
                                    :value="provider.value"></option>
                        </select>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import {instructions} from "../../../instruction_mappings";

    const parseDomain = require("parse-domain");
    export default {
        computed: {
            hostName: {
                get() {
                    return this.$store.state.hosting.hostName;
                },
                set(value) {
                    this.$store.commit('setHostName', value);
                }
            },
            provider: {
                get() {
                    return this.$store.state.hosting.provider;
                },
                set(value) {
                    this.$store.commit('setProvider', value)
                }
            },
            ...mapState({
                apexDomain: state => state.hosting.apexDomain,
                subDomain: state => state.hosting.subDomain,
                expectedTxtVerificationRecord: state => state.hosting.expectedTxtVerificationRecord,
                providerList: state => state.hosting.providerList
            })
        },
        methods: {
            // :: Map the instructions from the selected provider
            selectProviderInstructions() {
                this.$store.commit('setProviderInstructions', instructions[this.provider] || false);
            },
            // :: Validate initial user's input and get the DNS TXT challenge
            getVerificationRecord() {
                return new Promise((resolve, reject) => {
                    const validHostRegex = /^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/g;
                    // :: Validate input
                    if (!this.hostName.includes('.') || !validHostRegex.test(this.hostName) || this.provider === '') {
                        this.$snack.danger({
                            text: `Whoops! Your input seems incorrect, please check it and try again`,
                            button: 'CLOSE'
                        });
                        return reject(false);
                    }
                    // :: Get the token from Google login
                    const token = localStorage.getItem('gToken');
                    this.$emit('loading');
                    // :: Parse apex domain and sub domain
                    const parsedDomain = parseDomain(this.hostName);
                    this.$store.commit('setApexDomain', `${parsedDomain.domain}.${parsedDomain.tld}`);
                    this.$store.commit('setSubDomain', parsedDomain.subdomain);
                    // :: Get challenge
                    const payload = {
                        site: {type: "INET_DOMAIN", identifier: this.apexDomain},
                        verificationMethod: 'DNS_TXT'
                    };
                    const configuration = {
                        headers: {Authorization: `Bearer ${token}`}
                    };
                    axios.post(`https://www.googleapis.com/siteVerification/v1/token`, payload, configuration).then(({data}) => {
                        this.$store.commit('setExpectedTxtVerificationRecord', data.token);
                        this.$emit('finishedLoading');
                        return resolve(true);
                    }).catch(err => {
                        console.log(err);
                        // :: Authentication Error - Most likely, Google's Token has expired
                        if (err.response.status === 401) {
                            return firebase.auth().signOut().then(() => {
                                this.$nextTick(() => {
                                    this.$snack.danger({
                                        text: `Your session was expired. Please login and try again.`,
                                        button: 'CLOSE'
                                    });
                                    return this.$router.push({name: 'login'});
                                });
                            });
                        }
                        this.$snack.danger({
                            text: `Whoops! ${err.message}. Please try again.`,
                            button: 'CLOSE'
                        });
                        this.$emit('finishedLoading');
                        return reject(false);
                    });
                });
            },
        }
    }
</script>
