export const config = {
    dnsUrls: [
        {
            name: 'US',
            uri: 'https://us-central1-eos-wizard.cloudfunctions.net/queryDnsUS1',
            icon: '/assets/img/us.svg'
        },
        {
            name: 'EU',
            uri: 'https://europe-west1-eos-wizard.cloudfunctions.net/queryDnsEU1',
            icon: '/assets/img/eu.svg'
        },
        {
            name: 'AS',
            uri: 'https://asia-east2-eos-wizard.cloudfunctions.net/queryDnsAS1',
            icon: '/assets/img/as.svg'
        }
    ]
};
