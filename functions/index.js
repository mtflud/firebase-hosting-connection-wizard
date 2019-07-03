const functions = require('firebase-functions');
const whois = require('node-xwhois');
const cors = require('cors');
const cors2 = require('cors')({origin: '*'});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const whitelist = ['https://eos-wizard.web.app', 'https://eos-wizard.firebaseapp.com'];
const corsOptions = {
    origin: (origin, callback) => {
        if (!whitelist.includes(origin)) {
            return callback(new Error('Not allowed by CORS'));
        }
        return callback(null, true);
    }
};
const corsHandler = cors(corsOptions);

const queryDns = (req, res) => {
    return corsHandler(req, res, () => {
        const host = req.body.host;
        return whois.nslookup(host).then(info => {
            return res.send({
                status: 'OK',
                message: 'Queried successfully!',
                data: info
            });
        }).catch(err => {
            console.log(err);
            return res.status(503).send({
                status: 'ERROR',
                message: 'Whoops! Something went wrong: ' + err.message,
                data: null
            });
        });
    });
};

// :: One function per region
exports.queryDnsUS1 = functions.region('us-central1').https.onRequest(queryDns);
exports.queryDnsEU1 = functions.region('europe-west1').https.onRequest(queryDns);
exports.queryDnsAS1 = functions.region('asia-east2').https.onRequest(queryDns);