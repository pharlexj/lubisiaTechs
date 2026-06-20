from pathlib import Path
files = [
    'artifacts/api-server/src/routes/affiliate.ts',
    'artifacts/api-server/src/routes/auth.ts',
    'artifacts/api-server/src/routes/blog.ts',
    'artifacts/api-server/src/routes/inquiries.ts',
    'artifacts/api-server/src/routes/newsletter.ts',
    'artifacts/api-server/src/routes/orders.ts',
    'artifacts/api-server/src/routes/products.ts',
    'artifacts/api-server/src/routes/services.ts',
    'artifacts/api-server/src/routes/settings.ts',
    'artifacts/api-server/src/routes/website-templates.ts',
]
for path in files:
    p = Path(path)
    text = p.read_text(encoding='utf-8').splitlines()
    changed = False
    out = []
    for line in text:
        stripped = line.lstrip()
        if stripped.startswith('return '):
            out.append(line)
            continue
        if stripped.startswith('res.status(') or stripped.startswith('res.json(') or stripped.startswith('res.send('):
            indent = line[: len(line) - len(stripped)]
            out.append(f'{indent}return {stripped}')
            changed = True
        else:
            out.append(line)
    if changed:
        p.write_text('\n'.join(out) + '\n', encoding='utf-8')
        print(f'updated {path}')
