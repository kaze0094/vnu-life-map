# Astryx UI/UX trong VNU LIFE MAP

Skill Meta chính thức nằm tại `.agents/skills/astryx/SKILL.md`, có snapshot nguồn và giấy phép MIT. `AGENTS.md` đã được init cho Codex; đây là skill theo repository, không phải plugin trên toàn bộ tài khoản ChatGPT.

Giao diện hiện dùng Astryx Core/CLI0.7.16 và theme Life kế thừa Matcha, build thành CSS/module sẵn cho SSR. Core/theme là runtime dependencies; CLI là devDependency. Theme dùng font hệ thống để hỗ trợ tiếng Việt, không gọi Google Fonts. Next.js/Tailwind hiện có được giữ; thứ tự CSS layers được khai báo trước imports. Không cần StyleX build plugin mới.

Bạn không cần terminal cá nhân. Codex có thể dùng:

```sh
npm run astryx -- search 'mobile navigation'
npm run astryx -- component Button
npm run astryx -- docs layout
npm run theme:build
npm run astryx -- doctor --built .
```

Node22.13+ cho tooling. Khi chỉnh theme, sửa `src/themes/life/lifeTheme.ts`, build lại; không sửa trực tiếp CSS/JS generated. Đọc source/descriptor và hướng dẫn trong thư mục theme. Theme Matcha và skill có giấy phép MIT Meta; bản giấy phép được giữ trong thư mục skill.

Giữ app hiện tại và áp dụng components/blocks theo từng phần, không ghi đè các trang bằng template. Đã dùng `astryx build`/library reference, layout/component/theme/Tailwind docs để cải thiện existing pages. Xem [QA và ảnh hiện tại](ui-astryx-qa.md).

Nguồn: [meta/astryx](https://github.com/meta/astryx), [skill snapshot đã pin](https://github.com/meta/astryx/blob/e364afc958609c990d42514b8927a6ef54b86b00/plugins/astryx/skills/astryx/SKILL.md). UI changes không cho phép deploy Worker hoặc Production, sửa nhãn xác minh, trộn dữ liệu thật/demo hoặc giả người online.
