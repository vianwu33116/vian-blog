---
title: 關於 timestamp 的大小事
toc: true
date: 2024-10-27 15:38:00
tags:
- timestamp
categories: Tools
---

時間戳記 (timestamp) 在軟體開發中是一個不可或缺的角色，在平常的數據處理和日常應用中都可以看到他的身影，例如: 系統日誌、部落格的建立和編輯時間，金融交易時間、物聯網數據同步等。舉例來說，在物聯網的世界中資料封包裏頭會包含 timestamp 的資料，因為物聯網設備實際拋出資料的時間點和系統平台實際接收到的時間點會有差異<!-- more -->，不同的原因可能是由於網路速度、連線中斷等多種因素導致，就算正常連線時也會存在傳輸過程的時間差。

<br/>

## 常見的時間格式
Unix Timestamp、ISO 8601、RFC 2822 為三種主要常見的時間格式，而他們各自有自己適合的使用場景。
### Unix Timestamp
* 自 1970 年 1 月 1 日以來累計的秒數，會跟著時間多一秒而加 1，目前 21 世代的秒數為 10 位數 (ex: `1730016018`)，但也因為是一連串的數字型式，比較難直接看出是幾年幾月幾號幾點，所以通常會需要對 Unix Timestamp 做格式上的轉換，下面段落會整理時間轉換方式
* Unix Timestamp 是目前軟體拿來當作時間統一的標準，因為他的數字只會隨時間增加而增加但並不會因為不同時區地點就有所不同，所以對於伺服器端和客戶端的時間對齊來說扮演了很重要的角色
* 常見情況就是將 Unix Timestamp 當作傳送的依據，然後到客戶端再轉成當地的時間格式
### ISO 8601
* 看到 **ISO** 就是指國際訂定的標準，也就是國際標準化組織的日期和時間表示方法，格式範例: `2024-10-27T17:32:00Z`
* 格式中的 `T` 和 `Z` 分別代表的意義: 
    * T: **time designator** 主要用途用來區隔日期和時間
    * Z: **zone designator** 代表使用的是英國倫敦格林威治標準時間 UTC (Coordinated Universal Time)，以本初子午線（0度經線）為準 (格林威治標準時間又叫 Greenwich Mean Time，縮寫為 GMT)
