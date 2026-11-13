# QA Chill Space — 13 November 2026

## Đã kiểm thử thật ở local

Cloudflare Wrangler/workerd Durable Object local + Next.js; Chromium, hai BrowserContext độc lập (không dùng localStorage giả multiplayer). `scripts/test-chill-browser.mjs` có thể chạy lại.

| Bài | Kết quả |
| --- | --- |
| A: A vào trước, B vào sau, cả hai thấy nhau | PASS |
| B: di chuyển A hiển thị ở B | PASS |
| C: B vẫy tay, A nhận biểu cảm | PASS |
| D: giữ ghế độc quyền, bên kia không chọn trùng | PASS |
| E: cùng bàn, timestamp bắt đầu/kết thúc giống nhau, clock chênh tối đa1 giây | PASS |
| F: đóng B, avatar mất và ghế giải phóng | PASS |
| G: offline rồi online, giữ ID, không trùng avatar | PASS |
| Phòng riêng/link clipboard/chủ đóng phòng | PASS |
| Joystick390px → desktop thấy chuyển động, ngồi/học chung | PASS |

Test WebSocket trực tiếp `scripts/test-chill-realtime.mjs`:4 người thật được nhận, người5 bị từ chối; race giành ghế, rate limit biểu cảm, TTL heartbeat, đóng/hết hạn phòng, Origin không hợp lệ, resume đều PASS. Đây là tải local, không phải chứng nhận tải cloud.

My Chill Space: đã kiểm tra3D, ngồi/đứng, Pomodoro pause/resume/hoàn tất, lưu cây qua reload, sửa/xóa lời ước, âm thanh opt-in, fullscreen, mobile390px/menu/mood, không tràn ngang. Test hoàn tất dùng clock điều khiển của browser để không chờ1 phút; không chứng minh người dùng đã học. Không mở WebSocket phòng học từ chế độ riêng. Các lần chạy browser không có pageerror; thư viện renderer có thể ghi cảnh báo riêng.

## UAT nhóm trước khi trình diễn công khai

- [ ] Chrome/Edge desktop và điện thoại thật: homepage → B2/map → Chill, back/forward,390px không tràn ngang, xoay/zoom/fullscreen/joystick rõ.
- [ ] Map tải tile có OSM attribution; khi mạng tile lỗi, dùng list/details; phục hồi mạng xóa cảnh báo phù hợp. Không tắt TLS.
- [ ] Search/filter, trạng thái rỗng; B2 vẫn giữ nguồn/ngày/điều kiện thẻ;98 ghế không biến thành công suất; không có số chỗ xe trống suy từ khảo sát.
- [ ] My Chill:25/5,50/10,tùy chỉnh; pause/resume/hủy không tăng cây, hoàn tất chỉ tăng1 lần; lời ước lưu riêng/xóa; tắt âm mặc định; giảm chuyển động.
- [ ] Preview thiếu endpoint: **Chưa kết nối realtime**, không avatar người khác giả.
- [ ] Sau cấu hình endpoint: chạy lại A–G trên hai laptop thật, cùng link phòng; kiểm tra25 và50 phút, nghỉ, rời phòng, đóng link.
- [ ] Vercel Preview truy cập không yêu cầu đăng nhập, commit đúng nhánh; không promote Production.

## Ảnh chụp local thực tế

- [Welcome desktop](screenshots/chill-space/welcome-desktop.png), [mobile](screenshots/chill-space/welcome-mobile.png)
- [My Chill desktop](screenshots/chill-space/private-desktop.png), [mood/cây](screenshots/chill-space/private-rain-tree-desktop.png), [mobile](screenshots/chill-space/private-mobile.png)
- [Study Together A](screenshots/chill-space/together-desktop-a.png), [B](screenshots/chill-space/together-desktop-b.png), [mobile](screenshots/chill-space/together-mobile.png)

Các ảnh Study Together dùng hai kết nối thật tới server local, không phải endpoint công khai. Chưa kiểm thử hai điện thoại vật lý hay hiệu năng cloud; giới hạn phòng4 người. Endpoint công khai vẫn cần chủ dự án kích hoạt theo [hướng dẫn](chill-realtime-setup.md). Không tích hợp thẻ, realtime bãi xe, Supabase hay dịch vụ trả phí.

## Kiểm tra cuối cùng

- `npm run lint`: PASS.
- `npm run typecheck`: PASS cả Next.js và Worker.
- `npm test`: PASS55 tests/9 files (39 cũ +16 Chill).
- `npm run build`: PASS Next.js16 production; các route cũ và3 route Chill được tạo thành công.
- `npm run realtime:check`: PASS bundle/migration dry-run, không deploy cloud.
- Production local không biến endpoint:10 route đại diện trả200, không pageerror; Study Together ghi rõ chưa kết nối,0 người giả. Tắt WebGL chủ động: fallback hiển thị.
- [Ảnh production local chưa cấu hình endpoint,390px](screenshots/chill-space/preview-unconfigured-mobile.png).

Kiểm thử tương tác map/tile trên thiết bị thật và endpoint cloud sau cấu hình vẫn là UAT chưa hoàn thành; các kết quả local không được dùng để đánh dấu những mục đó đã đạt.

## Bổ sung: chuẩn bị deploy Worker bằng GitHub Actions — 13 November 2026

- Review Worker: allowlist exact-origin, hash token server-side, seat authority/heartbeat cleanup vẫn giữ nguyên; không sửa logic realtime hoặc dữ liệu campus.
- `.github/workflows/deploy-chill-realtime.yml`: chỉ `workflow_dispatch`, checkbox xác nhận mặc định tắt, khóa repository/branch, `contents: read`, checkout đúng SHA, action references pin SHA, token chỉ trong bước kiểm tra secrets và deploy. Không có push/PR deploy, merge, Vercel deploy hoặc nâng cấp gói.
- `actionlint 1.7.12`: PASS cho cả workflow Validate hiện có và workflow mới (binary official release, checksum verified).
- `npm run lint`, `npm run typecheck`, `npm test` (55/55), `npm run build`: PASS sau sửa cấu hình.
- `npm run realtime:check`: PASS dry-run, SQLite DO binding/migration và origin Preview đúng; không gọi deploy cloud.
- Actual local workerd với cấu hình public: exact Preview Origin upgrade101; localhost và origin khác403; health200. Script local dev override vẫn chạy10 smoke checks WebSocket thật PASS (4 người, giới hạn người5, ghế, clock, rate limit, cleanup, resume, close/expiry, origin).
- **Chưa chạy workflow/deploy cloud**, chưa xác thực token hoặc account của chủ dự án; chưa đổi default branch. GitHub API xác nhận default branch hiện là `main`, trong khi workflow mới chỉ nằm trên nhánh sprint. Đây là prerequisite còn chặn dispatch; [hướng dẫn](chill-github-actions.md) giải thích phương án owner chủ động đổi default branch tạm, với Vercel Production Branch giữ `main`, hoặc dừng nếu không cho phép.
- Sau owner deploy phải chạy lại A–G trên hai laptop/endpoint công khai; kết quả local không thay thế bước này.
