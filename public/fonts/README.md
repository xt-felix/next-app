# 字体文件目录

此目录用于存放本地自定义字体文件。

## 字体文件格式

推荐使用 **woff2** 格式，它具有最佳的压缩率和浏览器兼容性。

## 示例结构

```
fonts/
  Brand-Regular.woff2
  Brand-Bold.woff2
  Brand-Italic.woff2
  Custom-Regular.woff2
  Custom-Bold.woff2
```

## 注意事项

1. **字体授权**：使用前确保已购买商业授权
2. **文件体积**：woff2 格式通常 50-500KB，中文字体需进行子集化
3. **命名规范**：使用清晰的命名，如 `FontName-Weight.woff2`
4. **版本控制**：大文件字体建议不要提交到 Git，使用 CDN 分发

## 字体格式转换

如果你有 ttf 或 otf 格式的字体，可以使用以下工具转换：

- **在线工具**：https://transfonter.org/
- **命令行工具**：fonttools

```bash
# 使用 fonttools 转换
pip install fonttools brotli
pyftsubset font.ttf --output-file=font.woff2 --flavor=woff2
```

## 中文字体子集化

中文字体文件通常很大（10MB+），需要进行子集化：

```bash
# 只提取常用 3500 字
pyftsubset font.ttf \
  --text-file=common-chars.txt \
  --output-file=font-subset.woff2 \
  --flavor=woff2
```

这样可以将文件大小减小到 500KB 左右。

