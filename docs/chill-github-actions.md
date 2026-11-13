# Kích hoạt multiplayer bằng Cloudflare + GitHub + Vercel

Không cần VS Code, terminal cá nhân hoặc gửi token/Account ID cho Codex. Mã nằm trên nhánh **sprint-1-campus-map**, PR #1 vẫn mở. Workflow đã chuẩn bị nhưng **chưa được chạy**; chưa có endpoint công khai được xác nhận. Thiếu endpoint, Preview vẫn hiện **Chưa kết nối realtime**.

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

## 3. Điểm chặn của GitHub: workflow phải có trên nhánh mặc định

Repository hiện có nhánh mặc định **main**. Workflow mới chỉ có trên **sprint-1-campus-map**. Theo [quy tắc GitHub](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow), `workflow_dispatch` phải có trên nhánh mặc định trước khi chạy thủ công. Chọn branch trên trang Code, mở link file workflow hoặc gọi API không bỏ qua được yêu cầu này. Khi chưa xử lý, nút **Run workflow** có thể không xuất hiện.

Codex **không** sửa main, đổi nhánh mặc định hoặc chạy workflow. Không có quy trình bấm Run hoàn chỉnh nếu đồng thời cấm cả đưa workflow vào nhánh mặc định và đổi nhánh mặc định.

**Phương án không merge, do chủ repository chủ động quyết định:** tạm đặt `sprint-1-campus-map` làm nhánh mặc định. Thao tác này cần quyền admin và ảnh hưởng nhánh mặc định cho PR mới; không đổi base `main` của PR #1 đang tồn tại.

1. Trước tiên vào Vercel project → **Settings → Environments → Production → Branch Tracking** (giao diện cũ: **Settings → Git → Production Branch**), xác nhận/đặt **Production Branch = main** một cách rõ ràng. Nếu không xác nhận được, **dừng**, không đổi default branch. Đổi default branch không phải quyền cho phép deploy Vercel Production. Không push commit mới trong khoảng đổi tạm; kiểm tra deployment target vẫn là Preview.
2. GitHub repository → **Settings → General → Default branch** → nút đổi → chọn `sprint-1-campus-map` và xác nhận. Đây là thay đổi thiết lập do bạn quyết định, không phải merge. Không đổi branch/base PR #1.
3. Làm bước4 ngay bên dưới. Khi workflow đã hoàn thành, đổi **Default branch** về **main** tại cùng trang. Vercel Production Branch vẫn giữ **main**. Lần deploy Worker tiếp theo cần lặp bước đổi tạm nếu workflow vẫn chưa nằm trên main.

Nếu không muốn/không được phép đổi default branch, hãy **dừng tại đây**: workflow và secrets đã sẵn sàng, nhưng cần quyết định riêng về việc đăng ký workflow trên default branch. Không merge PR #1 chỉ để làm xuất hiện nút Run.

## 4. Chạy workflow thủ công trên GitHub

1. Repository → **Actions**, bật Actions nếu đang bị tắt theo chính sách repository. Chọn **Deploy Chill realtime (manual)** ([file workflow](../.github/workflows/deploy-chill-realtime.yml)). Không dùng Cloudflare Workers Builds kết nối Git tự deploy: deployment này chỉ do GitHub Actions thủ công.
2. **Run workflow → Use workflow from: sprint-1-campus-map**.
3. Đọc mô tả rồi tích `confirm_deploy`, bấm **Run workflow**. Checkbox mặc định tắt. Chọn sai branch hoặc không xác nhận sẽ bỏ qua job; không triển khai.
4. Mở lần chạy vừa tạo. Các bước lint/typecheck/tests/build/dry-run phải xanh trước **Deploy Cloudflare Worker**. Workflow dùng Wrangler đã khóa trong package-lock, không cài bản latest tự do. Nó chỉ deploy Worker; không có lệnh deploy Vercel, merge hay nâng cấp gói.
5. Trong log **Deploy Cloudflare Worker**, sao chép URL dạng `https://vnu-chill-realtime.<subdomain-cua-ban>.workers.dev`. Cũng có thể lấy ở Cloudflare → **Workers & Pages → vnu-chill-realtime → Settings → Domains & Routes**. Không sao chép link Dashboard hoặc URL version/preview Worker. Worker config bật `workers_dev`, tắt version preview URL.
6. Mở URL đó thêm `/health` trong trình duyệt. Thành công sẽ hiện JSON có `service: "VNU Chill realtime"` và `protocol: 1`. Trang gốc `/` có thể trả404; đó không phải lỗi deploy. Health thành công chưa chứng minh WebSocket hoạt động; phải làm bước6.
7. Nếu đã đổi default branch, đổi về **main** sau khi job hoàn thành như bước3.

