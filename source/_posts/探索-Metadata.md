---
title: 探索 Metadata
toc: true
date: 2025-02-26 05:34:34
tags: metadata
categories: Software
---

起初會想探索這個主題主要是由於工作需求需要針對平台的應用定義出要使用的 metadata，在探索的過程中，發現這個主題蠻有趣的，也在探索的過程中，意識到 "Data is money" 這句話並不假，以及資料有其重要性和實踐性。

<!-- more -->

<br/>

## What is metadata?
在深入之前，我們需要了解什麼是 metadata。metadata 最早是在 1970 年代左右被提出。”meta” + “data” 就是字面上的意思: **有關資料的資料**，舉書本為例子，有關這本書的資料可能會有書名、作者、出版日期、出版社等資訊，這些資訊就是<u>與書有關的資料</u>，也可以將這些資訊稱為 metadata。

Metadate 的初始目的都是希望能將資料做一個好的管理，並且能讓使用者更容易找到所需要的資訊。雖然資訊需要能讓使用者快速查找或分類，但也不能讓使用者自己隨意定義元資料，因為不同人設計出的原資料結構一定不同，或是彼此的名稱差異太大，就算設計好了 metadata，但反而覺得更加紊亂，因為你有你的定義，而我又有我的定義。這時候就需要一些指引標準，透過標準化的方法來描述網路資源，避免認知上的差異。說到標準就得帶到 **Dublin Core**。

<br/>

## Dublin Core
Dublin Core 在 1995 年被提出，是用來描述數位資源的簡單 metadata 標準，主張以 15 個簡單元素 (題名、主要作者、主題、描述、類型、型式、出版者、來源、語言、其他作者、日期、關聯性、識別碼、著作權、時空範圍) 來描述網路基礎文件的方式。這 15 個元素並沒有限制排列順序，甚至每一個元素是可以選擇的，也就是非必要。Dublin Core 的目的是想發展能夠跨領域探索資源的 metadata 標準，希望能促進特定領域或社群彼此之間的 metadata 能夠互通的架構。

<br/>

## Metadata Stages
DCMI (Dublin Core Metadata Initiative) 將 metadata 的演進劃分為三個主要階段: 
metadata 1.0 → metadata 2.0 → metadata 3.0

| 階段 | Metadata 1.0  | Metadata 2.0 | Metadata 3.0 |
| -------- | -------- | -------- | -------- |
| 資料紀錄位置 | 實體媒體 | 數位化 | 語意網 |
| 不同階段出現的技術 | 卡片目錄、實體泥板 | 關聯式資料庫、線上目錄和 XML | 鏈結的開放資料、知識圖譜 |
| 特點 | 無網路的情況 | 封閉的 IT 系統 & machine-readable data | 開放網路 & machine-understandable data |

不論是哪一個階段，metadate 的目的不外乎都是希望能方便管理和檢索資料。
看到 metadata 的演變階段，讓我不禁想到 Web 的發展史，從 Web 1.0 (單向接受資訊的網站) 到 Web 2.0 (雙向互動的社群網站如 FB、IG) 再到 Web 3.0 (基於區塊鍊的去中心化概念) 的時代。其實隨著科技技術的進步， Web 生態的改變，也會有需求上的改變進而伴隨著 metadata 的紀錄、存放方式有所變化。

<br/>

## Metadata Types
常見的 metadata 類型有六種: 描述型、結構型、管理型、保存型、技術型、使用型。

| 種類 | 意義 | 例子 |
| -------- | -------- | -------- |
| 描述型     | 用來描述或識別的資訊   | 標題名稱、關鍵字、識別碼 |
| 結構型     | 提供資源內部結構的資訊     | 目次、章節   |
| 管理型     | 管理資源的相關資訊     | 擁有者、授權限制 |
| 保存型     | 資源的實體情況記錄     | 資料搬遷紀錄     |
| 技術型     | 數位化資訊或是硬體、軟體紀錄 | 壓縮率、檔案格式  |
| 使用型     | 資料被使用的相關紀錄     |  展覽紀錄、借閱次數    |

