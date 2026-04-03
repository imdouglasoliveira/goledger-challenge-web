import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

function getActionTags(content: string, tagName: 'button' | 'Button') {
  const matches = content.match(new RegExp(`<${tagName}\\b[\\s\\S]*?>`, 'g')) || [];
  return matches.filter((tag) => !tag.startsWith(`</${tagName}`));
}

describe('Ghost Actions - Botoes sem handler', () => {
  const componentFiles = [
    'components/tvshows/tvshows-page.tsx',
    'components/tvshows/tvshow-thumbnail.tsx',
    'components/tvshows/tvshow-form.tsx',
    'components/layout/hero-banner.tsx',
    'components/layout/carousel-row.tsx',
  ];

  componentFiles.forEach(file => {
    it(`${file} — todo <button> tem onClick ou type="submit"`, () => {
      const content = fs.readFileSync(path.resolve(file), 'utf-8');
      const buttonMatches = [
        ...getActionTags(content, 'button'),
        ...getActionTags(content, 'Button'),
      ];

      buttonMatches.forEach((btn, i) => {
        const hasOnClick = /\bonClick=/.test(btn);
        const hasSubmitType = /type=(?:"submit"|'submit'|{"submit"})/.test(btn);
        expect(
          hasOnClick || hasSubmitType,
          `Botao #${i + 1} em ${file} nao tem onClick nem type="submit": ${btn.slice(0, 80)}...`
        ).toBe(true);
      });
    });
  });
});

describe('Ghost Imports - Imports nao usados', () => {
  const files = [
    'components/tvshows/tvshows-page.tsx',
    'components/tvshows/tvshow-form.tsx',
    'lib/hooks/use-tvshows.ts',
  ];

  files.forEach(file => {
    it(`${file} — todos os imports sao usados no corpo`, () => {
      const content = fs.readFileSync(path.resolve(file), 'utf-8');
      const importLines = content.match(/import\s+{([^}]+)}/g) || [];

      importLines.forEach(importLine => {
        const names = importLine
          .replace(/import\s+{/, '')
          .replace(/}/, '')
          .split(',')
          .map(n => n.trim().split(' as ').pop()!.trim())
          .filter(Boolean);

        const bodyStartIndex = content.indexOf(importLine) + importLine.length;
        const body = content.slice(bodyStartIndex);

        names.forEach(name => {
          expect(
            body.includes(name),
            `Import "${name}" em ${file} parece nao ser usado`
          ).toBe(true);
        });
      });
    });
  });
});
