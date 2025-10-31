---
title: SDD 規格驅動開發
toc: true
date: 2025-10-31 23:11:53
tags:
categories: Software
---

## 引言
看完這篇文章你可能會對 SDD (Specification-Driven Development) 有些許的認識, 也會知道為什麼原本以前就存在的這個詞彙又再度掀起一股熱潮，但這篇文章的主要目的是希望大家能去思考開發產品背後的意義是什麼。

<!-- more -->

<br/>

## SDD 是什麼?
SDD (Specification-Driven Development) 指的是規格驅動開發。意思是得知開發需求後，不先急著開發，而是先寫好規格文件。有些嚴謹的團隊會更進一步要求需經由專業人員審核規格文件後才能開始開發。SDD 近期廣受開發者討論，然而他並不是一個新創詞彙。SDD 的概念早在1990s 就出現在論文中，在 2004 年 Jonathan S. Ostroff, David Makalsky, Richard F. Paige 所發表的論文《Agile Specification-Driven Development》將此概念做一個較完整的整理並和 TDD (Test-Driven Development) 做比較。

SDD 是否就只是用在 system structure, data flow, database schema, API spec 等定義上，而對於前端開發畫面來說沒什麼好寫? 有些前端開發者可能會覺得 UI 交付畫面後，就依設計稿來開發然後再串接對應的 API 最後做個簡單測試就完成了，SDD 似乎在前端沒什麼好寫的。在講前端的 SDD 可以寫什麼之前，我們需要先釐清撰寫 SDD 的主要目的和原因，對 SDD 有基本了解才能推敲前端的 SDD 適合寫什麼以及什麼情況下建議寫 SDD。

<br/>

## 撰寫 SDD 的意義何在?
SDD 的規格定義除了驗收標準、技術規格定義以外也包含了專案目的、需求和使用情境 (使用者故事) 的定義。相比技術規格的定義，目的和需求的定義更為核心，也就是所謂的「Why & What」。先把地基打好才能蓋出一個堅固可靠的建築，因此需要先搞清楚 “Why”， 為什麼我們要開發這項產品? 主要的目的為何? 並預期獲得怎樣的效果? 在這個階段若是覺得不符合邏輯和團隊目標就能先提出避免做白工；再來要搞清楚 “What”，哪些是必須要做的功能? 哪些是多餘或暫時無用的? 必要功能是否足夠滿足需求以實現目標? 這個階段能收斂後續開發內容。

「Why & What」為基底且尚未涉及到技術層面的探討，所以非程式開發者也能撰寫自己的需求 spec 並收斂想實現的功能。在打底的同時也是在反思，例如誰會使用這個產品? 使用者會感興趣並達成團隊最初的目的? 這產品解決了什麼問題? 哪些結果才是最重要的? 第一步思考階段我認為是 SDD 規格定義中最重要的一環，因為你技術再怎麼好，架構設計的多完善或是使用者介面設計的多美，不是使用者的需求、沒有解決痛點，使用者也不會想使用。因此，撰寫 SDD 的意義在於釐清目的和需求，並且收斂想法，也就是說搞清楚狀況再做事。

<br/>

## SDD 為何又熱鬧起來?
SDD 這個開發模式之所以又再被拿出來熱烈討論的原因是受 AI 的 Vibe coding 所驅使。Vibe coding 在 AI 的寫程式能力下誕生，讓不會寫程式的人們能透過自然語言來寫出電腦上能運行的代碼，然而這樣的開發方式存在著一些問題，例如非專業技術人士可能會給出模糊或矛盾的描述進而導致 AI 輸出難以預測的程式碼，又或是發散了原本提出的需求。在這樣的背景之下，SDD 被拿來當作 Vibe coding 的解決辦法，在 SDD 明確且清楚的規格定義下，AI 不容易混淆和發散目的和需求。有些人認為 SDD 是 Vibe Coding 最具實踐性的未來方向，一些科技團隊馬上跟隨這波熱潮，開始推出 AI 輔助 SDD 的開發模式，像是知名代表 Amazon 的 Kiro 工具和 Github 開源的 spec-kit 工具等。

<br/>

## 前端的 SDD 能寫什麼?
寫到這有些疲憊，我後續有空補上

<br/>

## Reference
https://etheses.dur.ac.uk/5273/?utm_source=chatgpt.com
https://www.eecs.yorku.ca/~jonathan/publications/2004/xp2004.pdf?utm_source=chatgpt.com
https://frontendatscale.com/issues/49/
https://danielsogl.medium.com/spec-driven-development-sdd-the-evolution-beyond-vibe-coding-1e431ae7d47b

