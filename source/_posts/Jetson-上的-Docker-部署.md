---
title: Jetson 上的 Docker 部署
toc: true
date: 2026-01-31 23:57:07
tags:
- NVIDIA Jetson
categories:
- Software
- Docker
---

最近工作上剛好接觸到 IPC - NVIDIA Jetson Orin Nano，開發和部署都會在 Jetson 上，由於 NVIDIA Jetson 這類邊緣運算設備的容器部署並非像一般 PC 或雲端環境那樣已經有一套標準化流程，再加上牽扯到 GPU、Driver、硬體設備、系統版本，就會讓部署流程增加許多變數。因此，覺得這次的實戰經驗有一些內容可以記錄下來。

<!-- more -->

<br/>

## Jetson 環境準備關鍵

<br/>

由於專案核心功能需要使用辨識模型進行推論，加上模型偏大，又有低延遲和 FPS (每秒幀數) 的一定要求所以推論速度不能太慢，故選擇 NVIDIA Jetson 設備，能善用 NVIDIA Jetson GPU / AI 加速單元（不是非 Jetson 不可，而是在邊緣端需求下，Jetson 是個不錯的平衡點）。

<br/>

如果要從這次的實戰中，只選一個最重要的部署環節，那一定會是：Jetson 系統與 GPU 環境的相容性。要注意的是 GPU 容器沒有自己的驅動，容器需要借用 Host 的 GPU 驅動與 CUDA 能力，因為 GPU 驅動是 Kernel-level 元件，而 Docker 容器是 User-space 隔離。容器是「共用」Host 的驅動，容器本身沒有真正 driver。因此，需要先確認本機環境有必要的安裝支援，還有目前 JetPack 的版本。Driver 跟 Jetpack 版本有倚賴，相同的容器跑在不同版本的 JetPack 不一定能運行，此外，Jetson 的 CUDA、cuDNN、TensorRT 也都強烈依賴 JetPack 版本。

<br/>

在部署或是開發之前，由於會需要使用 Host 的 GPU 驅動與 CUDA 能力，所以我們需要先確認:

### 本機環境:
* JetPack / L4T 版本確認 `jetson_release` 和檢查 CUDA 對應的版本
* GPU device 是否存在 `ls /dev/nv*`
* NVIDIA Driver 是否正常 `sudo tegrastats` or `nvidia-smi`
    * 支援 NVIDIA Container Runtime `docker --version`
    * 確認 runtime 是否正常 `docker info | grep -i runtime`
* 檢查 Docker 是否可調用 GPU

```
docker info | grep -i runtime
```

```
Runtimes: io.containerd.runc.v2 nvidia runc
Default Runtime: nvidia
```

<br/>

### 容器環境：
* 需要匹配 JetPack，有相容性問題
    * 像是 JetPack 5 會是對應 l4t-r35.x 系列 container 
* CUDA runtime / headers 版本相容性
    * `python -c "import torch; print(torch.version.cuda)"`
* TensorRT 是否可用
    * `python -c "import tensorrt as trt; print(trt.__version__)"`
* pyCUDA
    * 實際 GPU 推論測試: `python -c "import torch; print(torch.cuda.is_available())"`

<br/><br/>

## Docker 部署需要注意的地方

<br/>

### 版本和相容性
使用 Docker 容器部署的優點是環境一致性、版本可控、多服務整合方便，但是也需要注意 JetPack 6 開始 OS 版本從 Ubuntu 20.04 → Ubuntu 22.04，CUDA / driver / L4T 系統也有較大差異，此外 NVIDIA 官方在 NGC 上的 “L4T base” image 不像以前那樣穩定持續更新或能完整覆蓋 JetPack 6.0 以上所有的版本。另外，此類型的鏡像檔通常體積大，所以在拉取時較慢，以及與硬體設備的整合較複雜。

<br/>

### 前端打包
由於這次使用的是 8G RAM 的 Jetson 設備，所以在前、後端建置上都盡量往輕量的目標走，選擇輕量框架而非主流框架，因為也不走一般的網頁形式。在打包成鏡像檔上，前端需要格外注意 API_BASE_URL build 階段盡量不要編進 image 中，讓 API 位址在 runtime 才注入。會這麼說是因為常會看到 `const API_BASE_URL = import.meta.env.VITE_API_BASE_URL` 的寫法，但是這個寫法的 API URL 在 npm run build 時就被編譯進 JS 中，如果又是指定 IP 的情況下，docker image 無法共用，導致每次換設備或 IP 都要重新 build，沒有通用的 docker image 不利 CI/CD。

<br/>

### 掛載
模型一般不會包進 docker image 中，建議用 volume 掛載 (ex. /opt/app/models)，優點是可單獨更新模型，image 輕量化，管理彈性高。而 log 和 data 的也會用 volume 的方式來掛載，需要注意的重點是，權限設定盡量避免用 root 寫入 (通常只有 log 和 data 會有寫入權限，其餘會設定唯讀)。除了上述檔案的掛載，硬體的掛載如相機，通常會看到 device 的掛載方式，但是如果遇到熱插拔等中途加入硬體的情況，建議掛整個 /dev 或是使用 udev 規則 + group 權限。

<br/><br/>

## 小結
這次的實戰中，最困難的地方是如何在資源及成本條件有限的情況下，快速做出能夠在市場上驗證的 prototype。不論是有限的硬體資源、GPU 運算、一個月的開發和部署期限等條件限制下，還有不熟悉的邊緣運算設備上都是一大挑戰。在邊緣設備上，簡單可控比炫技更重要。寫程式只是開始，能穩定運行才是真正完成。

<br/>