# Kích hoạt multiplayer bằng Cloudflare + GitHub + Vercel

Không cần VS Code, terminal cá nhân hoặc gửi token/Account ID cho Codex. Mã nằm trên nhánh **sprint-1-campus-map**, PR #1 vẫn mở. Workflow push có điều kiện đã chuẩn bị; **chưa kích hoạt job deploy**; chưa có endpoint công khai được xác nhận. Thiếu endpoint, Preview vẫn hiện **Chưa kết nối realtime**.

## 1. Kiểm tra tài khoản miễn phí và tạo API Token

1. Trong Cloudflare Dashboard, chọn đúng account đang có **Workers & Pages** và **Durable Objects**. Kiểm tra Workers **Free** và SQLite Durable Objects khả dụng trong gói này. Workflow dùng `new_sqlite_classes`, không dùng DO kiểu cũ yêu cầu nâng cấp. Không bật Workers Paid, không thêm thẻ thanh toán chỉ để làm bước này. Nếu Cloudflare yêu cầu nâng cấp, dừng và báo lại thông báo lỗi (không gửi bí mật).
2. Trong **Workers & Pages**, xem **Your subdomain**. Nếu chưa có, dùng **Set up / Change** để chọn subdomain `workers.dev` miễn phí. Không cần tên miền riêng, Pages project, KV, R2 hoặc Worker Hello World. Worker `vnu-chill-realtime` và DO sẽ được tạo bởi workflow. Nếu đã có Worker khác cùng tên mà không thuộc dự án này, dừng để tránh ghi đè.
3. Mở ảnh đại diện Cloudflare → **My Profile → API Tokens → Create Token → Create Custom Token**. Đặt tên dễ nhận biết, ví dụ `vnu-chill-github-deploy`.
4. Trong **Permissions**, chỉ thêm **Account → Workers Scripts → Edit**. Đây là quyền deploy script/binding/migration Durable Object của Worker này. Không cần quyền Zone/DNS/Workers Routes, KV, R2, thanh toán, User Details hay Memberships; Account ID được truyền sẵn nên không cần tra cứu danh sách account. Không dùng Global API Key. Nếu Dashboard dùng chữ **Write** cho quyền này thì đó là quyền ghi tương ứng.
5. **Account Resources → Include → Specific account → account của bạn**, không chọn tất cả account. Cloudflare giới hạn quyền này theo account, không theo riêng một tên Worker; vì vậy chỉ lưu token cho repository tin cậy. Chọn ngày hết hạn phù hợp sau kỳ thi; token có thể thu hồi bất kỳ lúc nào. Không đặt bộ lọc IP theo laptop của bạn: workflow chạy trên runner GitHub có IP thay đổi.
6. **Continue to summary → Create Token**. Sao chép giá trị một lần và lưu trực tiếp vào GitHub Secret ở bước2. Không dán vào issue/PR, file, ảnh chụp hoặc cuộc trò chuyện. Đóng trang sau khi lưu; nếu lộ token, revoke rồi tạo lại.

Account API Tokens với cùng quyền/account scope cũng dùng được nếu bạn chọn luồng đó; không cần tạo cả hai loại token.

## 2. Lấy Account ID và lưu GitHub Secrets

