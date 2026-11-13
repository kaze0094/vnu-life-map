# Kích hoạt Study Together trên Preview

Chưa có endpoint công khai được triển khai trong phiên làm việc này. Không cấu hình endpoint: UI ghi **Chưa kết nối realtime**, không dựng người online giả. My Chill Space vẫn dùng độc lập.

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

## Công khai — các bước chủ dự án thực hiện

1. Dùng tài khoản Cloudflare của bạn, kiểm tra Workers Free và SQLite Durable Objects có sẵn trong hạn mức miễn phí. Không nâng cấp gói hay bật dịch vụ tính phí. Xem hạn mức hiện hành: https://developers.cloudflare.com/durable-objects/platform/pricing/ . Không có cam kết miễn phí vô hạn.
2. Chạy `npx wrangler login` trên máy của bạn; xác thực trong trình duyệt. Không gửi token vào cuộc trò chuyện hoặc commit token. Chỉnh `realtime/wrangler.jsonc`: tên Worker duy nhất nếu cần, `ALLOWED_ORIGINS` thành danh sách origin chính xác, phân cách dấu phẩy. Ví dụ Preview nhánh hiện tại: `https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app`. Không thêm đường dẫn, không wildcard. Nếu dùng URL deployment bất biến khác, thêm chính xác origin đó.
3. Tự chạy `npx wrangler deploy --config realtime/wrangler.jsonc`. Lệnh này triển khai **Worker riêng**, không Vercel Production. Binding/migration SQLite đã có trong config. Ghi lại origin trả về dạng `https://vnu-chill-realtime.<your-subdomain>.workers.dev`; kiểm tra `/health`. Không cần API key client.
4. Trong Vercel project hiện có → Settings → Environment Variables, thêm **chỉ môi trường Preview**: `NEXT_PUBLIC_CHILL_REALTIME_URL=https://<worker>.<subdomain>.workers.dev`. Giá trị chỉ là origin công khai, không path/query/credentials; `https` hoặc `wss`. Không thêm secret dưới tiền tố NEXT_PUBLIC. Redeploy deployment của nhánh `sprint-1-campus-map` để bundle nhận giá trị mới. Không merge, promote Production hoặc tạo dự án mới. Framework Next.js, root repository, install `npm ci`, build `npm run build`, output mặc định, Node22.
5. Mở Preview ở hai laptop, tạo phòng riêng, sao chép link mời và chạy A–G trong [QA](qa-chill-space.md). Kiểm tra Deployment Protection cho Preview theo chính sách nhóm để người thử không cần đăng nhập Vercel. Nếu chưa kết nối, kiểm tra origin chính xác, URL endpoint và redeploy sau thay env; không bỏ kiểm tra TLS.

Các bước cloud trên **chưa được thực hiện**. Không cần cung cấp bí mật cho trợ lý. Endpoint http/ws loopback chỉ được chấp nhận ở development; build production từ chối URL đó.

## Giới hạn và vận hành

Một Durable Object điều phối mỗi phòng: tối đa **4 người**, 2 bàn × 2 ghế. Đã kiểm thử 4 socket thật và hai trình duyệt render đồng thời; chưa benchmark nhiều phòng hay thiết bị thật. Không công bố 12–20 người. Gửi vị trí khoảng9Hz, snapshot tối đa10Hz (idle1Hz), interpolation client. Heartbeat4 giây, dọn người vắng sau15 giây. Giành ghế xử lý nguyên tử trên server. Biểu cảm cách nhau2,5 giây, biến mất sau3,5 giây. Payload tối đa2048, chặn spam35 tin/giây.

Phòng riêng là link khó đoán, không phải xác thực mạnh. Link mới phải được mở trong5 phút, phòng sống2 giờ; chủ phòng đóng sẽ vô hiệu link. Không có danh bạ phòng riêng. Token resume ngẫu nhiên chỉ trong bộ nhớ tab, không lộ trong snapshot; reconnect cùng tab không nhân đôi avatar. Reload tab có thể tạo danh tính mới sau khi phiên cũ được dọn.

Tên/ngoại hình/vị trí hiện diện chỉ giữ trong bộ nhớ phiên; không lưu lời ước hoặc tiến độ cá nhân lên Worker. Metadata vòng đời phòng và hash chủ phòng lưu tại DO; không thu thập thông tin sinh viên, camera, micro, GPS hay chat tự do. Nhà cung cấp vẫn có thể xử lý metadata mạng theo chính sách riêng. Đồng hồ/ghế/tiến độ chung không bền qua khởi động lại Worker; không hứa lưu phiên lâu dài. Vercel chỉ host Next.js, không giả WebSocket bằng bộ nhớ serverless.
