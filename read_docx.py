
try:
    from docx import Document
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
    from docx import Document

doc = Document('新闻男足简史.docx')

# 提取所有段落文本
full_text = []
for para in doc.paragraphs:
    if para.text.strip():
        full_text.append(para.text)

# 保存到文件
with open('新闻男足简史_全文.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(full_text))

print('文档内容已提取到 新闻男足简史_全文.txt')
print(f'共提取 {len(full_text)} 个段落')
print('\n前50个段落预览：')
for i, text in enumerate(full_text[:50]):
    print(f'{i+1}. {text}')
