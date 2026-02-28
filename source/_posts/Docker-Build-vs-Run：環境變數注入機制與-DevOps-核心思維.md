---
title: Docker Build vs Run：環境變數注入機制與 DevOps 核心思維
toc: true
date: 2026-02-28 20:13:20
tags:
categories:
- Software
- Docker
---

剛好近期很常使用 Docker 布署專案，所以想說似乎可以來寫些 Docker 相關的內容。Docker 中的 Build Time 和 Run Time 在剛接觸的時候很容易會不清楚兩者的差異，何時會讀取環境變數，以及在這兩個階段中究竟做了什麼事...

<!-- more -->

<br/>

**這篇文章並不是要介紹 Docker，文章重點會著重在 Docker 布署上容易混淆的 Build Time 和 Run Time，在了解的過程中也能窺見 DevOps 的想法**。在布署時，Docker 主要會有兩個階段，一個階段是 Build Time，另一個階段是 Run Time。在沒有了解這兩個階段的情況下，有可能只會侷限於 Docker 的指令而不知道 Docker 的背景以及使用的技術，並且就單純想著先用 docker build 建立 docker image 然後在把 container 跑起來，就完成布署了，但其實在執行 docker build 時做了哪些事，執行 docker run 時又做了哪些事情卻不是很清楚，再加上 dockerfile 還是用 AI 寫的，就更不清楚這兩個階段的行為了。

<br/>

## 在 Build Time 和 Run Time 處理了什麼?
Build Time 決定的是「系統結構」，而 Run Time 決定的是「執行環境」。

Build Time：
* 安裝什麼套件
* 放什麼檔案
* 預設 ENV
* 預設 CMD

<br/>

Run Time：
* 連哪個 DB
* 用哪個 API Key
* 記憶體多少
* network 怎麼接
* …
* 建立容器

<br/>

