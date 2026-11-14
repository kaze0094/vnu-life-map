# Astryx hỗ trợ UI/UX

Đã thêm skill Astryx từ repository chính thức Meta vào `.agents/skills/astryx/SKILL.md`, kèm nguồn snapshot và giấy phép MIT. `AGENTS.md` chỉ đường cho các phiên Codex tiếp theo. Đây là skill theo repository, không phải cài plugin vào toàn bộ tài khoản ChatGPT.

CLI và core0.7.16 được khóa trong devDependencies/package-lock để tra cứu component, layout và theme cùng phiên bản. Node22.13+ cho tooling. Chưa import Astryx CSS/theme/provider vào ứng dụng, chưa chạy init hoặc thay thế giao diện hiện có.

Bạn không cần terminal cá nhân. Có thể yêu cầu Codex:

> Dùng skill Astryx đã cài để cải thiện UI/UX VNU Chill Space, ưu tiên mobile390px, bố cục, màu sắc, typography và accessibility. Giữ nguyên bản đồ/B2, nhãn nguồn, dữ liệu thật/demo và multiplayer. Tiếp tục PR#1, không deploy Worker hoặc Production.

Codex có thể tra cứu bằng các lệnh sau trong môi trường của mình:

```sh
npm run astryx -- search 'mobile navigation'
npm run astryx -- component Button
npm run astryx -- docs tokens
```

Khi thực hiện UI thật, xem hướng dẫn init/tích hợp Next.js/Tailwind của đúng phiên bản trước, áp dụng từng khu vực và kiểm tra thay đổi scaffold. Không ghi đè dự án bằng template. Skill tự nó không làm website thay đổi hoặc bảo đảm thiết kế đẹp; cần triển khai và kiểm thử giao diện sau đó.

Nguồn: [meta/astryx](https://github.com/meta/astryx), [skill upstream đã pin](https://github.com/meta/astryx/blob/e364afc958609c990d42514b8927a6ef54b86b00/plugins/astryx/skills/astryx/SKILL.md).

Đã xác nhận: CLI search/mobile navigation, component Button và docs tokens đều đọc được; lint, typecheck,55 tests ứng dụng +4 tests chẩn đoán và production build đạt sau khi thêm công cụ. Không có marker kích hoạt Worker trong commit cài skill.
