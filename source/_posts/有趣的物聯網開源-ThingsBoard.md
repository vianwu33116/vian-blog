---
title: 有趣的物聯網開源-ThingsBoard
toc: true
date: 2024-08-05 23:36:49
tags:
- Open Source
- ThingsBoard
- IoT
categories: 
- Open Source
---

寫這篇文章的目的很純粹就是喜歡這個專案想介紹。這個專案有很多可以學習的地方。例如: 物聯網知識、系統架構、資料夾結構等。除此之外，官方提供的文件相當完整，而且社群中有許多熱心積極的開發者會回覆 Issue。個人認為是一個很值得學習的開源專案楷模。這個專案源自於一間烏克蘭公司，是一個開源的物聯網平台。

<!-- more -->

## 環境介紹
ThingsBoard 平台主要有兩種版本，一個是社群版 (Comunity Edition - CE)，另一個是專業版 (Professional Edition - PE)。有開源的版本是 CE 版本，所以這篇文章主要會介紹 CE。環境的架設支持多種環境: Windows、Ubuntu、Mac 等多種作業系統，也能使用 Docker 來建置。

這個專案是前後端分離，前端語言是 TypeScript 使用的框架是 Angular; 後端語言則是 Java 採用的框架是 Spring Boot。所以需要先安裝 Java 的 JDK (官方建議版本: Java 17)，而 Angular 版本原本是使用 14，但官方在這兩年內升級到 15 了，在注意一下版本問題。

