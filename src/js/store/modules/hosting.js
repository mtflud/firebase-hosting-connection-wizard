// :: Initial State
const state = {
    hostName: '',
    provider: '',
    apexDomain: '',
    subDomain: '',
    expectedTxtVerificationRecord: '',
    providerList: [
        {
            name: 'Namecheap',
            value: 'namecheap'
        },
        {
            name: 'GoDaddy',
            value: 'godaddy'
        },
        {
            name: 'Google Domains',
            value: 'gdomains'
        },
        {
            name: 'BlueHost',
            value: 'bluehost'
        },
        {
            name: 'Other',
            value: 'other'
        }
    ],
    providerInstructions: {},
    foundTxtRecords: [],
    foundTxtRecordsUS: [],
    foundTxtRecordsEU: [],
    foundTxtRecordsAS: [],
    expectedATypeRecords: ['151.101.65.195', '151.101.1.195'],
    foundATypeRecords: [],
    foundATypeRecordsUS: [],
    foundATypeRecordsEU: [],
    foundATypeRecordsAS: [],
};

const mutations = {
    setHostName(state, payload) {
        state.hostName = payload;
    },
    setProvider(state, payload) {
        state.provider = payload;
    },
    setProviderInstructions(state, payload) {
        state.providerInstructions = payload;
    },
    setApexDomain(state, payload) {
        state.apexDomain = payload;
    },
    setSubDomain(state, payload) {
        state.subDomain = payload;
    },
    setExpectedTxtVerificationRecord(state, payload) {
        state.expectedTxtVerificationRecord = payload;
    },
    setFoundTxtRecords(state, payload) {
        state.foundTxtRecords = payload;
    },
    updateFoundTxtRecords(state, payload) {
        let merged = [...state.foundTxtRecords, ...payload];
        state.foundTxtRecords = [...new Set(merged)];
    },
    setFoundTxtRecordsUS(state, payload) {
        state.foundTxtRecordsUS = payload;
    },
    setFoundTxtRecordsEU(state, payload) {
        state.foundTxtRecordsEU = payload;
    },
    setFoundTxtRecordsAS(state, payload) {
        state.foundTxtRecordsAS = payload;
    },
    setFoundATypeRecords(state, payload) {
        state.foundATypeRecords = payload;
    },
    updateFoundATypeRecords(state, payload) {
        let merged = [...state.foundATypeRecords, ...payload];
        state.foundATypeRecords = [...new Set(merged)];
    },
    setFoundATypeRecordsUS(state, payload) {
        state.foundATypeRecordsUS = payload;
    },
    setFoundATypeRecordsEU(state, payload) {
        state.foundATypeRecordsEU = payload;
    },
    setFoundATypeRecordsAS(state, payload) {
        state.foundATypeRecordsAS = payload;
    },
};

export default {
    namespaced: false,
    state,
    mutations
};
