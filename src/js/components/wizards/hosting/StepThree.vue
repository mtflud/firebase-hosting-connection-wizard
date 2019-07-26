<template>
    <div>
        <h2>Let's get you connected!</h2>
        <p>
            Now that your domain is verified, we have to configure it so that Firebase Servers
            respond to requests made to it.
        </p>
        <p>
            You can do that by visiting your DNS provider's
            <a :href="providerInstructions.dashboardUrl" target="_blank">Dashboard</a> and
            following
            <a :href="providerInstructions.addAUrl" target="_blank">these instructions</a> to add
            your records.
        </p>
        <p>
            Remember, your domain name should have <b>two and only two</b> A type records with the values shown below,
            so please remove any additional records of this type if you already have any.
        </p>
        <hr/>
        <p>Here's what you should add:</p>
        <div class="table-responsive">
            <!-- What you should have table -->
            <table class="table">
                <thead class="text-primary">
                <th>Host</th>
                <th>Type</th>
                <th>Value</th>
                </thead>
                <tbody>
                <tr v-for="record in expectedATypeRecords">
                    <td v-text="hostNameRepresentation"></td>
                    <td>A</td>
                    <td v-text="record"></td>
                </tr>
                </tbody>
            </table>
            <hr/>
            <!-- What we found -->
            <div v-if="aTypeRecordsChecked">
                <p>Here's what we found:</p>
                <!-- What we found table -->
                <div class="table-responsive">
                    <table class="table">
                        <thead class="text-primary">
                        <th>Host</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Discovered in</th>
                        </thead>
                        <tbody>
                        <tr v-for="record in foundATypeRecords">
                            <td>
                                <code
                                        :class="expectedATypeRecords.includes(record) ? 'color-success' : 'text-danger'"
                                        v-text="`${subDomain}${(subDomain && subDomain !== '' ? '.' : '')}${apexDomain}`"
                                ></code>
                            </td>
                            <td>
                                <code
                                        :class="expectedATypeRecords.includes(record) ? 'color-success' : 'text-danger'"
                                >A</code>
                            </td>
                            <td>
                                <code
                                        :class="expectedATypeRecords.includes(record) ? 'color-success' : 'text-danger'"
                                        v-text="record"
                                ></code>
                            </td>
                            <td>
                                <div class="flags-container">
                                    <div class="flag-container">
                                        <img src="/assets/img/us.svg" class="flag"/>
                                        <img src="/assets/img/loader.svg" class="flag-status" v-if="loadingUS"/>
                                        <img
                                                :src="(foundATypeRecords.includes(record) ? '/assets/img/check.svg' : '/assets/img/cross.svg')"
                                                class="flag-status"
                                                v-if="!loadingUS"
                                        />
                                    </div>
                                    <div class="flag-container">
                                        <img src="/assets/img/eu.svg" class="flag"/>
                                        <img src="/assets/img/loader.svg" class="flag-status" v-if="loadingEU"/>
                                        <img
                                                :src="(foundATypeRecords.includes(record) ? '/assets/img/check.svg' : '/assets/img/cross.svg')"
                                                class="flag-status"
                                                v-if="!loadingEU"
                                        />
                                    </div>
                                    <div class="flag-container">
                                        <img src="/assets/img/as.svg" class="flag"/>
                                        <img src="/assets/img/loader.svg" class="flag-status" v-if="loadingAS"/>
                                        <img
                                                :src="(foundATypeRecords.includes(record) ? '/assets/img/check.svg' : '/assets/img/cross.svg')"
                                                class="flag-status"
                                                v-if="!loadingAS"
                                        />
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
                    <div class="alert alert-success" v-if="aTypeRecordsOk">
            <span>
              <b>Awesome!</b> &nbsp; We were able to find the required A type records to connect your domain! 😄
              <p>
                You can now finish the connection process through the
                <a
                        style="text-decoration: underline"
                        href="https://console.firebase.google.com"
                        target="_blank"
                >Firebase Console</a>.
              </p>
            </span>
                    </div>
                    <div class="alert alert-danger" v-if="!aTypeRecordsOk">
            <span>
              <b>Whoops!</b> &nbsp; Your A type records configuration seems to be incorrect 😞
              <ul>
                <li>If you've modified these records recently, please wait a bit longer for propagation to take place (it may take up to 24 hours).</li>
                <li v-if="hasExtraneousATypeRecords">
                  <b>Your domain must have 2 and only 2 A type records</b> with the values of Firebase Servers IPs shown above. Please remove any extraneous record (visualized in red).
                </li>
                <li
                        v-if="hasLessATypeRecords"
                >Your domain doesn't have one or more of the required records added. Double-check that you have added them correctly.</li>
              </ul>
            </span>
                    </div>
                    <p class="firebase-amber" v-if="hasRecordsNotDiscoverableInAllRegions">
                        ⚠️ Looks like some of your
                        DNS records are still not discoverable by all DNS servers across the
                        globe. Firebase may not be able to find your records just yet, so you should wait a bit longer
                        for full propagation to take place.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import {config} from "../../../config";

    export default {
        data() {
            return {
                aTypeRecordsChecked: false,
                aTypeRecordsOk: false,
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
                // :: Is a sub-domain
                if (this.subDomain && this.subDomain !== "") {
                    if (this.providerInstructions.usesAtSymbol === null) {
                        return `${this.subDomain} or "${this.subDomain}.${this.apexDomain}"`;
                    }
                    return this.providerInstructions.usesAtSymbol
                        ? this.subDomain
                        : `${this.subDomain}.${this.apexDomain}`;
                }
                // :: Is not a sub-domain
                if (this.providerInstructions.usesAtSymbol === null) {
                    return `"@" or "${this.apexDomain}"`;
                }
                return this.providerInstructions.usesAtSymbol ? "@" : this.apexDomain;
            },
            // :: Whether or not the query threw extraneous A type records
            hasExtraneousATypeRecords() {
                return this.foundATypeRecords.filter(r => {
                    return !this.expectedATypeRecords.includes(r);
                }).length;
            },
            // :: Whether or not the domain has less A type records than recommended
            hasLessATypeRecords() {
                return (
                    this.foundATypeRecords.filter(r => {
                        return this.expectedATypeRecords.includes(r);
                    }).length < 2
                );
            },
            // :: Whether or not one or more records are not discoverable by all regions
            hasRecordsNotDiscoverableInAllRegions() {
                return (
                    !this.foundATypeRecordsUS.every(r =>
                        this.foundATypeRecordsEU.includes(r)
                    ) ||
                    !this.foundATypeRecordsUS.every(r =>
                        this.foundATypeRecordsAS.includes(r)
                    ) ||
                    !this.foundATypeRecordsEU.every(r =>
                        this.foundATypeRecordsAS.includes(r)
                    )
                );
            },
            ...mapState({
                providerInstructions: state => state.hosting.providerInstructions,
                apexDomain: state => state.hosting.apexDomain,
                subDomain: state => state.hosting.subDomain,
                expectedATypeRecords: state => state.hosting.expectedATypeRecords,
                foundATypeRecords: state => state.hosting.foundATypeRecords,
                foundATypeRecordsUS: state => state.hosting.foundATypeRecordsUS,
                foundATypeRecordsEU: state => state.hosting.foundATypeRecordsEU,
                foundATypeRecordsAS: state => state.hosting.foundATypeRecordsAS
            })
        },
        methods: {
            // :: Make a request to query the DNS records (region specific)
            queryDNS(config) {
                return new Promise((resolve, reject) => {
                    this[`loading${config.name}`] = true;
                    const payload = {
                        host: `${this.subDomain}${this.subDomain !== "" ? "." : ""}${
                            this.apexDomain
                            }`
                    };
                    return axios.post(config.uri, payload)
                        .then(({data}) => {
                            const records = data.data;
                            this.$store.commit("updateFoundATypeRecords", records.A || []);
                            this.$store.commit(
                                `setFoundATypeRecords${config.name}`,
                                records.A || []
                            );
                            this[`loading${config.name}`] = false;
                            this.aTypeRecordsChecked = true;
                            return resolve();
                        })
                        .catch(err => {
                            console.log(err);
                            this[`loading${config.name}`] = false;
                            return reject(err);
                        });
                });
            },
            checkATypeRecordsConnection() {
                // :: Go next if already verified as OK
                if (this.aTypeRecordsOk) {
                    return true;
                }
                this.$emit("loading");
                // :: Make a request to check the DNS records from each region
                let promises = [];
                config.dnsUrls.forEach(config => {
                    promises.push(this.queryDNS(config));
                });
                return Promise.all(promises)
                    .then(() => {
                        // :: All regions have been checked
                        this.$emit("finishedLoading");
                        this.aTypeRecordsOk =
                            this.foundATypeRecords.filter(r => {
                                return this.expectedATypeRecords.includes(r);
                            }).length === 2 && this.foundATypeRecords.length === 2;
                        // :: If everything turns out OK, hide the "next" button
                        if (this.aTypeRecordsOk) {
                            this.$emit("finished");
                        }
                        return false;
                    })
                    .catch(err => {
                        console.log(err);
                        this.$snack.danger({
                            text: `Whoops! ${err.message}. Please try again.`,
                            button: 'CLOSE'
                        });
                        this.$emit("finishedLoading");
                        return false;
                    });
            },
            reset() {
                this.aTypeRecordsChecked = false;
                this.aTypeRecordsOk = false;
            }
        }
    };
</script>
