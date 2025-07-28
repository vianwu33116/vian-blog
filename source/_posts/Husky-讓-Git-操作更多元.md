---
title: Husky 讓 Git 操作更多元
toc: true
date: 2025-07-27 15:19:49
tags:
- Open Source
categories:
- Open Source
---

前面的文章曾介紹過分散式版本控制軟體 Git，而這次想提的開源 Husky 則是建立在 Git 基礎上的工具，Husky 和 Git 兩者有著相輔相成的關係。這篇文章除了想說這兩者的關聯，另外也可以去思考 Husky 對於軟體開發的工作流或是 CI/CD 有什麼幫助，又或者該置於工作流中的哪個角色上。

<!-- more -->

<br/>

## **什麼是 Husky?**
簡單來說，Husky 是一個在你提交 Git 指令前檢查程式碼的工具。如果看官方文件是這麼介紹: “Husky enhances your commits and more”，官方說明挺簡單、抽象的。舉個例子: Husky 工具可以幫助你在跑 git commit 前去執行自訂的程式碼檢查腳本，自訂的程式碼腳本包含像是對齊、語法檢查等其他多元功能。 

<br/>

### **Git Hooks**
在深入 Husky 前需要先知道 Git Hooks，因為 Husky 底層就是使用 Git Hooks 來達成目標的。Git 是分散式版本控制軟體，本身有自己的 Hooks，Hooks 目的是當某些操作發生時，可以用來觸發事件。Git Hooks 主要分為兩個種類，一個是**客戶端 (client-side hooks)**，另一個是**伺服器端 (server-side hooks)**。伺服器端的 Hooks 不在我們這次的討論範圍中，因為這一類的 Hooks 通常是運行在遠端的 Git 伺服器上，而 Husky 是只支援本地端的 Hooks (client-side hooks)。

<br/>

