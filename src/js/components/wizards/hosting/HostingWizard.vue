<template>
    <div class="row">
        <div class="w-100">
            <div class="card">
                <div class="card-header card-header-warning">
                    <h4 class="card-title">Connect Hosting</h4>
                    <p class="card-category">Follow the instructions below to connect you custom DNS with Firebase
                        Hosting</p>
                </div>
                <div class="card-body">
                    <form-wizard title="" subtitle="" color="#039BE5" error-color="#039BE5" step-size="sm" ref="wizard"
                                 @on-change="onStepChange">

                        <!-- Step 1 -->
                        <tab-content title="DNS Information" :before-change="beforeStepOne">
                            <step-one ref="stepOne" @loading="loading = true"
                                      @finishedLoading="loading = false"></step-one>
                        </tab-content>
                        <!-- Step 2 -->
                        <tab-content title="DNS Verification" :before-change="beforeStepTwo">
                            <step-two ref="stepTwo" @loading="loading = true"
                                      @finishedLoading="loading = false"></step-two>
                        </tab-content>
                        <!-- Step 3 -->
                        <tab-content title="DNS Connection" :before-change="beforeStepThree">
                            <step-three ref="stepThree" @loading="loading = true" @finished="finished = true"
                                        @finishedLoading="loading = false"></step-three>
                        </tab-content>

                        <!-- Footer Buttons -->
                        <template slot="footer" slot-scope="props">
                            <div class="wizard-footer-left">
                                <button type="button" class="btn btn-blue pull-left"
                                        v-if="props.activeTabIndex > 0 && !props.isLastStep && !loading"
                                        @click="props.prevTab()">
                                    <i class="material-icons" style="margin-right: -85px"> arrow_backwards</i> Back
                                </button>
                            </div>
                            <div class="wizard-footer-right" v-show="!finished">
                                <button type="button" class="btn btn-blue pull-right" @click="props.nextTab()"
                                        :disabled="loading">
                                    <div v-if="loading">
                                        Checking... <i class="fa fa-spinner animated fa-spin"></i>
                                    </div>
                                    <div v-else>
                                        Next <i class="material-icons">arrow_forward</i>
                                    </div>
                                </button>
                            </div>
                        </template>
                    </form-wizard>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {FormWizard, TabContent} from 'vue-form-wizard'
    import StepOne from './StepOne';
    import StepTwo from './StepTwo';
    import StepThree from './StepThree';

    const parseDomain = require("parse-domain");
    export default {
        name: 'HostingWizard',
        data() {
            return {
                loading: false,
                finished: false
            }
        },
        components: {
            FormWizard,
            TabContent,
            StepOne,
            StepTwo,
            StepThree
        },
        methods: {
            // :: Validate Step 1
            beforeStepOne() {
                return this.$refs.stepOne.getVerificationRecord();
            },
            // :: Validate Step 2
            beforeStepTwo() {
                return this.$refs.stepTwo.checkTxtVerification();
            },
            // :: Validate Step 3
            beforeStepThree() {
                return this.$refs.stepThree.checkATypeRecordsConnection();
            },
            // :: Reset state when previous steps have been selected
            onStepChange(prevIndex, nextIndex) {
                if (nextIndex < prevIndex) {
                    let currentIndex = this.$refs.wizard.activeTabIndex;
                    // :: Reset A records check flags
                    if (currentIndex <= 2) {
                        this.$refs.stepThree.reset();
                        this.$store.commit('setFoundATypeRecords', []);
                    }
                    // :: Reset TXT records check flags
                    if (currentIndex <= 1) {
                        this.$refs.stepTwo.reset();
                        this.$store.commit('setFoundTxtRecords', []);
                        this.$store.commit(`setFoundTxtRecordsUS`, []);
                        this.$store.commit(`setFoundTxtRecordsEU`, []);
                        this.$store.commit(`setFoundTxtRecordsAS`, []);
                        this.$store.commit(`setExpectedTxtVerificationRecord`, '');
                    }
                }

            }
        }
    };
</script>

<style scoped>
    th {
        color: #FFCA28
    }

    code {
        color: #ECEFF1
    }

    .form-control {
        background-image: linear-gradient(to top, #ECEFF1 2px, rgba(156, 39, 176, 0) 2px), linear-gradient(to top, rgba(180, 180, 180, 0.1) 1px, rgba(180, 180, 180, 0) 1px);
    }
</style>
