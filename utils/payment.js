const cryptoJS = require('crypto-js')

const URL = process.env.URL
const MerchantID = process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
const PayGateWay = 'https://ccore.newebpay.com/MPG/mpg_gateway'

function getData(amount, desc, email) {
    const data = {
        MerchantID: MerchantID,
        TimeStamp: Date.now(),
        Version: 2.0,
        RespondType: 'JSON',
        MerchantOrderNo: Date.now(),
        Amt: amount,
        ItemDesc: desc,
        NotifyURL: URL + '/newebpay/callback?from=NotifyURL',
        ReturnURL: URL + '/newebpay/callback?from=ReturnURL',
        ClientBackURL: '',
        LoginType: '0',
        Email: email,
    }
    return {
        MerchantID: MerchantID,
        TradeInfo: tradeInfoAES(data),
        TradeSha: tradeInfoSHA(data),
        version: 2.0,
        PayGateWay: PayGateWay,
        MerchantOrderNo: data.MerchantOrderNo

    }
}

//transfer into string
function genDataChain(data) {
    let results = []
    for (const obj of Object.entries(data)) {
        results.push(`${obj[0]}=${obj[1]}`)
    }
    return results.join('&')
}

//encrypt
function tradeInfoAES(data) {
    const dataChain = genDataChain(data)
    const key = cryptoJS.enc.Utf8.parse(HashKey)
    const iv = cryptoJS.enc.Utf8.parse(HashIV)
    const tradeInfoAES = cryptoJS.AES.encrypt(dataChain, key, { iv })

    return tradeInfoAES.ciphertext.toString()
}

// hash
function tradeInfoSHA(data) {
    const TradeInfoAES = tradeInfoAES(data)
    const TradeInfoSHA = cryptoJS.SHA256(`HashKey=${HashKey}&${TradeInfoAES}&HashIV=${HashIV}`).toString().toUpperCase()
    return TradeInfoSHA
}

//decrypt
function decryptedData(data) {
    const key = cryptoJS.enc.Utf8.parse(HashKey)
    const iv = cryptoJS.enc.Utf8.parse(HashIV)
    const encryptedHexStr = cryptoJS.enc.Hex.parse(data)
    const encryptedBase64Str = cryptoJS.enc.Base64.stringify(encryptedHexStr)
    const decryptedData = cryptoJS.AES.decrypt(encryptedBase64Str, key, {iv})
    return decryptedData.toString(cryptoJS.enc.Utf8)
}

module.exports = {
    getData,
    decryptedData
}