#### **Client-side hooks** 
當提交的 git 指令與 client-side hooks 有關連時，會去執行 Hooks 下的腳本。Client-side hooks 相當多，例如: `pre-commit`, `pre-merge-commit`, `prepare-commit-msg`, `commit-msg`, `post-commit`, …等，有興趣研究可以查看 [Git 官方文件](https://git-scm.com/book/zh-tw/v2/Customizing-Git-Git-Hooks)。在 Husky 程式碼的 [husky/index.js](https://github.com/typicode/husky/blob/main/index.js) 檔案中也可以查看他有包含的 client-side hooks。

<br/><br/>

---

一般而言，只要本地端環境有安裝 Git 就能夠在本地執行 Git Hooks 中的自訂腳本，也就是說其實不使用 Husky 也能去執行任務。那為什麼還需要介紹這個工具呢? 不直接使用 Git Hooks 的原因是什麼?

<br/>

### **為什麼不直接使用 Git Hooks**
若是單純使用 Git Hooks 的自訂腳本，腳本會放到 `.git/hooks` 目錄下，但這個目錄下的檔案不會被 Git 追蹤，也就是說自訂腳本是不會被放入到版本控制中，如果說只是在個人專案上使用 Git Hooks 不會有太大的影響，但如果是在團隊開發上，團隊成員需要手動添加或是手動更新腳本，這會是一件很困擾的事，而這也是為什麼 Husky 出現後很受歡迎的原因。Husky 會將自訂腳本放入到 `.husky` 資料夾底下做版控，然後在 `.git/hooks` 資料夾中建立一個小型代理腳本指向 `.husky` 資料夾內的自訂腳本。這樣一來，當 Git 事件觸發時，實際上是通過這個代理腳本執行 `.husky` 目錄下的實際腳本。由於 Husky 能將自訂腳本加入到版本控制中，所以在團隊專案開發或是維護上，優點是好管理而且較容易維護。

<br/>

## **Husky 的用途**
Husky 能做的事情其實相當多元，或者也可以說 Git Hooks 本身就能做很多的應用搭配，一般來說，最常也最普遍的應用是在程式碼的格式檢查和單元測試上，而這兩個應用大部分會是在 `pre-commit` 或是 `pre-push` hooks 中被執行。下面簡單列出幾個實際的用途:

<br/>

* 格式檢查
    * 通常會搭配 linting 和 Prettier 等工具，檢查未使用的變數、語法錯誤和縮排方式等問題
* 程式碼測試
    * 自動觸發測試碼執行而不需手動下指令，通常會跑單元、整合測試
* 檢查 commit message 是否符合團隊規範
    * 基本搭配 `commit-msg` hook 來確認訊息中是否包含特殊字眼
* 判斷是否在主要分支上提交
    * 防止開發者直接在主要分支上 commit，強制使用分支流程
* 阻止意外 commit .env、金鑰等敏感檔案
    * 避免不小心把密鑰、API token 等機密資訊推送上 Git
* 確保每個新檔案都有 License header
    * 確保標明引用出處，避免違反開源協議
* 套件 / 依賴版本鎖定檢查
    * 防止同一個專案開發者誤改 package-lock.json 或安裝錯誤版本
* 移除 debug log / console.log
    * 避免把除錯用的 console.log 留在正式版本 (可以在 lint 的設定中加入檢查)
* 阻止在特定時段 push 程式碼
    * 此情況不常見，基本用在特殊需求上或是週末時段

<br/>

這些應用不外乎都在追求一個共同目標: **安全、穩定、好維護**的軟體。若團隊有 code review 的安排，Husky 工具的使用有助於提高 code review 的效率。

<br/><br/>

---

說明完 Husky 後，想提幾個可以思考的點，就是一開始在撰寫自訂腳本時，通常都會有個疑問，這個疑問並不是如何撰寫腳本，而是該在何時執行腳本? 另一個問題則是，所有檔案都要被檢查嗎? 還是只有被改動與加入到暫存區的檔案才需要?

<br/>

## **何時該執行自訂腳本?**
執行腳本的時間點其實並沒有一個絕對的標準答案，有時候取決於專案時間的急迫性、或是團隊共識和習慣。舉例來說，如果想執行測試的腳本，有些工程師會覺得應該要在 git commit 時先去跑測試，而另一些工程師覺得跑測試太花時間，應該要在 git push 前再去跑，也有第三族群較嚴謹，認為當這兩個 git 指令觸發時都可以去跑測試腳本。這三種想法沒有對錯，而比較會有爭議的地方會在，是否有餘裕和時間成本去調整測試失敗的程式碼。除此之外，還可以討論這個測試腳本是否只先包含單元測試 (unit test)，然後整合測試 (integration test) 和端點對端點測試 (End-to-End test) 則另外拉到遠端的 Git 伺服器上執行 (如 Github Actions 中)，藉由討論再綜合各方因素來達成團隊共識這樣。 

<br/>

## **需要檢查所有檔案嗎?**
有些人會覺得如果每次 commit 都要去檢查所有檔案的程式碼，掃描時間過長，所以有些工程師時常會搭配 `lint-staged` 這個套件，主要用意是只要檢查或處理有變更的檔案。這個做法適合在，當其他未變動的檔案在建立時已經先跑過檢查腳本的話，的確不需要在未改動的狀況下再跑一次。不過若是檔案建立初期未跑過任何自訂腳本，有可能因此躲避掉或被忽略了檢查。

<br/>

## **雙重搭配的情況**
Husky 工具也常搭配第三方的自動化工具來分工合作，讓整合流程更完整，也就是將 Husky 當作第一道防線，而 Git 伺服端的自動化工具當作第二道防線檢查。舉一個很常見的方式，就是有些團隊會將端點對端點測試、效能測試等分給 Github Actions 來執行，而其他測試部分則給 Husky 。這樣的分配原因主要是因為這類複雜或資源密集型的測試，牽涉層面較廣，本身需要的執行時間較長，而且在專案修改後，出現錯誤的機率也會較其他測試高，因此若是將這些測試放到本地的開發環境來執行，所需要的時間成本相當高，更不用說可能還會遇到錯誤需要調整的情況。

<br/>

## **小結**
比起單純介紹 Husky 這樣的工具，更希望是讓大家去思考，自訂腳本是不是還能做其他事，又或者更深一步去想應該在什麼時機點去執行自訂腳本，也就是去規劃你想要怎麼樣的工作流，又或者是否需要一起搭配 Git 遠端伺服器上的其他自動化工具來讓整合的部分更加完整，達到後續持續整合、持續交付的目標。

<br/>

## Reference
[Husky 官方文件](https://typicode.github.io/husky/)
[Husky Github](https://github.com/typicode/husky)
[Git Hooks 官方文件](https://git-scm.com/book/zh-tw/v2/Customizing-Git-Git-Hooks)