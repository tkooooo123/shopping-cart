# Shopping-Cart
運用Express框架與MySQL資料庫實作購物平台，包含CRUD功能、資料庫建置、第三方API串接等，讓使用者在網站上可以完成一系列的購物流程
## 部署網址連結
```
https://lit-lowlands-54861.herokuapp.com/
```
## 使用者帳號
```
Admin
Email: root@example.com
Password: 12345678

User
Email: user1@example.com
Password: 12345678
```
## 藍新金流(測試API)
- 測試信用卡
```
卡號: 4000-2211-1111-1111
有效年月&卡片背面末三碼: 請任意填寫
```
## 功能

### 使用者

- 註冊&登入
1. 使用者可以設定信箱、密碼，以成功註冊帳號
2. 使用者可以透過註冊的帳號或是Facebook帳號進行登入

- 商品瀏覽
1. 使用者可以瀏覽所有商品
2. 使用者可以依類別瀏覽商品
3. 使用者可以輸入關鍵字搜尋商品
4. 使用者可以瀏覽商品內容，並新增至購物車

- 購物車
1. 使用者可以瀏覽購物車商品內容與總金額
2. 使用者可以增減購物車中商品的數量
3. 使用者可以刪除購物車中之商品

- 訂單
1. 使用者可以瀏覽自己的所有訂單
2. 使用者可以進行線上付款
3. 使用者可以取消訂單

### 管理者

1. 管理者可以瀏覽所有商品與類別
2. 管理者可以新增、編輯、刪除單一商品
3. 管理者可以新增、編輯、刪除單一類別
4. 管理者可以瀏覽所有訂單
5. 管理者可以編輯與取消單一訂單

## Schema ERD
![ERD](https://i.imgur.com/jhv4n9P.jpeg)

## 安裝流程
1. 開啟終端機，執行以下指令：
 `$ git clone https://github.com/tkooooo123/shopping-cart.git`
2. 進入專案資料夾:
 `$ cd shopping-cart`
3. 使用npm安裝套件
 `$ npm install`
4. 新增.env檔案，設定環境變數
```
PORT=3000
SESSION_SECRET=
URL=<ngrok_url>
MerchantID=<newebpay_merchant_id>
HashKey=<newebpay_hash_key>
HashIV =<newebpay_hash_iv>
EMAIL_ACCOUNT=<test_email_account>
EMAIL_PASSWORD=<test_email_password>
FACEBOOK_CLIENTID=<facebook_app_id>
FACEBOOK_CLIENTSECRET=<facebook_app_secret>
CALLBACKURL=http://localhost:3000/auth/facebook/callback
```

## 設定資料庫
1. 於config.json中設定資料庫密碼
```
{
    "development": {
    "username": "root",
    "password": "<your_mysql_workbench_password>",
    "database": "shopping_cart2",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```
2. 使用MySQL Workbench建立資料庫
```
drop database if exists shopping_cart2;
create database shopping_cart2;
```
3. 建立資料表
```
$ npx sequelize db:migrate
```
4. 新增種子資料
```
$ npx sequelize db:seed:all
```
5. 執行專案，輸入下列指令
```
$npm run dev
```
成功則顯示：
```
App is running on http://localhost:3000
```