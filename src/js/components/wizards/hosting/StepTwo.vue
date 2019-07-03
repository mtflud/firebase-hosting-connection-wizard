<template>
    <div>
        <h2>Let's get you verified</h2>
        <p>We need to verify you're the owner of this domain. In order to verify your ownership, we
            need you to add a <a href="https://en.wikipedia.org/wiki/TXT_record" target="_blank">TXT</a> type record
            on the "apex" or "root" domain.</p>
        <p>You can do that by visiting your DNS provider's <a
                :href="providerInstructions.dashboardUrl" target="_blank">Dashboard</a> and
            following
            <a :href="providerInstructions.addTxtUrl" target="_blank">these instructions</a> to add
            your record. Remember, you can have multiple
            TXT records with different values, but a record with the exact same value must be
            present in
            order for verification to take place.</p>
        <hr>
        <p>Here's what you should add:</p>
        <div class="table-responsive">
            <!-- What you should have table -->
            <table class="table">
                <thead class=" text-primary">
                <th>Host</th>
                <th>Type</th>
                <th>Value</th>
                </thead>
                <tbody>
                <tr>
                    <td v-text="hostNameRepresentation"></td>
                    <td>TXT</td>
                    <td v-text="expectedTxtVerificationRecord"></td>
                </tr>
                </tbody>
            </table>
            <hr>
            <div v-if="txtVerificationChecked">
                <p>Here's what we found:</p>
                <!-- What we found table -->
                <div class="table-responsive">
                    <table class="table">
                        <thead class=" text-primary">
                        <th>Host</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Discovered in</th>
                        </thead>
                        <tbody>
                        <tr v-for="record in foundTxtRecords">
                            <td><code :class="{'color-success': record === expectedTxtVerificationRecord}"
                                      v-text="apexDomain"></code></td>
                            <td><code
                                    :class="{'color-success': record === expectedTxtVerificationRecord}">TXT</code>
                            </td>
                            <td><code :class="{'color-success': record === expectedTxtVerificationRecord}"
                                      v-text="record"></code>
                            </td>
                            <td>
                                <div class="flags-container">
                                    <div class="flag-container">
                                        <img src="/assets/img/us.svg" class="flag">
                                        <img src="/assets/img/loader.svg" class="flag-status" v-if="loadingUS">
                                        <img :src="(foundTxtRecordsUS.includes(record) ? '/assets/img/check.svg' : '/assets/img/cross.svg')"
                                             class="flag-status" v-if="!loadingUS">
                                    </div>
                                    <div class="flag-container">
                                        <img src="/assets/img/eu.svg" class="flag">
                                        <img src="/assets/img/loader.svg" class="flag-status" v-if="loadingEU">
                                        <img :src="(foundTxtRecordsEU.includes(record) ? '/assets/img/check.svg' : '/assets/img/cross.svg')"
                                             class="flag-status" v-if="!loadingEU">
                                    </div>
                                    <div class="flag-container">
                                        <img src="/assets/img/as.svg" class="flag">
                                        <img src="/assets/img/loader.svg" class="flag-status" v-if="loadingAS">
                                        <img :src="(foundTxtRecordsUS.includes(record) ? '/assets/img/check.svg' : '/assets/img/cross.svg')"
                                             class="flag-status" v-if="!loadingAS">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <br/>
                <!-- Feedback -->
                <div v-if="!loadingUS && !loadingAS && !loadingEU">
                    <div class="alert alert-success" v-if="txtVerificationOk">
                    <span>
                        <b>Awesome!</b> &nbsp; We were able to find the required TXT record to verify your domain! 😄
                        <p>Remember Firebase constantly checks for the presence of this record, so <b>don't remove it</b>!</p>
                    </span>
                    </div>
                    <div class="alert alert-danger" v-if="!txtVerificationOk">
                    <span>
                        <b>Whoops!</b> &nbsp; We were not able to find the required TXT record 😞
                        <ul>
                            <li>If you've just added it, please wait a bit longer for propagation to take place (it may take up to 24 hours).</li>
                            <li v-if="providerInstructions.usesAtSymbol === true">Your DNS provider requires you to enter "<code>@</code>" as the Host name while adding this record. Double-check that you've added it this way.</li>
                            <li v-if="providerInstructions.usesAtSymbol === false">Your DNS provider requires you to enter "<code
                                    v-text="this.apexDomain"></code>" as the Host name while adding this record. Double-check that you've added it that way.</li>
                            <li>If after waiting you're still having issues, please try to <a
                                    style="text-decoration: underline;"
                                    :href="providerInstructions.supportUrl" target="_blank">contact your DNS provider's support</a> directly.</li>
                        </ul>
                    </span>
                    </div>
                    <p class="firebase-amber" v-if="hasRecordsNotDiscoverableInAllRegions">⚠️ Looks like some of your
                        DNS records are still not discoverable by all DNS servers across the
                        globe. Firebase may not be able to find your records just yet, so you should wait a bit longer
                        for full propagation to take place.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .flags-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .flag {
        height: 30px;
        object-fit: contain;
    }

    .flag-container {
        position: relative;
    }

    .flag-status {
        position: absolute;
        width: 10px;
        object-fit: contain;
        bottom: 0px;
        right: -5px;
    }
