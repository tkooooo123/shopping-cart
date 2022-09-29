const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
    }
})

module.exports = {
    orderConfirmMail: (order) => {
        const mailOptions = {
            from: process.env.EMAIL_ACCOUNT,
            to: process.env.TEST_ACCOUNT,
            subject: '訂單通知函',
            html: `<html>
            <head>
              <style>
              td { padding: 5px; }
              .title { background-color: #dcffff; }
              </style>
            </head>
            <body>
              <div>
                <p>親愛的顧客，您好:</p>
                <p>您下了一筆訂單，以下為您的訂單資訊 :</p>
                <table border="3">
                  <tbody>
                  <tr>
                    <td class="title">訂單號碼</td>
                    <td>${order.id}</td>
                  </tr>
                  <tr>
                    <td class="title">訂單金額</td>
                    <td>${order.amount}</td>
                  </tr>
                  <tr>
                    <td class="title">姓名</td>
                    <td>${order.name}</td>
                  </tr>
                  <tr>
                    <td class="title">寄送地址</td>
                    <td>${order.address}</td>
                  </tr>
                  <tr>
                    <td class="title">電話</td>
                    <td>${order.phone}</td>
                  </tr>
                  <tr>
                    <td class="title">訂單狀態</td>
                    <td>${order.payment_status}</td>
                  </tr>
                  <tr>
                    <td class="title">付款連結</td>
                    <td> 
                      <a href="${process.env.URL}/orders">${process.env.URL}/orders</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="title">信用卡號</td>
                    <td>4000-2211-1111</td>
                  </tr>
                </tbody>
                </table>
               
              </div>
            </body>
          </html>`,
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error)
            } else {
                console.log('Email sent:' + info.response)
            }
        }) 
    },
    paymentConfirmMail: (order) => {
        const mailOptions = {
            from: process.env.EMAIL_ACCOUNT,
            to: process.env.TEST_ACCOUNT,
            subject: '付款通知函',
            html: `<html>
            <head>
              <style>
              td { padding: 5px; }
              .title { background-color: #dcffff; }
              </style>
            </head>
            <body>
              <div>
                <p>親愛的顧客，您好:</p>
                <p>您下了一筆訂單，以下為您的訂單資訊 :</p>
                <table border="3">
                  <tbody>
                  <tr>
                    <td class="title">訂單號碼</td>
                    <td>${order.id}</td>
                  </tr>
                  <tr>
                    <td class="title">訂單金額</td>
                    <td>${order.amount}</td>
                  </tr>
                  <tr>
                    <td class="title">姓名</td>
                    <td>${order.name}</td>
                  </tr>
                  <tr>
                    <td class="title">寄送地址</td>
                    <td>${order.address}</td>
                  </tr>
                  <tr>
                    <td class="title">電話</td>
                    <td>${order.phone}</td>
                  </tr>
                  <tr>
                    <td class="title">訂單狀態</td>
                    <td>${order.payment_status}</td>
                  </tr>
                  <tr>
                    <td class="title">付款連結</td>
                    <td> 
                      <a href="${process.env.URL}/orders">${process.env.URL}/orders</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="title">信用卡號</td>
                    <td>4000-2211-1111</td>
                  </tr>
                </tbody>
                </table>
               
              </div>
            </body>
          </html>`,
        }
        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error)
            } else {
                console.log('Email sent:' + info.response)
            }
        }) 

    }
}