Workflow **chỉ có `workflow_dispatch`**, không deploy khi push, PR hoặc chạy Validate CI. Những lần push vẫn có thể kích hoạt **Vercel Preview** qua tích hợp có sẵn; đó không phải deploy Worker hoặc Vercel Production.

## 5. Nối Vercel Preview với Worker

1. Vercel → project **vnu-life-map → Settings → Environment Variables → Add**.
2. Key: **`NEXT_PUBLIC_CHILL_REALTIME_URL`**. Value: origin Worker vừa lấy, ví dụ `https://vnu-chill-realtime.ten-cua-ban.workers.dev` — **không** có `/health`, đường dẫn, query, token hoặc thông tin đăng nhập. Đây là URL công khai, không phải secret. Không bao giờ thêm Cloudflare token/Account ID vào biến này.
3. Chỉ chọn **Preview**; nếu giao diện hỗ trợ giới hạn branch thì chọn **sprint-1-campus-map**. Bỏ chọn Production và Development. **Save**.
4. **Deployments** → chọn deployment có branch `sprint-1-campus-map`, target **Preview** → menu **Redeploy**. Biến NEXT_PUBLIC được gắn lúc build, nên chỉ Save không đủ. Không **Promote to Production**, không chọn deployment của main. Nếu cache làm giữ giá trị cũ, redeploy và bỏ **Use existing Build Cache**.
5. Mở đúng alias:

   **https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app/chill/together**

`ALLOWED_ORIGINS` đã cấu hình chính xác alias này (không path/trailing slash), không có wildcard hoặc localhost trong cấu hình public. Đừng dùng URL deployment bất biến khác khi thử: origin khác sẽ bị403. Nếu cần alias khác trong tương lai, sửa allowlist bằng commit và tự chạy lại workflow. Không bỏ kiểm tra TLS hoặc mở origin `*` để chữa lỗi.

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
| Không có Run workflow | Quy tắc default branch ở bước3; workflow đang bị disable; quyền ghi repository |
| Job skipped | Đúng branch và đã tích confirm_deploy chưa? |
| Missing secret / invalid account ID | Đúng tên repository secret, không dùng Variables/Zone ID; không dán giá trị vào log/chat |
| Cloudflare authentication/permission denied | Token chưa hết hạn, scope đúng account và Workers Scripts Edit; Account ID khớp. Không thêm quyền Admin/Global API Key để thử |
| Cloudflare yêu cầu workers.dev subdomain | Cấu hình Your subdomain trong Dashboard, sau đó tự chạy lại workflow |
| Yêu cầu trả phí/legacy Durable Object | Dừng; giữ SQLite migration `new_sqlite_classes`, kiểm tra Workers Free. Không chọn nâng cấp |
| Health200 nhưng không kết nối phòng | Đúng Preview alias/allowlist, Worker không có Access login/challenge, không dùng URL có `/health`; thử mạng khác và trình duyệt chuẩn |
| Chưa kết nối realtime | Biến đúng tên, scope Preview và branch, redeploy sau Save; mở deployment mới |
| Quá giới hạn miễn phí/429 | Dừng thử, đóng các phòng, chờ reset quota; không tự nâng cấp |

Theo dõi **Workers & Pages → Metrics/Usage** và hạn mức [Workers](https://developers.cloudflare.com/workers/platform/limits/), [SQLite DO Free](https://developers.cloudflare.com/durable-objects/platform/pricing/). Chọn Free không có nghĩa không giới hạn; vòng lặp realtime giữ DO hoạt động khi có kết nối. GitHub Actions cũng chịu hạn mức tài khoản/repository, nhất là repository riêng tư; không bật overage trả phí. Để dừng public realtime, Cloudflare → Worker → Settings → Domains & Routes → disable `workers.dev`, và bỏ env Preview/redeploy nếu cần. Thu hồi API token chỉ chặn deploy mới, **không** tắt Worker đã chạy.

## Phạm vi bảo mật và vận hành

Token chỉ có trên GitHub Secrets và bước deploy. Origin allowlist bảo vệ trình duyệt, không phải cơ chế xác thực chống mọi client Internet. Phòng mời là link khó đoán, không danh tính xác thực; tránh đăng link riêng công khai. Tên/vị trí chỉ giữ trong phiên, lời ước và tiến độ riêng không gửi lên server. Không thu license plate, thông tin sinh viên, camera/micro; không có card/payment integration. Phiên chung có thể reset khi Worker khởi động lại; tối đa4 người là mức đã test local.
