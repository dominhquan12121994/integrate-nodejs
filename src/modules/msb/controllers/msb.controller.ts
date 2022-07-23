const LogBankRequestModel = require('../../../models/logBankRequest.model')
const ObjectID = require('mongoose').Types.ObjectId
const axios = require('axios')
const moment = require('moment')
const sha256 = require('crypto-js/sha256')
import {MsbConstant} from '../constants/msb.constant'
import {MsbConfig} from '../config/msb.config'
import Kafka from 'node-rdkafka';

async function index(req: any, res: any) {
    try {
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
            accountNumber: '11001018956459',
            accountName: 'nguyen van test',
            regNumber: '038054002026',
            phoneNumberWallet: '0369555777',
        }
        let secureHash = sha256(`${accessCode}${transDate}${transId}${walletInfo.accountNumber}${walletInfo.accountName}${walletInfo.regNumber}${walletInfo.phoneNumberWallet}`).toString()

        let data = {
            transDate: transDate,
            transId: transId,
            walletType: walletType,
            merchantName: merchantName,
            mId: mId,
            tId: tId,
            walletInfo: walletInfo,
            secureHash: secureHash
        }
        console.log(data)
        let bankResponse = await axios.post(url, JSON.stringify(data), headerConfig)
            .then((response: any) => {
                console.log(response);
                return response.data
            })
            .catch((error: any) => {
                console.log(error)
            })

        res.json({
            bankResponse: bankResponse,
        })
    }
    catch (error) {
        console.log(error);
        res.json({
            error: error
        })
    }
}

async function store(req: any, res: any) {
    try {
        let storedLogBankRequest = await LogBankRequestModel.insertOne({
            _id: ObjectID(),
            requestId: req.body.requestId,
            bankCode: req.body.bankCode,
            amount: req.body.amount,
        }).then((result: any) => {
            return result
        })
        res.json({
            storedLogBankRequest: storedLogBankRequest
        })
    }
    catch (error) {
        res.json({
            error: error
        })
    }
}

async function link(req: any, res: any) {
    const REQUEST_TOPIC = 'request'
    try {
        let data = req.body
        let message = JSON.stringify(data)
        const integrateProducer = Kafka.Producer.createWriteStream({
            'metadata.broker.list': 'localhost:9092'
        }, {}, {
            topic: REQUEST_TOPIC
        })

        const success = integrateProducer.write(Buffer.from(message))
        if (success) {
            console.log(`Integrate send ipn to wallet: ${message}`);
        } else {
            console.log('Integrate send ipn to wallet fail');
        }
        res.json({
            status: 200,
            errorCode: 0,
            message: 'success',
            data: null,
        })
    }
    catch (error) {
        res.json({
            error: error
        })
    }
}

module.exports = {
    index: index,
    store: store,
    link: link,
}