不管是定義哪一種類型的 metadata，在定義 metadata 的過程中需要注意幾個重點: 清晰、完整、標準化、精簡。確保 metadata 的資訊清楚、容易了解，以及格式架構須有一定的標準，確保資訊的完整度但並非過於冗長或加入不必要的資訊。

<br/>

## What metadata can do?
其實應用服務就是建立在資料的基礎上，有想到一個很貼切的比喻:資料相當於是原子，原子藉由不同的搭配，可以建構世界上大大小小的事物，這邊的事物意旨應用服務。從這個角度切入去思考，就會發現 metadata 能做的延伸應用其實很多，就只差人們沒發想到。

這邊舉幾個我們日常有在使用的功能但是可能沒想到是 metadata 的應用:

* 搜尋引擎、SEO: 這些功能都有一個共通的目的，就是為了方便使用者能迅速找到與關鍵字相符的資訊，使用的地方可能是瀏覽器、博物館、筆記庫等場景。

* 數據分析: 除了上面這個例子以外，metadata 也可以拿來做數據分析，來統計相關資料出現的頻率高低進而找出受歡迎的資料，這是一個相當有價值的事情，不論是在行銷手法上或是需要下重要決策判斷時。

* 事件觸發因子: metadata 也能當作是事件觸發的條件因子，以智慧交通為例，假設一台機車騎經過某個路口做了紅燈右轉的動作並被攝影機捕捉到，這時與機車有關的回傳資訊我們假設有路燈狀態、行進方向，以及基本的時間、地點等資訊。這時取資料中的 ‘路燈狀態’  搭配 ‘行進方向’ ，再設置下面的觸發條件: 路燈狀態 = ‘red’ && 行進方向 = ‘right‘，就能變成一個科技執法中紅燈右轉的應用。由此延伸，便能將 metadata 元件建構出科技執法的相關應用。

* 影像辨識模型: 人們觀看一張照片，用眼睛能分辨照片中的景物，例如一張公園的照片，我們能辨認出照片中有樹木、綠地、椅子、溜滑梯等資訊，但若是要交給機器做辨認，其準確性就需要額外的訓練加強，而 metadata 在這邊就是一個很好的訓練資源。舉個例子來說，一張圖片的描述型資訊可能會有建築、植物、人類等用來描述圖片的 metadata，如此的資訊就能當做機器學習的教材。 

<br/>

## Future trend
在查看 DCMI 官網中介紹的 metadata 影片中看到官方推測 metadata 4.0 有沒有可能就是機器學習與自動索引結合產生的另一個世代? 我的的想法是如果說由 AI 自動生成 metadata 這點來看，以及我實際請 AI 根據提供的文件生成 metadata 的測試結果來看，似乎現在的 AI 工具就能做到六、七成，另外若要符合不同官方所定義的資料架構標準，也能用 prompts 或是將規則引入 AI 的方式來達成，但目前還是存在一些錯誤率，另外要考慮的就是 AI 產生的 metadata 是否能完全符合需求。

<br/>

## Summary
個人認為 metadata 的角色相當重要，畢竟它能影響著數據管理和服務應用的走向和潛力。開頭曾提到資料就是錢這句話，表示資料有其珍貴性，當人們能想出如何透過既有的 metadata 創造出千萬種可能的應用場景和服務時，這時資料就被視作是黃金，反之，若無法做任何應用，黃金也能是糞土。

<br/>

## Reference
[Metadata Basics](https://www.dublincore.org/resources/metadata-basics/)
[Metadata基礎導論](https://metadata.teldap.tw/bibliography/training/tra060616.pdf)
[Creating and Implementing a Metadata Strategy](https://www.dataversity.net/creating-and-implementing-a-metadata-strategy/)
[Apple App Metadata](https://developer.apple.com/documentation/appstoreconnectapi/app-metadata)