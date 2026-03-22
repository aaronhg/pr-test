# PR Code Review 流程

## 前置條件

- Node.js 20+
- [GitHub CLI (`gh`)](https://cli.github.com/) 已安裝並登入
- clone repo 後執行 `npm install`（會自動設定 Husky pre-commit hook）

## 基礎建設總覽

| 工具                | 用途              | 設定檔                              |
| ------------------- | ----------------- | ----------------------------------- |
| ESLint              | 程式碼品質檢查    | `.eslintrc.js`                      |
| Prettier            | 程式碼格式化      | `.prettierrc`                       |
| TypeScript          | 型別檢查          | `tsconfig.json`                     |
| Vitest              | 單元測試          | -                                   |
| Husky + lint-staged | commit 前自動檢查 | `.husky/pre-commit`, `package.json` |
| GitHub Actions      | CI pipeline       | `.github/workflows/ci.yml`          |
| CODEOWNERS          | 自動指派 reviewer | `.github/CODEOWNERS`                |
| PR Template         | 統一 PR 格式      | `.github/pull_request_template.md`  |

## Branch Protection 規則

`main` 分支已設定：

- 禁止直接 push，必須透過 PR 合併
- CI check job 必須通過
- 至少 1 人 Approve 才能合併

---

## 開發者流程

### 1. 建立 feature branch

```bash
git checkout main
git pull
git checkout -b feature/my-feature
```

### 2. 開發 + 寫測試

修改 `src/` 下的程式碼，並新增或修改對應的 `.test.ts`。

### 3. 本地驗證

```bash
npm run lint          # ESLint 檢查
npm run format:check  # Prettier 格式檢查
npm run type-check    # TypeScript 型別檢查
npm test              # 跑測試
```

### 4. Commit

```bash
git add <files>
git commit -m "feat: 簡短描述改動"
```

commit 時 Husky 會自動執行 lint-staged，對 staged 檔案跑 ESLint + Prettier。
如果不通過，commit 會被擋下，修好後重新 commit。

### 5. Push + 發 PR

```bash
git push -u origin feature/my-feature
gh pr create
```

`gh pr create` 會自動套用 PR Template，填寫以下欄位：

- **目的**：解決什麼問題、為什麼要改
- **改動摘要**：主要改了哪些地方
- **測試方式**：怎麼驗證
- **截圖/錄影**：有 UI 變動時必附

### 6. 等待 CI + Review

- GitHub Actions 會自動跑 lint → format → type-check → test → build
- CODEOWNERS 指定的 reviewer 會收到通知

---

## Reviewer 流程

### 1. 拉 PR 到本地

```bash
gh pr checkout <PR 號碼>
```

### 2. 看 diff

```bash
gh pr diff <PR 號碼>
```

### 3. 本地驗證

```bash
npm test
npm run lint
```

如有 UI 改動，啟動 dev server 實際操作一遍。

### 4. Review 重點

- **邏輯正確性**：edge case、錯誤處理
- **架構合理性**：職責劃分、元件拆分
- **可讀性**：命名、結構、複雜度
- **前端特有**：語義 HTML、accessibility、響應式、效能
- **安全性**：XSS、使用者輸入處理
- **測試覆蓋**：新功能是否有對應測試

### 5. 留 Comment

在 GitHub 上或用 CLI：

```bash
gh pr review <PR 號碼> --comment --body "comment 內容"
```

標明等級：

| 標記           | 意義                   |
| -------------- | ---------------------- |
| `[must-fix]`   | 必須修改，不改不能合併 |
| `[suggestion]` | 建議修改，可以討論     |
| `[nit]`        | 小事，改不改都行       |
| `[question]`   | 不懂想問               |

### 6. Approve 或 Request Changes

```bash
# 通過
gh pr review <PR 號碼> --approve --body "LGTM"

# 要求修改
gh pr review <PR 號碼> --request-changes --body "請修改 xxx"
```

---

## 合併

確認 CI 通過 + Approve 後：

```bash
gh pr merge <PR 號碼> --squash --delete-branch
```

- `--squash`：將 PR 所有 commit 壓成一個，保持 main 歷史乾淨
- `--delete-branch`：合併後自動刪除 feature branch

---

## 常用指令速查

```bash
# 查看 PR 清單
gh pr list

# 查看 PR 詳情
gh pr view <PR 號碼>

# 查看 CI 狀態
gh pr checks <PR 號碼>

# 在 瀏覽器開啟 PR
gh pr view <PR 號碼> --web
```

---

## npm scripts 一覽

| 指令                   | 用途                          |
| ---------------------- | ----------------------------- |
| `npm run lint`         | ESLint 檢查                   |
| `npm run format:check` | Prettier 格式檢查             |
| `npm run type-check`   | TypeScript 型別檢查           |
| `npm test`             | 跑 Vitest 測試                |
| `npm run build`        | TypeScript 編譯輸出到 `dist/` |
