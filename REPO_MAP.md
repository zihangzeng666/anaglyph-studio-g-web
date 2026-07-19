# 倉庫地圖（看這份就不暈了）

> 這個專案的東西分三種：**🟢 你會用的**、**🟡 想看可以看的**、**⚫ 完全不用管的**。
> 一句話原則：**根目錄那堆 `.json` / `.ts` / `.mjs` 設定檔＝工具的說明書，永遠不用打開。**

---

## 🟢 你會用的（就這三個）

| 位置 | 是什麼 |
|---|---|
| `SITE_BLUEPRINT.md` | **結構表** — 改文字、換素材、調結構都在這裡標，改完丟回給 Claude |
| `media-inbox/` | **素材收件夾** — 新拍的截圖／影片照檔名丟進來（裡面的 README 是拍攝指南） |
| `README.md` | 專案入口說明（給工程師看的，你偶爾當目錄用） |

---

## 🟡 想看可以看的（內容住在這裡）

| 位置 | 是什麼 |
|---|---|
| `content/` | **全站文字的資料庫**：`chapters.ts` 六章文案、`site.ts` 標語和規格表、`claims.ts` 宣稱審核清單（哪些話能說哪些不能說）、`downloads.ts` 下載資訊。網站上幾乎每句話的源頭都在這裡 — 但你不用直接改它，改結構表就好 |
| `public/media/` | **網站正式在用的圖和影片**（`pipeline/` 六章配圖、`hold/` 追蹤影片）。素材從 media-inbox 處理完會搬進來 |
| `docs/` | 部署（DEPLOY）和效能（PERF）說明，工程向 |
| `media-inbox/_archive/` | 歸檔區：從網站上撤下來、目前沒用到的舊圖（要恢復跟 Claude 說） |

---

## ⚫ 完全不用管的

### 程式和工具（改網站說一聲就好，不用自己開）

| 位置 | 是什麼 |
|---|---|
| `src/` | 網站程式碼：`src/components/sections/` 是十個頁面段落（Hero、Pipeline⋯⋯），`src/app/` 是各個網頁（首頁、demo、download⋯⋯） |
| `scripts/` | 從 Studio G 自動截圖的輔助腳本 |
| `.github/` | 自動化：推上 GitHub 後自動測試（ci.yml）＋自動部署到網上（deploy-pages.yml） |
| 根目錄設定檔 | `package.json`（依賴清單）、`next.config.ts`、`tailwind.config.ts`、`tsconfig.json`、`eslint.config.mjs`、`vitest.config.ts`、`lighthouserc.cjs`、`postcss.config.mjs`、`.env.example` — 全是工具設定 |

### 自動生成區（電腦自己產的，刪了也會長回來，git 不收）

| 位置 | 是什麼 |
|---|---|
| `node_modules/` | 下載的第三方程式庫（幾萬個檔案，永遠不要進去） |
| `out/` | **build 的成品** — 真正發佈到網上的靜態網站。它只是 `content` + `src` + `public` 的輸出結果，看到裡面有東西不用理 |
| `.next/`、`tsconfig.tsbuildinfo`、`next-env.d.ts` | 編譯快取 |
| `.claude/` | Claude 的工作設定 |

---

## 東西是怎麼流動的

```
你拍素材 → media-inbox/          你改字 → SITE_BLUEPRINT.md
                └──────── Claude 處理 ────────┘
                            ↓
          content/（文字資料）+ public/media/（正式素材）
                            ↓
                 src/（程式碼把它們組成網頁）
                            ↓
              npm run build → out/（成品）
                            ↓
            GitHub Actions 自動部署到網上
```

**記住一件事就夠**：你只碰 🟢 那兩個檔案夾，其他一切有 Claude。
