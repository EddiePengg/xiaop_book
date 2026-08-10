# 每日一书

每日一本好书的深度消化报告与播客。

## 开发

```bash
npm install
npm run dev   # http://localhost:3020
```

## 数据结构

```
books/
  YYYY-MM-DD_书名/
    meta.json     # 元数据（书名、作者、评分、日期、播客标题、标签）
    report.md     # 深度消化报告
    podcast.mp3   # 播客音频（可选）
    cover.jpg     # 封面图（可选）
```

添加新书：在 `books/` 下新建 `YYYY-MM-DD_书名/` 文件夹，放入上述文件即可。