資料庫的部分，關聯和非關聯 DB (database) 都支持，官方建議當數據流量不超過每秒 5000 msg 時可以使用 PostgreSQL。訊息佇列 (queue service) 的部分可以參考[官方連結](https://thingsboard.io/docs/user-guide/install/docker-windows/)選擇適合自己的服務。順帶一提，在物聯網的世界，如果設備常常每五分鐘就丟一筆資料，當設備數量一多，資料量其實也滿可觀的。

環境架設好，若手邊有硬體設備能支援資料的拋轉，可以使用官方提供的 API (支援 MQTT, HTTP, LwM2M, CoAP 等多種方式) 或是 IoT gateway 的方法來串接，串接文件可以參考 [ThingsBoard - Connect your device](https://thingsboard.io/docs/guides/#AnchorIDConnectYourDevice)。

*備註: 官方也有提供線上的平台可以免費試用，所以也不一定要自己架環境 ([ThingsBoard Github](https://github.com/thingsboard/thingsboard) 和 [TB CE 平台連結](https://demo.thingsboard.io/signup))。

## 平台特點
接下來想簡單介紹一下 ThingsBoard 這項專案的幾個特色。以下內容會以 TB 來簡稱 ThingsBoard 

### Data
在 TB 平台上，物聯網設備拋上來的資料可以選擇傳到不同的資料類別做儲存，分別是 `Attribute` 和 `Telemetry`。
* Attribute data
    * 不會有歷史資料: 新進的資料會取代現有儲存資料 (最後有的資料筆數就只有一筆)
* Telemetry data
    * 有歷史資料: 拋進來的每一筆資料都會被儲存 (在資料空間許可範圍內的所有上拋資料數值都會被保留)

這兩種資料儲存格式的選擇主要是看後續要應用的情境來決定。下面分別舉例兩種不同的情境對應這兩種資料形式的選擇。

以溫度感測器的溫度資料來舉例，後續平台的應用可能會是需要觀察溫度趨勢，比對溫度變化，所以就需要保留歷史資料來比較，故針對這個目的，在這邊的溫度參數就會放到 `Telemetry` 類別來儲存。

溫度感測器的設備版本資訊並不需要與歷史資料做比對，這項資訊的目的是為了記錄目前設備的版本號，所以留存以前版本的資料只是多增加記憶體空間，並沒有實質上的意義。這筆資料就會選擇用 `Attribute` 的方式。

*備註: 其實 TB 的 attribute 資料類別又可以再細分成三類: Server-side attributes, Shared attributes 和 Client-side attributes 感興趣的話歡迎繼續往下鑽XD

### Rule Engine
Rule Engine 可說是 ThingsBoard 強大又獨特的特點， Rule Chain 由 Message (訊息), Rule Node (節點) 和 Rule Chain (鏈結) 這三個元素所構成。Message 是指穿梭在各節點中的`訊息`，也就是所謂的資料; 而`節點`是放置要執行的任務，可能是過濾資料或是做資料的加總等 function。`鏈結`就是一條連接線，可以連接節點之間的關聯性。我們可以把"資料"想成是坐在火車上的乘客`, "鏈結" 當作是鐵軌，節點看成是車站，到達車站可能會有乘客上車或下車，站長會看自己的任務是否完成，任務完成後便會開往下一站。

下面稍微列舉幾個 Rule Engine 的功能:
* "Low Code"
    * GUI 的介面方式，可以直接拖拉節點至工作流中，節點本身已經將主要功能寫好包好了，只需要補上空出的條件就完成了
    * 節點中有提供 Debug mode 會打印進來和出去的訊息，也會告訴你執行的結果是 fail 還是 success (debug mode 預設是關閉，在開發時記得開啟)
* 清楚的工作流
    * 透過節點、鏈結的圖示呈現，加上節點上顯示的標題文字，用流程圖的方式可以很快的掌握整個流程 (流程圖片)
* 能對進來的資料作先行處理後再儲存到資料庫
    * 可以加入過濾節點來篩出想要的資料 (ex: 將超過上限的資料過濾掉)
* 將資料串接到第三方系統或觸發相關事件
    * 在串接節點中輸入第三方服務的認證資訊，就能輕鬆的將資料丟到第三方資源如 AWS sns, Kafka 等第三方服務
    * 可以觸發告警並寄送告警通知或串接 rest API 的方式來達到想要的事件結果

### Dashboard & Widgets
這幾年很流行用儀表板 (dashboard) 的方式來呈現數值結果的應用，TB 就是以儀表板的方式來呈現的系統平台，從數據的接收到畫面拖拉的呈現，一條龍的處理都可以在平台上做到。畫面有提供預設的基本元件，所以能很快地拖拉出一個儀表板介面 (類似於 powerBI 的拖拉頁面，其實在拖拉介面上似乎大家都大同小異)，比較困難的部分會是在選擇資料來源 (需要先了解一些專有名詞像是　`Entity`, `Asset`, `Device`, 和 `Alias`等所代表的意義，定義請見[官網](https://thingsboard.io/docs/user-guide/entities-and-relations/)，因為不是本文探討的重點，這邊不贅述)。

談到 dashboard 和 widget 的關係，widget 有點像前端元件 (component) 的概念, 而 dashboard 則是由一個個的 widget 所構成。Widget 可以被共用也可以被匯入和匯出，匯出的格式是 json (更進階的共用方式可以擅用客製 widget 中的 schema 設定去添加額外的設定值)。

由於 TB 已經將後端寫好，有 RBAC (Role-based access control) 的權限控管和支援硬體資料拋丟串接的 API (e.g. MQTT, HTTP, LwM2M, CoAP 或是 IoT gateway 等方式) 和後端串前端的 API，所以平台上面主要的工就會在畫面上的開發 (如果覺得原生的 widget 就很好用並且也滿足自己需求的話，那前端也不用開發了XD)。

想客製元件但又不想改動原始碼的情況下，TB 提供三種方式來二次開發 Widget:
* **系統原生的 HTML-Card widget**
* **Custom Widget**
* **tb-extensions**

| 方式 | HTML-Card widget | Custom Widget | tb-extensions |
| -------- | -------- | -------- | -------- |
| 使用方式 | 直接在 dashboard 的編輯介面上加入 | 在主選單中的 Widgets library 頁面中做添加 | 需先在編輯器中下載 [tb-extensions repository](https://github.com/thingsboard/thingsboard-extensions) 作開發並打包成 Angular component 後再匯入平台，後續透過 import 的方式加入到 custom widget 中做使用 |
| Angular | 不支援，只能寫入純 HTML | 支援 | 支援 |
| 要額外安裝編輯器 | 不用，在平台上直接編寫 | 不用，在平台上直接編寫 | 需要 |
| 版控方式 | 只能透過平台備份到 Github | 只能透過平台備份到 Github | 任何版控工具都可以 |

*備註: tb-extensions 的操作雖然比較繁瑣，但自由度最高，開發和版控方式較符合軟體的開發流程。如果對 TB 的架構很熟悉而且擅長 Angular 和 TypeScript 的開發者當然也可以直接修改 source code (ui-ngx 前端包)。

### Version Control
由於原生的 HTML-Card widget 和 Custom widget 的客製開發是直接在平台的編輯頁面上執行，所以會包成一個 json 的內容儲存在系統中，但這種方式無法執行版本控制 (Version Control)，因此，先前原本不支援版控和備分的 TB 平台，在聽見了大家的心聲後，後續的版本都加入了這項功能，並且 TB 也很大方的公開，所以不只商用版本有，通用版本也能使用。

使用方式: 在 TB 平台介面上操作，選擇主選單的設定然後再點選 `Repository settings` 就會進到儲存庫的設定頁面，輸入要推上的遠端倉庫連結和權限相關資訊 (access token and username) 就完成基本設定了，後續就剩把想推送的項目填上 commit 然後一鍵按下送出 (細節步驟可以參考 [Version Control](https://thingsboard.io/docs/user-guide/version-control/))。雖然操作方式相當簡單，但缺點就是很難自動化，而且推到 Github 上的是轉換過的 json 格式，所以也不是純 source code。

## 總結
有興趣的人可以進一步去咀嚼這項專案，這篇文章主要是一個 overview 的介紹。如果有想深入了解的 TB 主題或是功能細節可以在下方留言，可能有機會變成下一篇文章探討的內容。其實開源有很多值得學習的內容，學習完可以推廣或貢獻專案，來回饋自己的學習。最重要的其實就是"發現"，發現可以學習的專案和內容。

## Reference
[ThingsBoard Doc](https://thingsboard.io/docs/)
[Architecture](https://thingsboard.io/docs/reference/)
[ThingsBoard Github](https://github.com/thingsboard/thingsboard)
[ThingsBoard Extensions](https://thingsboard.io/docs/user-guide/contribution/widgets-development/#thingsboard-extensions)
[ThingsBoard CE vs PE security features comparison](https://thingsboard.io/docs/pe/user-guide/rbac/#thingsboard-ce-vs-pe-security-features-comparison)
[Version Control](https://thingsboard.io/docs/user-guide/version-control/)
