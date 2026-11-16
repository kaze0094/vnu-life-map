# UI/UX Astryx — 16/11/2026

Nhánh sprint-1-campus-map, tiếp tục PR#1; không rebuild dự án, merge, deploy Worker hoặc Vercel Production.

## Giao diện

- Astryx Heading/Text/Stack/Button và theme Life build sẵn, kế thừa Matcha0.7.16. Nền sáng ấm, accent xanh olive, phân cấp chữ rõ. Font hệ thống hỗ trợ tiếng Việt, không phụ thuộc Google Fonts; theme có CSS sẵn cho SSR.
- Homepage giữ13 tiện ích:3 mục đang dùng được hiển thị trước;10 mục sắp ra mắt nằm trong disclosure mở bằng bàn phím. Search có nút xóa, bộ lọc Homies/nhà xe/tất cả, lựa chọn map/list, số kết quả và nhãn nguồn rõ.
- Header có lối vào B2/Chill Space/gửi xe; nhãn nguồn, khảo sát, dữ liệu chờ xác minh và demo vẫn giữ ý nghĩa cũ. B2 tăng độ dễ đọc và vùng thao tác; nội dung chứng cứ không đổi.
- Chill Space có thẻ chọn chế độ rõ, cảnh3D vừa khung preview. Trong phòng, camera theo tỷ lệ khung nhìn; chỉ đổi góc nhìn, không đổi di chuyển/ghế/server. Avatar form có mô tả nickname, dấu chọn màu, input16px và vùng chạm lớn. Bảng cài đặt/người học đóng được bằng nút hoặc Escape, trả focus về nút mở. Có skip-link cho Chill Space.

## Những thứ giữ nguyên

Seeds/models/repository, tọa độ/B2/các ứng viên XT-P01–11, source dates và unknown counts; map attribution/tile policy/error recovery; fictional parking/booking isolation; WebSocket protocol, authority/seats/Pomodoro, heartbeat và reconnect. Không thêm người online giả hoặc kết nối hệ thống thẻ.

## Kiểm chứng

Các kiểm tra; test:private-ui cần server local đang chạy:

```sh
npm run lint
npm run typecheck
npm test
npm run test:diagnostics
npm run test:private-ui
npm run build
npm run astryx -- doctor --built .
```

Browser UI/axe (Next local đang chạy): `CHILL_CHROMIUM_PATH=/usr/bin/chromium npm run test:ui`; có thể bỏ biến này nếu Playwright đã cài Chromium. Script chỉ nhận localhost/127.0.0.1, không load-test Preview. Nó kiểm tra390px/1440px, các route map/Chill/B2, overflow, WCAG A/AA tự động, search/rỗng/reset/filter, disclosure, real/demo và Escape/focus trong phòng riêng. Báo cáo tự động không thay thế UAT với screen reader hoặc điện thoại thật.

Multiplayer local: chạy Worker với `npm run realtime:dev`, Next dev với public localhost endpoint theo docs/chill-realtime-setup.md; sau đó `npm run test:realtime` và `CHILL_CHROMIUM_PATH=/usr/bin/chromium npm run test:chill-browser`. Các lệnh này không deploy dịch vụ.

## Ảnh giao diện thực tế local

- [Homepage390px](screenshots/astryx-ui/home-390.png), [desktop](screenshots/astryx-ui/home-1440.png).
- [Chill Space390px](screenshots/astryx-ui/chill-390.png), [desktop](screenshots/astryx-ui/chill-1440.png).
- [Form avatar390px](screenshots/astryx-ui/private-390.png), [phòng riêng](screenshots/astryx-ui/private-room-390.png).
- [Homies B2](screenshots/astryx-ui/homies-390.png), [Nhà xe B2](screenshots/astryx-ui/parking-390.png).

Basemap OSM thực tế có thể bị mạng/chứng chỉ của môi trường kiểm thử chặn; ảnh map có thể hiển thị fallback/ghim trên nền trống. Không dùng ảnh map giả hoặc bỏ TLS. Danh sách, popup, nguồn và trang chi tiết vẫn dùng được. Các ảnh không chứng minh endpoint multiplayer công khai hoạt động.

## UAT còn cần trên thiết bị thật

- [ ] Chrome/Edge,390px hoặc điện thoại: search, map/list, disclosure, popup, B2 và nguồn; tải tile trên mạng có TLS tin cậy.
- [ ] Tab/Shift+Tab, skip-link, focus ring, Escape, zoom/reflow và screen reader tiếng Việt.
- [ ] Phòng riêng: timer/pause/resume, chỉnh/xóa lời nhắn, mood/mute; giảm chuyển động.
- [ ] Hai laptop qua endpoint công khai đã được chủ dự án cấu hình: A–G. Không đánh dấu cloud test từ kết quả local.

## Kết quả đã chạy

- Lint/typecheck: PASS;55 Vitest tests và4 diagnostic tests: PASS. Production build: PASS.
- `npm run test:ui` trên production local: PASS ở390px/1440px,18 trạng thái trang/panel được axe quét không có violation trong các rule WCAG A/AA đã chọn, không pageerror hoặc tràn ngang. Search/filter/rỗng/reset, disclosure10 mục disabled, real/demo, marker Enter → popup → trang B2, Escape/trả focus: PASS. Kiểm tra reflow320px thêm6 routes: PASS.
- `npm run test:private-ui`: PASS timer pause/resume/hoàn tất, cây tăng/lưu, lời nhắn lưu qua reload/xóa, audio opt-in, fullscreen toggle và Escape/focus; không mở socket phòng chung từ chế độ riêng. Test tăng thời gian chỉ mock Date, để RAF/timers chạy thật; không chứng minh người dùng thực sự học.
- `npm run test:realtime`:10 checks PASS trên workerd local thật, gồm cap4, người5 bị từ chối, ghế nguyên tử, clock, emote rate limit, resume/cleanup, invite close/expiry và allowlist.
- `npm run test:chill-browser`: A–G PASS trên hai BrowserContexts độc lập; clipboard/private invite/owner close và joystick390px → desktop cùng học cũng PASS, không pageerror. Test giữ input đến khi phiên bên kia quan sát được thay đổi; không giả positions hoặc phụ thuộc việc vẽ đủ frames trong800ms trên software WebGL. Có thể đặt `CHILL_SCREENSHOT_DIR=docs/screenshots/astryx-ui` để giữ ảnh QA cũ không bị ghi đè.
- Astryx doctor `--built .`:22 checks PASS,0 FAIL;1 cảnh báo audit về raw components/CSS/icons ở code hiện hữu. Đây là migration từng phần để giữ ứng dụng/B2/3D hoạt động, không tuyên bố mọi file đã chuyển hoàn toàn sang Astryx. Theme registry và CSS wiring được doctor chấp nhận.

Chỉ server local được chạy trong QA này. Không dùng Cloudflare Secrets, không deploy Worker/Production hoặc đổi thiết lập hosting.

Ảnh phòng chung từ các phiên kết nối local thật: [desktop A](screenshots/astryx-ui/together-desktop-a.png), [desktop B](screenshots/astryx-ui/together-desktop-b.png), [mobile](screenshots/astryx-ui/together-mobile.png). Không phải người online mẫu hoặc endpoint cloud.