- Cloudflare account home → menu ba chấm của account → **Copy account ID**, hoặc Workers & Pages → thông tin account bên phải → **Account ID**. Đây là chuỗi32 ký tự hex; không dùng Zone ID. Không cần gửi giá trị này vào chat.
- Mở repository [kaze0094/vnu-life-map](https://github.com/kaze0094/vnu-life-map) → **Settings → Secrets and variables → Actions → Secrets → New repository secret**.
- Tạo đúng hai tên, mỗi tên một secret:

| Name | Secret |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Token vừa tạo |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID vừa sao chép |

Không tạo chúng dưới **Variables**, không thêm vào Vercel và không đặt tiền tố `NEXT_PUBLIC_`. Workflow chỉ đưa chúng vào bước kiểm tra có giá trị và bước deploy; không in giá trị. GitHub chỉ cấp `contents: read`; không có quyền merge hoặc ghi repository.

## 3. Điều kiện triển khai — giữ nguyên nhánh mặc định main

Workflow **Deploy Chill realtime (opt-in push)** chỉ nhận sự kiện **push** trên `sprint-1-campus-map`. Không cần nút Run workflow, không dùng `workflow_dispatch`, không đổi default branch và không đưa workflow vào main.

Một job `gate` rất nhỏ đọc file event của GitHub, không checkout mã, không lấy secrets. Job `deploy` chỉ được bắt đầu khi **HEAD commit của push** chứa nguyên văn marker **`[deploy-chill-realtime]`** trong subject hoặc body. Marker phân biệt chữ hoa/thường: `[DEPLOY-CHILL-REALTIME]`, thiếu ngoặc, khác dấu hoặc chỉ nằm trong commit trước HEAD đều không đạt. Không nội suy commit message vào shell.

Push thông thường: `gate` chạy để xác nhận, còn **toàn bộ job deploy hiển thị Skipped** — không kiểm tra secrets, không cài dependencies, không chạy Wrangler. Push main/nhánh khác và pull_request không kích hoạt workflow này. Workflow Validate hiện có vẫn kiểm tra CI riêng; Vercel có thể tự build **Preview** từ push như trước.

## 4. Kích hoạt một lần sau khi bạn xác nhận

1. Hoàn tất hai GitHub repository Secrets ở bước2, kiểm tra Cloudflare account đang dùng Free và có workers.dev subdomain. Trong repository → **Actions**, bảo đảm Actions được bật theo chính sách repository.
2. Gửi Codex: **“Tôi đã thêm hai Cloudflare Secrets. Tôi xác nhận triển khai Worker. Hãy tạo và push đúng một commit rỗng có marker [deploy-chill-realtime] trên sprint-1-campus-map.”** Không gửi giá trị secrets. Trước xác nhận này, Codex chỉ commit workflow/tài liệu với message bình thường, không tạo marker commit.
3. Sau khi được yêu cầu, Codex sẽ tạo một empty commit và push nhánh sprint. Push đó là thao tác kích hoạt; bạn không cần VS Code/terminal hoặc đổi default branch. Không bật Cloudflare Workers Builds tự deploy theo Git.
4. GitHub → **Actions → Deploy Chill realtime (opt-in push)** → chọn lần chạy có đúng SHA của empty commit vừa tạo và event **push**. Nếu sidebar chưa hiện tên workflow, mở tab Actions danh sách **All workflows** của push mới. Không cần nút Run workflow.
5. Xác nhận `gate` xanh và `deploy` **chạy**, không Skipped. Trong `deploy`, kiểm tra các bước secrets, lint, typecheck, tests, production build và Worker dry-run đều xanh, sau đó **Deploy Cloudflare Worker** xanh. **Chỉ thấy workflow xanh chưa đủ:** push thường cũng có thể xanh với deploy bị bỏ qua.
6. Mở log **Deploy Cloudflare Worker**, tìm URL `https://vnu-chill-realtime.<subdomain-cua-ban>.workers.dev` và version/deployment ID Wrangler báo thành công. Có thể kiểm tra thêm Cloudflare → **Workers & Pages → vnu-chill-realtime → Deployments** đối chiếu lần deploy mới. URL cũng có ở **Settings → Domains & Routes**. Không lấy link Dashboard hoặc URL version/preview Worker.
7. Mở origin Worker thêm `/health` trong trình duyệt. Thành công: JSON có `service: "VNU Chill realtime"`, `protocol: 1`. Trang gốc `/` trả404 là bình thường. Health thành công chưa chứng minh multiplayer: tiếp tục bước5–6 bên dưới.

Mỗi push HEAD có marker có thể tạo một lần deploy; **Re-run jobs/force-push lại HEAD có marker cũng có thể deploy lại**. Đây không phải cơ chế exactly-once bền vững. Để kích hoạt một lần theo yêu cầu, chỉ tạo/push một empty commit và không re-run. Nếu thất bại, đọc log trước, xử lý nguyên nhân và xin xác nhận trước khi kích hoạt lại. Commit mới không có marker sau đó sẽ bỏ qua deploy, kể cả lịch sử chứa marker.

Không sửa Vercel Production Branch, default branch hoặc base PR #1. Workflow không merge, không deploy Vercel và không nâng cấp Cloudflare. Worker công khai vẫn chưa được kích hoạt ở lần chuẩn bị này.

## 5. Nối Vercel Preview với Worker

1. Vercel → project **vnu-life-map → Settings → Environment Variables → Add**.
2. Key: **`NEXT_PUBLIC_CHILL_REALTIME_URL`**. Value: origin Worker vừa lấy, ví dụ `https://vnu-chill-realtime.ten-cua-ban.workers.dev` — **không** có `/health`, đường dẫn, query, token hoặc thông tin đăng nhập. Đây là URL công khai, không phải secret. Không bao giờ thêm Cloudflare token/Account ID vào biến này.
3. Chỉ chọn **Preview**; nếu giao diện hỗ trợ giới hạn branch thì chọn **sprint-1-campus-map**. Bỏ chọn Production và Development. **Save**.
4. **Deployments** → chọn deployment có branch `sprint-1-campus-map`, target **Preview** → menu **Redeploy**. Biến NEXT_PUBLIC được gắn lúc build, nên chỉ Save không đủ. Không **Promote to Production**, không chọn deployment của main. Nếu cache làm giữ giá trị cũ, redeploy và bỏ **Use existing Build Cache**.
5. Mở đúng alias:

   **https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app/chill/together**

`ALLOWED_ORIGINS` đã cấu hình chính xác alias này (không path/trailing slash), không có wildcard hoặc localhost trong cấu hình public. Đừng dùng URL deployment bất biến khác khi thử: origin khác sẽ bị403. Nếu cần alias khác trong tương lai, sửa allowlist bằng commit thường, rồi xác nhận một đợt kích hoạt mới bằng marker. Không bỏ kiểm tra TLS hoặc mở origin `*` để chữa lỗi.

Nếu có màn hình đăng nhập Vercel/Cloudflare Access, kiểm tra protection của **Preview/Worker này** theo quyền và chính sách nhóm trước khi cho công chúng thử; không tắt bảo vệ của Vercel Production. Trong khi chưa nối được, UI phải ghi chưa kết nối/đang kết nối lại, không có avatar online giả.

## 6. Hai laptop cùng vào phòng — điều kiện nghiệm thu

Dùng hai laptop/trình duyệt độc lập, cùng alias ở bước5, đặt biệt danh khác nhau. Không cần tài khoản sinh viên.

1. **A:** laptop A chọn tạo phòng riêng, vào phòng rồi **Sao chép link mời**; laptop B mở link trong5 phút và tham gia. Cả hai thấy2 người thật, trạng thái **Đã kết nối realtime**.
2. **B:** A đi bằng WASD/mũi tên; B thấy A di chuyển và đổi hướng.
3. **C:** B gửi👋; A thấy biểu cảm trên B rồi tự biến mất.
4. **D:** A chọn ghế; B thấy ghế có người và không thể chọn trùng. Avatar tự đi đến ghế.
5. **E:** ngồi hai ghế cùng bàn, A bắt đầu25 hoặc50 phút; B chọn tham gia phiên bàn. Đồng hồ gần nhau (mục tiêu chênh tối đa1 giây), cùng chuyển sang nghỉ.
6. **F:** B đóng tab/rời phòng; A thấy B mất và ghế trống (có thể chờ khoảng15 giây khi mạng ngắt đột ngột).
7. **G:** B vào lại, tắt/bật mạng trong cùng tab; sau khi reconnect không có hai avatar B. Reload tab là phiên mới, khác với reconnect cùng tab.

Chỉ đánh dấu từng bài sau khi thực sự thử. Chụp ảnh hai màn hình không có token hoặc dữ liệu cá nhân. Giới hạn4 người/phòng; chưa chứng nhận tải cloud hoặc nhiều phòng. [QA local, giới hạn và ảnh](qa-chill-space.md).

## Xử lý lỗi bằng giao diện, không cần terminal

| Hiện tượng | Kiểm tra |
| --- | --- |
| Không có Run workflow | Bình thường: quy trình dùng push có marker, không dùng nút Run workflow |
| Job deploy Skipped | Bình thường với push thường; khi đã xác nhận triển khai, kiểm tra marker nguyên văn ở HEAD và đúng nhánh sprint |
| Không thấy lần chạy mới | Kiểm tra Actions được bật, đúng nhánh push và workflow đã được push; commit không dùng chỉ thị skip CI |
| Missing secret / invalid account ID | Đúng tên repository secret, không dùng Variables/Zone ID; không dán giá trị vào log/chat |
| Cloudflare authentication/permission denied | Token chưa hết hạn, scope đúng account và Workers Scripts Edit; Account ID khớp. Không thêm quyền Admin/Global API Key để thử |
| Cloudflare yêu cầu workers.dev subdomain | Cấu hình Your subdomain trong Dashboard, sau đó xác nhận kích hoạt lại theo bước4 |
| Yêu cầu trả phí/legacy Durable Object | Dừng; giữ SQLite migration `new_sqlite_classes`, kiểm tra Workers Free. Không chọn nâng cấp |
| Health200 nhưng không kết nối phòng | Đúng Preview alias/allowlist, Worker không có Access login/challenge, không dùng URL có `/health`; thử mạng khác và trình duyệt chuẩn |
| Chưa kết nối realtime | Biến đúng tên, scope Preview và branch, redeploy sau Save; mở deployment mới |
| Quá giới hạn miễn phí/429 | Dừng thử, đóng các phòng, chờ reset quota; không tự nâng cấp |

Theo dõi **Workers & Pages → Metrics/Usage** và hạn mức [Workers](https://developers.cloudflare.com/workers/platform/limits/), [SQLite DO Free](https://developers.cloudflare.com/durable-objects/platform/pricing/). Chọn Free không có nghĩa không giới hạn; vòng lặp realtime giữ DO hoạt động khi có kết nối. GitHub Actions cũng chịu hạn mức tài khoản/repository, nhất là repository riêng tư; không bật overage trả phí. Để dừng public realtime, Cloudflare → Worker → Settings → Domains & Routes → disable `workers.dev`, và bỏ env Preview/redeploy nếu cần. Thu hồi API token chỉ chặn deploy mới, **không** tắt Worker đã chạy.

## Phạm vi bảo mật và vận hành

Token chỉ có trên GitHub Secrets và bước deploy. Origin allowlist bảo vệ trình duyệt, không phải cơ chế xác thực chống mọi client Internet. Phòng mời là link khó đoán, không danh tính xác thực; tránh đăng link riêng công khai. Tên/vị trí chỉ giữ trong phiên, lời ước và tiến độ riêng không gửi lên server. Không thu license plate, thông tin sinh viên, camera/micro; không có card/payment integration. Phiên chung có thể reset khi Worker khởi động lại; tối đa4 người là mức đã test local.
