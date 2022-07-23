let createError = require('http-errors');
import express, {Application, Request, Response, NextFunction} from 'express'
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const rfs = require('rotating-file-stream')
const winston = require('./configs/winston')
import Kafka from 'node-rdkafka';
import {MsbConstant} from "./modules/msb/constants/msb.constant";
import {MsbConfig} from "./modules/msb/config/msb.config";
import moment from "moment";
const sha256 = require('crypto-js/sha256')
import axios from "axios"
const mongodb = require('./connections/mongo');

let app: Application = express();

const REQUEST_TOPIC = 'request'
const IPN_TOPIC = 'ipn'

const integrateConsumer = new Kafka.KafkaConsumer({
  'group.id': 'kafka',
  'metadata.broker.list': 'localhost:9092',
}, {})

integrateConsumer.connect();

integrateConsumer
  .on('ready', () => {
    console.log('Integrate ready..')
    integrateConsumer.subscribe([REQUEST_TOPIC])
    integrateConsumer.consume()
  })
  .on('data', (data: any) => {
    console.log(`Received message from connector:`)
    let messageData = JSON.parse(data.value)

    let headerConfig = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }
    let url = MsbConfig.apiUrl + MsbConstant.linkAccountAction
    let currentTime = moment().format('yyMMDDhhmmss')
    let transDate = currentTime;
    let tranIdPrefix = MsbConfig.transactionIdPrefix;
    let transId = `${tranIdPrefix}${currentTime}`;
    let walletType = MsbConstant.walletTypeAccount;
    let merchantName = MsbConfig.merchantName
    let mId = MsbConfig.mId
    let tId = MsbConfig.tId
    let accessCode = MsbConfig.accessCode
    let walletInfo = {
      accountNumber: messageData.meta_data.card_number,
      accountName: messageData.meta_data.card_name,
      regNumber: messageData.meta_data.cccd,
      phoneNumberWallet: messageData.phone,
    }
    let secureHash = sha256(`${accessCode}${transDate}${transId}${walletInfo.accountNumber}${walletInfo.accountName}${walletInfo.regNumber}${walletInfo.phoneNumberWallet}`).toString()

    let requestBankData = {
      transDate: transDate,
      transId: transId,
      walletType: walletType,
      merchantName: merchantName,
      mId: mId,
      tId: tId,
      walletInfo: walletInfo,
      secureHash: secureHash
    }
    axios.post(url, JSON.stringify(requestBankData), headerConfig)
        .then((response: any) => {
          let message = JSON.stringify(response.data)
          const integrateProducer = Kafka.Producer.createWriteStream({
            'metadata.broker.list': 'localhost:9092'
          }, {}, {
            topic: IPN_TOPIC
          })

          const success = integrateProducer.write(Buffer.from(message))
          if (success) {
            console.log(`Integrate send ipn to wallet: ${message}`);
          } else {
            console.log('Integrate send ipn to wallet fail');
          }
        })
        .catch((error: any) => {
          console.log(error)
        })
  })

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: path.join(__dirname, 'log')
})

app.use(logger('combined', { stream: accessLogStream }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongodb.once('open', (e: any) => {
  console.log("MONGODB IS CONNECTED");
});

mongodb.on('error', (err: any) => {
  console.error("MONGODB CONNECT ERROR");
});

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  winston.error('this winston error')
  winston.log({
    level: 'info',
    message: 'this is winston info',
  })
  res.json({
    result: 'integrate wallet bank with nodejs-express-typescript-mongodb'
  })
});

app.use(function(req: any, res: any, next: any) {
  next(createError(404));
});

app.use(function(err: any, req: any, res: any, next: any) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