</style>

<script>
    import {mapState} from 'vuex'
    import {config} from "../../../config";

    export default {
        data() {
            return {
                txtVerificationChecked: false,
                txtVerificationOk: false,
                loadingUS: false,
                loadingEU: false,
                loadingAS: false
            };
        },
        computed: {
            // :: Get a representation of what should be inputted in the "host" field
            hostNameRepresentation() {
                if (!this.providerInstructions) {
                    return null;
                }
                if (this.providerInstructions.usesAtSymbol === null) {
                    return `"@" or "${this.apexDomain}"`;
                }
                return this.providerInstructions.usesAtSymbol ? '@' : this.apexDomain;
            },
            // :: Whether or not one or more records are not discoverable by all regions
            hasRecordsNotDiscoverableInAllRegions() {
                return !this.foundTxtRecordsUS.every(r => this.foundTxtRecordsEU.includes(r)) ||
                    !this.foundTxtRecordsUS.every(r => this.foundTxtRecordsAS.includes(r)) ||
                    !this.foundTxtRecordsEU.every(r => this.foundTxtRecordsAS.includes(r));
            },
            ...mapState({
                providerInstructions: state => state.hosting.providerInstructions,
                expectedTxtVerificationRecord: state => state.hosting.expectedTxtVerificationRecord,
                apexDomain: state => state.hosting.apexDomain,
                foundTxtRecords: state => state.hosting.foundTxtRecords,
                foundTxtRecordsUS: state => state.hosting.foundTxtRecordsUS,
                foundTxtRecordsEU: state => state.hosting.foundTxtRecordsEU,
                foundTxtRecordsAS: state => state.hosting.foundTxtRecordsAS
            })
        },
        methods: {
            // :: Make a request to query the DNS records (region specific)
            queryDNS(config) {
                return new Promise((resolve, reject) => {
                    this[`loading${config.name}`] = true;
                    const payload = {
                        host: this.apexDomain
                    };
                    return axios.post(config.uri, payload).then(({data}) => {
                        const records = data.data;
                        this.$store.commit('updateFoundTxtRecords', records.TXT || []);
                        this.$store.commit(`setFoundTxtRecords${config.name}`, records.TXT || []);
                        this[`loading${config.name}`] = false;
                        this.txtVerificationChecked = true;
                        return resolve();
                    }).catch(err => {
                        console.log(err);
                        this[`loading${config.name}`] = false;
                        return reject(err);
                    });
                });
            },
            // :: Check if proper verification record is present
            checkTxtVerification() {
                // :: Go next if already verified as OK
                if (this.txtVerificationOk) {
                    return true;
                }
                this.$emit('loading');
                // :: Make a request to check the DNS records from each region
                let promises = [];
                config.dnsUrls.forEach(config => {
                    promises.push(this.queryDNS(config));
                });
                return Promise.all(promises).then(() => {
                    // :: All regions have been checked
                    this.$emit('finishedLoading');
                    this.txtVerificationOk = this.foundTxtRecords.includes(this.expectedTxtVerificationRecord);
                    return false;
                }).catch(err => {
                    console.log(err);
                    this.$snack.danger({
                        text: `Whoops! ${err.message}. Please try again.`,
                        button: 'CLOSE'
                    });
                    this.$emit('finishedLoading');
                    return false;
                });
            },
            reset() {
                this.txtVerificationChecked = false;
                this.txtVerificationOk = false;
                this.loadingUS = false;
                this.loadingEU = false;
                this.loadingAS = false;
            }
        }
    }
</script>
