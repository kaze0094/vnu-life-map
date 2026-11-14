# Kích hoạt Study Together trên Preview

Lần kích hoạt8061e73 thất bại với lỗi10013; chưa có endpoint công khai được xác nhận triển khai thành công. [Phân tích và kiểm tra Dashboard](cloudflare-error-10013.md). Không cấu hình endpoint: UI ghi **Chưa kết nối realtime**, không dựng người online giả. My Chill Space vẫn dùng độc lập.

## Local — không tài khoản cloud

Node 22, `npm ci`. Hai terminal:

```sh
npm run realtime:dev
NEXT_PUBLIC_CHILL_REALTIME_URL=http://127.0.0.1:8787 npm run dev
```

Mở http://localhost:3000/chill/together trong hai phiên trình duyệt độc lập. Không dùng địa chỉ loopback này cho điện thoại hay Preview. Kiểm thử:

```sh
npm run test:realtime
npx playwright install chromium
npm run test:chill-browser
```

Nếu Chromium đã cài: `CHILL_CHROMIUM_PATH=/usr/bin/chromium npm run test:chill-browser`. Các script chỉ cho phép mục tiêu local. Test browser cần cả Next dev có biến trên và Worker local đang chạy.

## Công khai — GitHub Actions, không cần terminal cá nhân

Dùng [hướng dẫn Dashboard bằng tiếng Việt](chill-github-actions.md): tạo token Workers Scripts Edit giới hạn đúng account, lưu hai GitHub Actions Secrets, rồi xác nhận để Codex tạo/push một empty commit có marker nguyên văn `[deploy-chill-realtime]`. Workflow **Deploy Chill realtime (opt-in push)** chỉ deploy khi HEAD của push trên nhánh sprint có marker; push thường bỏ qua toàn bộ deploy job. Giữ nguyên default branch main, không dùng workflow_dispatch hoặc pull_request. Đã có một lần kích hoạt thất bại; không tạo commit kích hoạt mới nếu chưa có xác nhận triển khai lại.

Cấu hình public đã giới hạn `ALLOWED_ORIGINS` đúng `https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app`. Script `npm run realtime:dev` chỉ override allowlist cho localhost trong môi trường local; không đưa localhost lên Worker public. Worker bật URL workers.dev, tắt version preview URLs. Không có token/Account ID trong mã nguồn.

Sau deploy thủ công, đặt origin Worker vào `NEXT_PUBLIC_CHILL_REALTIME_URL` **chỉ Vercel Preview** và redeploy branch. Bước cloud chưa thành công; không cần gửi bí mật cho trợ lý. URL http/ws loopback chỉ chấp nhận ở development, build production từ chối URL đó.

## Giới hạn và vận hành

Một Durable Object điều phối mỗi phòng: tối đa **4 người**, 2 bàn × 2 ghế. Đã kiểm thử 4 socket thật và hai trình duyệt render đồng thời; chưa benchmark nhiều phòng hay thiết bị thật. Không công bố 12–20 người. Gửi vị trí khoảng9Hz, snapshot tối đa10Hz (idle1Hz), interpolation client. Heartbeat4 giây, dọn người vắng sau15 giây. Giành ghế xử lý nguyên tử trên server. Biểu cảm cách nhau2,5 giây, biến mất sau3,5 giây. Payload tối đa2048, chặn spam35 tin/giây.

Phòng riêng là link khó đoán, không phải xác thực mạnh. Link mới phải được mở trong5 phút, phòng sống2 giờ; chủ phòng đóng sẽ vô hiệu link. Không có danh bạ phòng riêng. Token resume ngẫu nhiên chỉ trong bộ nhớ tab, không lộ trong snapshot; reconnect cùng tab không nhân đôi avatar. Reload tab có thể tạo danh tính mới sau khi phiên cũ được dọn.

Tên/ngoại hình/vị trí hiện diện chỉ giữ trong bộ nhớ phiên; không lưu lời ước hoặc tiến độ cá nhân lên Worker. Metadata vòng đời phòng và hash chủ phòng lưu tại DO; không thu thập thông tin sinh viên, camera, micro, GPS hay chat tự do. Nhà cung cấp vẫn có thể xử lý metadata mạng theo chính sách riêng. Đồng hồ/ghế/tiến độ chung không bền qua khởi động lại Worker; không hứa lưu phiên lâu dài. Vercel chỉ host Next.js, không giả WebSocket bằng bộ nhớ serverless.
