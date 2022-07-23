let config = require('../configs/config');
import mongoose from "mongoose";

mongoose.Promise = global.Promise;

// let options = {
//     username: '',
//     password: '',
//     // useNewUrlParser: true,
//     // useUnifiedTopology: true,
//     // poolSize: 200
//     // reconnectTries: Number.MAX_VALUE,
//     // reconnectInterval: 1000,
// };

// if (globalConfig.MONGO_REPLICA_SET) {
//     options = {
//         ...options, ...{
//             replicaSet: {
//                 strategy: 'ping',
//                 rs_name: globalConfig.MONGO_REPLICA_SET,
//                 // reconnectTries: Number.MAX_VALUE,
//                 socketOptions: {
//                     keepAlive: 120
//                 }
//             }
//         }
//     };
// }
//
// options = { ...options, ...(globalConfig.MONGOOSE_CONFIG || {}) };
mongoose.connect(config.MONGO_URL);

module.exports = mongoose.connection;