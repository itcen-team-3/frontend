import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      prettier: await import("eslint-plugin-prettier"),
    },
    rules: {
      // 정적 배포해서 Next.js 의 Image 태그 사용 안하기 때문에 규칙 off
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
    ignores: ["build/**", "public/**/*.{js,css}"],
  },
];

export default eslintConfig;