* 有些 API (Application Programming Interface) 會將要傳入的時間參數規定是 ISO 8601 格式，此格式不僅易讀也統一時區，所以不會造成服務上時間區段的誤會，使用 UTC 來確保資料一致性及避免時差問題
### RFC 3339
* 其實 RFC 3339 的格式與 ISO 8601 格式幾乎一樣，只差在一些微小的部分，例如: RFC 3339 可以接受空格的存在 **2024-10-27T16:07:54Z** 和 **2024-10-27 16:07:54Z** 兩種型式都接納所以在網上也滿多人討論如何區分兩者，但其實有 'T' 間隔日期和時間的格式是被 RFC 3339 和 ISO 8601 兩邊所接受，區不區分似乎顯得沒那麼重要了。 RFC 3339 主要就是從 ISO 8601 而來，把先前提出的 ISO 8601 標準化就出現了 RFC 3339，RFC 3339 的文件有去明確定義一些準則，詳細細節可以參考 [RFC 3339 釋出文件](https://www.rfc-editor.org/rfc/rfc3339)
### RFC 2822
* 主要格式為 `Sun, 27 Oct 2024 08:00:18 +0000`，也可以接受 **Sunday, 27-Oct-24 08:00:18 UTC**，較常見的型式會將星期作縮寫，而最後方的數字 **+0000** 用來表明時區，所以如果是台北時間就會是 **+0800** 的寫法
* RFC 2822 比較常出現在一些 Email 系統中

<div style="background: #eeeeee; padding: 12px;">補充: 有時會看到 2024-10-27T17:32:00.000Z 的寫法，這也是被 ISO 8601 所接受的格式，字串中最後方的 ".000" 是加入了秒數的小數位數部分</div>

<br/>

## 時間的換算
在時間格式中有提到 Unix Timestamp 為秒數的加總，會是一長串的數字，所以需要轉換成可讀的型式，以下介紹幾種 JavaScript 的換算方式，在開始講述方法之前，我想先介紹 `Date` 這個物件，因為 `Date` 這個物件在 JavaScript 中就是用來指向某一個時間點，根據 [MDN Web Docs](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Date) 文件的說明: <u>Date 物件是基於世界標準時間（UTC） 1970 年 1 月 1 日開始的**毫秒數值**來儲存時間</u>`。

注意上文說明中的粗體字!! 就是開發者容易混淆的地方，因為我也曾混亂過XD 
`Date 物件儲存的是毫秒不是秒數!`，如果直接將 Unix Timestamp 代入會出錯，因為 Unix Timestamp 是秒數單位，所以需要先將單位秒轉成毫秒，將原本 Unix Timestamp 的十位數轉為十三位數，再使用 Date 物件做計算。 `Date` 物件還有另一個要注意的地方就是會以本地時間為準，而本地時間以在執行 JavaScript 電腦上的時間當作依據。

<div style="background: #eeeeee; padding: 12px;">補充: 若需要以標準時區 UTC 來計算的情況，Date 也有提供 `Date.UTC()` 方法，使用的是 UTC 時區而不是當地時區，另外 `Date.UTC()` 回傳的是一個數值而不是 Date 物件。</div>

<br/>

### Unix Timestamp 轉成一般可讀時間
    * 方法 1 new Date()
      ```javascript
      const timestamp = 1730016018000; // 毫秒
      const date = new Date(1730016018000);
      console.log(date); // Sun Oct 27 2024 16:00:18 GMT+0800 (台北標準時間)
      // 透過 Date 建構子產出的時間會是本地時間
      ```
    * 方法 2 toLocaleString()
    ```javascript
    const timestamp = 1730016018000;
    const date = new Date(timestamp).toLocaleString();
    console.log(date); // 2024/10/27 下午4:00:18
    // 2024/10/27 下午4:00:18 是本地時間而非倫敦標準時間
    ```
    * 方法 3 custom function
    ```javascript
    const timestamp = 1730016018000;
    function transferToDate(timestamp) {
        var dd = new Date(timestamp);
        const year = dd.getYear() + 1900;
        const month = dd.getMonth() + 1;
        const day = dd.getDate();
        let hour = dd.getHours();
        let min = dd.getMinutes();
        let sec = dd.getSeconds();
        const date = year + '/' + month + '/' + day + ' ' +
            hour + ':' + min + ':' + sec;
        return date;
    }
    console.log(transferToDate(timestamp)); // 2024/10/27 16:0:18 (本地時間)
    ```
### Unix Timestamp 轉成 ISO-8601 格式
```javascript
const timestamp = 1730016018000;
const date = new Date(timestamp);
console.log(date.toISOString());
// 2024-10-27T08:00:18.000Z
```
### Unix Timestamp 轉成 RFC 2822 格式
```javascript
const timestamp = 1730016018000; 
const rfc2822Date = new Date(timestamp).toUTCString();
console.log(rfc2822Date);
// Sun, 27 Oct 2024 08:00:18 GMT
```
### 從可讀時間轉換回 Unix Timestamp
    * 方法 1 valueOf()
      ```javascript
        const timestamp = new Date('Oct 27, 2024 16:00:18').valueOf();
        console.log(timestamp);  // 1730016018000
      ```
    * 方法 2 getTime()
    ```javascript
        const timestamp = new Date('Oct 27, 2024 16:00:18').getTime();
        console.log(timestamp); // 1730016018000
    ```
    * 方法 3 Number()
    ```javascript
        const timestamp = Number(new Date('Oct 27, 2024 16:00:18'));
        console.log(timestamp); // 1730016018000
    ```
    * 方法 4 Date.parse()
    ```javascript
        const timestamp = Date.parse('Oct 27, 2024 16:00:18');
        console.log(timestamp); // 1730016018000
    ```

### 時區的轉換

<br/>

#### UTC 時區轉成本地時區
拿台北來說的話，台北比倫敦時間快八個小時，所以將 UTC 轉成台北時間需要 **+08:00**，以 ISO-8601 格式為例:
```javascript
const date = new Date('2024-10-27T08:00:18.000Z'); // 放入 ISO-8601 UTC 時間
console.log(date); // Sun Oct 27 2024 16:00:18 GMT+0800 (台北標準時間)
console.log(date.toLocaleString()); // 2024/10/27 下午4:00:18
```
從上方程式碼可以看出，UTC 時間經過 `new Date()` 的轉換已經是本地時間了， 再經過 Date 物件方法中的 `toLocaleString()` 轉為符合<u>**當地時間書寫的排序方式**</u>。

<br/>

`toLocaleString()` 也能加入指定時區做轉換:
```javascript
const date = new Date('2024-10-27T08:00:18.000Z');
console.log(date.toLocaleString('en-GB', { timeZone: 'UTC' }));
// output: "27/10/2024, 08:00:18"
console.log(date.toLocaleString('ko-KR', { timeZone: 'UTC' }));
// output: "2024. 10. 27. 오전 8:00:18"
console.log(date.toLocaleString('ar-EG', { timeZone: 'UTC' }));
// output: "٢٧‏/١٠‏/٢٠٢٤ ٨:٠٠:١٨ ص"
```

<br/>

Date 物件方法中除了 **toLocaleString()** 還有其他方法像是只單純取出日期 **toLocaleDateString** 或是只取時間 **toLocaleTimeString** 的方法 (更多方法可以查看[官方文件](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString))

    * toLocaleDateString
    ```javascript
    const dateObj = new Date('2024-10-27T08:00:18.000Z');
    const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    };
    console.log(dateObj.toLocaleDateString('zh-TW', options)); 
    // output: "2024年10月27日 星期日"
    console.log(dateObj.toLocaleDateString('zh-TW')); 
    // output: "2024/10/27"
    ```
    * toLocaleTimeString
    ```javascript
    const dateObj = new Date('2024-10-27T08:00:18.000Z');
    console.log(dateObj.toLocaleTimeString('en-US'));
    // Expected output: "4:00:18 PM"
    console.log(dateObj.toLocaleTimeString('it-IT'));
    // Expected output: "16:00:18"
    ```

<br/><br/>

#### 本地時區轉成 UTC 時區
如果是 Unix Timestamp 就將其轉成毫秒放入 new Date() 中，再使用 toLocaleString() 指定倫敦時區。
如果是可讀時間就將其先轉成 timestamp (17300...) ，然後再接續上述方法做轉換
這邊可以試著自己做做看，或者是有其他種寫法也歡迎留言分享喔。

```javascript
const timestamp = new Date('Oct 27, 2024 16:00:18').valueOf();
const date = new Date(timestamp);
console.log(date.toLocaleString('en-GB', { timeZone: 'UTC' }));
// output: "27/10/2024, 08:00:18"
```

<br/>

## 時間處理套件
除了時間格式的轉換、時區切換，還有很多需要對時間做額外的計算和處理的事情，像是旅遊平台計算時間天數差異，或是系統排程在設定開始和結束時間時要檢查結束時間大於開始時間的應用等，所以接下來要介紹幾個好用的套件，當然如果不想依賴套件，也可以選擇自己寫邏輯判斷，體會程式的美好和思考的藝術。如果礙於開發時程上的壓力，那就利用套件工具來節省一些開發時間吧。由於本身是系統網頁開發為主，所以以下介紹的套件都以 JavaScript 或 TypeScript 語言來開發:

### [Luxon](https://moment.github.io/luxon/#/)
Luxon 專案的創始者原本也是曾參與 Moment.js 維護的成員之一，因為覺得 Moment.js 還有可以改善的空間，加上有許多新點子想執行，但不適合直接從程式原碼做大更動，於是創建了一個新的專案，Luxon 便因此誕生。推薦原因:
* 說明文件整理的相當清楚、整齊
* 開發者有相當多在時間套件的處理和管理經驗
* 有持續在維護和進版

### [Day.js](https://day.js.org/)
Day.js 主打的就是 Moment.js 的極簡替代品，主張輕量，並使用類似於 Moment.js 的 API 方式來設計，所以對於原本習慣使用 Moment.js 的開發者來說是很好上手的一個選擇。推薦原因:
* 對於不喜歡肥大套件的人來說有優勢
* 說明文件支援多個語言版本
* 有持續在維護和進版

### [date-fns](https://date-fns.org/)
date-fns 是三個套件中唯一使用 TypeScript 撰寫的工具，主張提供很全面性但又容易使用的工具集，可以在瀏覽器和 Node.js 中操作 JavaScript 日期。推薦原因:
* 完整使用 TypeScript 撰寫的工具
* 使用原生 Date 類型且因應安全性不會擴展核心物件
* 有持續在維護和進版

<div style="background: #eeeeee; padding: 12px;">補充: Moment.js 是 JavaScript 開發者中較為熟知的時間處理套件，但由於此專案已經沒有在維護了，所以在這邊就不建議大家使用了。Moment.js 也很大方地在官方網站推薦其他好用的時間處理套件，並公告不再有重大更改和新版本的發布。</div>

<br/>

## 小結
時間的處理看似簡單容易，但其實也存在著許多小細節，相信大部分的軟體開發者也都會很常使用、處理這項資訊。之所以有時間格式統一的定義就是為了避免因時區的差異而有所混淆。文章開頭就提到時間是軟體開發中不可或缺的角色，因為在不同的軟體應用中，都會需要將時間當成搜尋的依據，如數據庫中的時間區段查詢、聊天室訊息的傳送時間和股票交易時間等。時間也能影響到資安，像是時間的篡改或規避會遭成一些無法預料的事情，甚至有可能嚴重到服務停擺，因此有些開發者在處理 API 的時區問題需要去思考如何在全球服務中處理好用戶的本地時間又不會發生本地時間被異動的情況。

<br/>

<div style="background: #eeeeee; padding: 12px;">
如果有發現任何錯誤，歡迎留言指正，謝謝!
</div>

<br/>

## Reference
[The Current Epoch Unix Timestamp](https://www.unixtimestamp.com/)
[ISO 8601](https://wildwindjen.github.io/blog/2013/09/14/iso-8601/)
[RFC 3339](https://www.rfc-editor.org/rfc/rfc3339)
[RFC 2822](https://www.ietf.org/rfc/rfc2822.txt)
[Systemwide RFC-3339 Dateformat](https://wiki.gentoo.org/wiki/Systemwide_RFC-3339_Dateformat)
[Date MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Date)
[Why does Luxon exist?](https://moment.github.io/luxon/#/why)
[Why Day.js?](https://day.js.org/)
[Why date-fns?](https://date-fns.org/)
[Moment.js](https://momentjs.com/docs/#/-project-status/future/)