執行 docker build (Build Time) 的階段時，會去 follow 專案中指定的 dockerfile，依據 dockerfile 的內容指令依序下去執行，並把每一步產生的檔案系統快照封裝成鏡像層 (image layer)，執行完畢會產出鏡像檔 (docker image)。Docker 的鏡像檔有點像 JAVA 中的 .jar 檔 (一種壓縮檔案) 但又不完全是，嚴格來說是**多層唯讀檔案系統**，Docker 的鏡像檔不只是壓縮檔，而是多層檔案系統快照。此外，鏡像檔是唯讀狀態，所以無法被修改，若真的需要變動，也只能修改原始專案然後重新執行 docker build 的動作 (系統快照和 layer 底層技術並非本文討論要點，有興趣可以參考...)。鏡像檔是根據 dockerfile 提供的內容來產生的，而 dockerfile 中的重點內容會有需要安裝的倚賴和需要複製什麼檔案 (建置環境會需要的檔案)以及會有什麼環境變數和初始啟動指令等項目 (關於 dockerfile 的設置內容可以參考官方文件 [Dockerfile reference](https://docs.docker.com/reference/dockerfile/))。

<br/>

在 docker run (Run Time) 階段則是根據指定的鏡像檔建立容器實例 (container)，不同於鏡像檔的唯讀，這個實例本身是可以被寫入的，也就是說 container 是鏡像檔 的 writable layer + metadata，容器本身是可以被編輯的，就算在容器中進行修改，也不會改動到鏡像檔的內容 (image 是模板，container 是實例)。在 Run Time 階段除了建立寫入層外還會去做環境的設定，像是注入環境變數、設定網路方式、port 的設定和 volume mount (資料掛載) 等的基本設定，接下來會讀取鏡像檔中的 EntryPoint 和 CMD (進入點和初始啟動命令) 並在 writable layer 上啟動 process (process 可能是你的 app 或 shell)。Docker container 有點像是建立虛擬電腦 vm (Virtual Machine) 的感覺，但不同於 vm 的是，Docker container 是與 host (主機) 共用 kernel (作業系統核心 / OS 的最底層程式)。

<br/>


               docker build
                     │
                     ▼
        +----------------------------------+
        |          Dockerfile              |
        |----------------------------------|
        | FROM ubuntu                      |
        | ARG VERSION                      |
        | ENV NODE_ENV=prod                |
        | RUN apt install ...              |
        | COPY . /app                      |
        +----------------------------------+
                     │
                     ▼
        +----------------------------------+
        |            Image                 |
        |----------------------------------|
        | Layer 3  (COPY app)     (RO)     |
        | Layer 2  (apt install)  (RO)     |
        | Layer 1  (base image)   (RO)     |
        |----------------------------------|
        | Default ENV: NODE_ENV=prod       |
        +----------------------------------+

---
            docker run -e NODE_ENV=test
                      │
                      ▼
        +----------------------------------+
        |            Container             |
        |----------------------------------|
        | Writable Layer (RW)              |
        |----------------------------------|
        | Image Layer 3 (RO)               |
        | Image Layer 2 (RO)               |
        | Image Layer 1 (RO)               |
        |----------------------------------|
        | Runtime ENV: NODE_ENV=test       |
        | Running Process (your app)       |
        +----------------------------------+

RO: Read Only ; RW: Read & Write

<br/>

## 環境變數何時被寫入？
在布署上，環境變數被寫入的時間點很常被誤會是在 Build Time 階段，因為在 dockerfile 中有 ENV 項目，就被認為會在這個階段設定環境變數，然而，也會有些疑問: 為什麼 .env 檔案有設環境變數，但是 dockerfile 也要寫一次變數，而有時候在 docker run 又再輸入一次變數？

<br/>

其實在 dockerfile 中的 ENV 只是在設定鏡像檔的預設值 (default value)，真正寫入需要的環境變數時間點是在 Run Time。仔細想想，如果在 Build Time 就把環境變數設定且固定好，當要變動一個參數如 PORT=8000 且沒有更動程式邏輯的情況下，就需要重新執行 docker build 來產生修改後的鏡像檔，這種作法不僅消耗了很多時間在等待鏡像檔的生成，也完全違背了 **DevOps 的核心思想: 一次構建，隨處運行，運行時再配置參數**；同樣的情況，假若環境變數的寫入時機被安排在 Run Time，鏡像檔就只需要建構一次，此外，就算需要布署在不同設備上，也只要調整參數就可以正常運行。

<br/>

Build 階段可以「定義預設值」或「宣告需要的變數」，但 Run Time 才會「真正決定最終使用的值」。Run Time 會去覆寫 ENV 的預設值，此時會寫入設定的基本參數還有像是 token 值或是資料庫密碼等敏感資訊。

<br/>

## 讀取環境變數的優先順序？
在後端專案中，除了在 dockerfile 中會看到 ENV 參數外，通常在 .env 檔案和 docker-compose.yml 也會有環境變數的身影，有時候也會出現在 docker run 指令中 (`docker run -e` 指令)。在這些地方都有環境變數的出現，這些變數到底在哪個階段被讀取？誰會覆寫誰？如果同一個變數出現在多個地方，最後容器內拿到的是哪一個？

<br/>

在我們使用 docker compose 來建置容器時，會執行 docker compose up 指令，這個指令會執行的事情：
① 讀取 .env
② 解析 docker-compose.yml
③ 變數替換 ${VAR}
④ 組合最終設定
⑤ 呼叫 Docker Engine
⑥ 建立 container
⑦ 注入 environment
⑧ 啟動 container 內的程式

<br/>

前面幾個步驟是 compose 的解析階段，並不是文章提到的容器 Run Time。真正的 Run Time 是在當 Docker Engine 收到完整設定後，開始執行 Run Time 工作內容的這個階段。也就是說 compose 的變數替換發生在「指令執行時」，但這時只是設定檔的處理階段；容器 Run Time 則是在 Docker Engine 啟動 container 並執行程式的階段。兩者時間上連續，但概念上完全不同。

<br/>

.env 是 compose CLI 執行時讀取的設定來源，解析時通常會預設讀取 .env 檔案中的變數值，而 **.env 本身不會自動進入 container**，所以 .env 的作用其實是提供變數給 docker compose 用來「替換」設定檔。因此，當容器真正啟動時，環境變數的主要來源是：

* dockerfile ENV
* docker-compose environment
* docker run -e

<br/>

當同樣的變數同時出現在這三個地方，然後分別是不同的設定值，誰會被覆寫呢？

<br/>

優先權的順序為：`docker run -e > docker-compose environment > dockerfile ENV`
docker run -e 的優先權是最高，它會直接在啟動 container 時注入並覆蓋任何鏡像檔內的 ENV 或是 docker-compose environment 的設定；docker-compose environment 則是在沒有 docker run -e 的指定時，才會被注入 container 中；dockerfile ENV 是只在 Run Time 沒有被 compose 或 docker run -e 覆蓋時才會生效。

```
最高優先權
docker run -e
docker compose run -e
docker-compose environment
Dockerfile ENV
最低
```

<br/>

##  Docker 與 DevOps 的核心思想
在 Docker 中，**Image = immutable infrastructure** 鏡像檔相當於不可變基礎設施，而 **Container = mutable runtime instance** 容器則是可變的執行實例。如果用現實生活來比喻，鏡像檔就好比是建築物的結構，然後容器則是可以在建築物中改變家具和擺設，不論內部裝潢如何調整又或是把家具和擺設丟除，建築物的結構本身都不會有變化。這其實就是**DevOps 的核心思想：一次構建，隨處運行，運行時再配置參數** (對這想法有興趣的人，可以去鑽研 CI/CD 的設計哲學)。

<br/>

[補充]
學習 Docker 的方式，我建議直接上手操作，比起看完一堆文件說明，實際邊動手邊查閱文件是我覺得最快的學習方式，題外話，現在有 AI 的出現，你或許能有學得更快的方式。假如你原本就有 Linux 的基礎再來接觸 Docker 其實就非常容易理解並且快速地使用它，假設你兩者都沒碰過，我建議先學習 Linux 再來學 Docker。

Image layers (read-only) + Container layer (read-write) 會讓人聯想到 Linux 的 core 和 shell，但較貼切的比喻可能會是：

| Docker | Linux 比喻 | 說明 |
| -------- | -------- | -------- | 
| Image layers (read-only) | 系統檔案 + 已安裝套件 | 像整個檔案系統的 rootfs，包括 OS、程式、依賴，但不是 kernel，本身是 immutable |
| Container layer (read-write) | 可寫入的 overlay filesystem | 相當於「你在 shell 裡修改檔案的那一層」，不影響 image |
| Container 本身 | Shell + process | 它包含 image 內容 + writable layer + 你執行的 process |

<br/>

[Docker concepts](https://docs.docker.com/get-started/docker-concepts/building-images/)
[Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
