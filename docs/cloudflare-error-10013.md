# Cloudflare deploy lỗi10013 — phân tích và thao tác an toàn

## Kết quả kiểm tra

Lần chạy [43452879686](https://github.com/kaze0094/vnu-life-map/actions/runs/43452879686), commit8061e73, lỗi ở bước deploy Worker. Lint, typecheck,55 tests, build và Worker dry-run đã đạt. Secret có mặt và Account ID qua kiểm tra định dạng; điều này **không xác nhận** token có đúng scope hoặc account có entitlement phù hợp.

Log có mã10013 và thông báo chung “unknown error”, không có lý do permission cụ thể hoặc HTTP status của yêu cầu ghi. `Total Upload: 19.98 KiB` là kích thước bundle Wrangler chuẩn bị, **không chứng minh Cloudflare đã chấp nhận/lưu Worker**; cùng dòng đó cũng có trong dry-run không upload.

Nguồn Cloudflare công bố sự cố [Workers API availability](https://www.cloudflarestatus.com/incidents/e7ktq32gphhe), được đăng lúc22:31 ngày13/11/2026 (UTC+7), gần lỗi deploy lúc22:29. Thông báo nói khách hàng có thể gặp tăng lỗi5xx khi deploy Workers hoặc thao tác API khác. Tại thời điểm kiểm tra, sự cố ở trạng thái **monitoring**, sau thông báo đã áp dụng bản sửa lúc22:42. Đây là bằng chứng cho khả năng lỗi phía dịch vụ, **chưa đủ xác nhận** nguyên nhân duy nhất của request cụ thể. Sự cố startup trước đó [y03on2svrrxt](https://www.cloudflarestatus.com/incidents/y03on2svrrxt) đã resolved trước request lỗi; không gộp hai sự cố làm một.

## Cấu hình đã đối chiếu

| Mục | Kết quả |
| --- | --- |
| Worker entrypoint | Module có default handler và named export `ChillRoom extends DurableObject` |
| Binding | `STUDY_ROOMS` → `class_name: ChillRoom`, khớp source |
| First migration | `tag: v1`, `new_sqlite_classes: [ChillRoom]`; hợp lệ cho class SQLite mới |
| Migration khác | Không có `new_classes`, không trộn `exports` lifecycle config với migrations |
| compatibility_date | 2026-11-01, trước ngày deploy13/11; chưa có bằng chứng API từ chối ngày này |
| Public access | workers.dev bật, version preview URLs tắt; allowlist đúng alias Vercel Preview |
| Account/token | Chỉ lấy từ GitHub Secrets, không hardcode |

Không đổi tên class, đổi tag migration, xóa namespace hoặc hạ compatibility_date để chữa một lỗi không rõ lý do. Nếu account đã có Worker/class cùng tên với lịch sử storage khác thì phải kiểm tra riêng; local dry-run không thấy được lịch sử account.

## Quyền token tối thiểu

**Account → Workers Scripts → Edit**, scope **Specific account** đúng account chứa Worker, là quyền triển khai script và Durable Objects/migration trong cùng Worker. Không có quyền riêng “SQLite Durable Objects Edit” phải thêm cho cấu hình này. SQLite DO không phải dịch vụ D1: **không cần D1 Edit**, KV, R2, Zone/DNS, Workers Routes, Billing hoặc Admin.

Wrangler4.161.0 mô tả scope `workers_scripts:write` bao gồm scripts, durable objects, subdomains, triggers và tail data. Account ID đã được truyền bằng secret; các probes không cần thêm Account Settings Read để liệt kê account/plan. Đọc dữ liệu account có thể bị chặn theo scope hoặc chính sách; một probe không đọc được không tự động đồng nghĩa token sai.

Nguồn: [Cloudflare GitHub Actions authentication](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/), [class migrations](https://developers.cloudflare.com/durable-objects/reference/durable-object-class-migrations-legacy/), [SQLite/free plan](https://developers.cloudflare.com/durable-objects/platform/pricing/). Wrangler hiện vẫn hỗ trợ migrations array. Không chuyển sang cơ chế lifecycle khác chỉ để thử chữa10013.

**Chưa có bằng chứng cần bổ sung quyền.** Nếu token thiếu Workers Scripts Edit, chỉ thêm đúng quyền đó. Không tạo token toàn quyền hoặc Global API Key để thử. Token active chỉ chứng minh token chưa vô hiệu, không chứng minh quyền ghi hoặc account entitlement.

## Bạn thao tác trên Cloudflare Dashboard như sau

1. Mở [Workers API incident](https://www.cloudflarestatus.com/incidents/e7ktq32gphhe) và trang Cloudflare Status. Nếu vẫn investigating/identified/monitoring, chờ **resolved** và xác nhận Workers API hoạt động bình thường. Không đổi token/migration hoặc bấm Re-run trong lúc sự cố chưa ổn định.
2. Cloudflare Dashboard → chọn **đúng account** → **Workers & Pages**. Kiểm tra tên account đang chọn có khớp account mà bạn đã lấy ID để lưu vào GitHub Secret. Không cần gửi Account ID vào chat. Nếu nghi ngờ nhầm, tự sao chép lại Account ID và cập nhật đúng `CLOUDFLARE_ACCOUNT_ID` trong GitHub Settings → Secrets and variables → Actions.
3. Trong **Workers & Pages**, kiểm tra **Your subdomain** đã có workers.dev; nếu thiếu, dùng Set up/Change để chọn subdomain miễn phí. Kiểm tra email tài khoản đã được xác minh, nếu Dashboard có banner yêu cầu xác minh email thì làm theo email chính thức.
4. Kiểm tra gói Workers **Free** và trang **Durable Objects**. SQLite DO dùng được trong hạn mức Free. Nếu có yêu cầu xác nhận điều khoản miễn phí thì đọc trước khi xác nhận; nếu yêu cầu nâng cấp trả phí hoặc nhập phương thức thanh toán, **dừng**, không nâng cấp. Chỉ việc nhìn thấy menu DO chưa chứng minh account đã được cấp đủ entitlement.
5. Trong Workers & Pages tìm `vnu-chill-realtime`. Nếu có, mở **Deployments** xem có bản deploy thành công hay chỉ lỗi; xem **Bindings/Settings** có STUDY_ROOMS không. Trong Durable Objects xem có namespace/class ChillRoom của Worker này không. **Không xóa namespace/Worker, không tạo namespace SQLite thủ công, không dùng Quick Edit để sửa code**, không đổi migration tag. Nếu có namespace cũ dùng KV hoặc Worker cùng tên không thuộc dự án, báo lại tình trạng đó để xử lý lịch sử migration riêng.
6. **My Profile → API Tokens** (hoặc trang Account API Tokens nếu bạn dùng account-owned token) → chọn token đã tạo → kiểm tra chưa hết hạn/vô hiệu, quyền **Account / Workers Scripts / Edit**, **Account Resources / Include / Specific account** đúng account. Nếu đã đúng, **giữ nguyên**. Nếu thiếu, chỉnh đúng quyền/scope này; nếu phải tạo token thay thế thì cập nhật GitHub Secret trực tiếp, không gửi token vào chat. Không cần thêm User Read/Account Settings/D1/Billing để chạy các probes.
7. Khi status đã resolved và các kiểm tra trên đều ổn, báo kết quả kiểm tra không nhạy cảm cho Codex. **Chưa bấm Re-run jobs và chưa tạo marker commit.** Chỉ sau khi bạn xác nhận triển khai lại, Codex mới được tạo/push một commit kích hoạt mới trên nhánh sprint. Re-run lần chạy cũ sẽ dùng workflow cũ, không có chẩn đoán mới.
8. Nếu vẫn10013 sau lần thử được bạn cho phép, giữ link Actions run, thời gian, numeric error codes/HTTP statuses từ diagnostics và incident link. Gửi thông tin đã che bí mật qua Cloudflare Dashboard → Support/Help hoặc issue workers-sdk phù hợp. Không đính kèm token, account ID, ảnh bảng Secrets, response JSON thô hoặc toàn bộ debug log Wrangler. Không thể cam kết có một nút Dashboard chữa10013 khi API không trả lý do cụ thể.

Không đổi default branch, merge main, deploy Vercel Production hoặc nâng gói để xử lý lỗi này.

## Chẩn đoán mới trong workflow

`Read-only Cloudflare preflight (sanitized)` chạy trước deploy trong lần kích hoạt **được cho phép sau này**. `Read-only diagnostics after a failed deploy (no retry)` chỉ chạy sau step deploy thất bại, không thử upload lại. Push chuẩn bị không có marker vẫn bỏ qua cả job deploy và các probes; Codex không có/mượn secrets để chạy probes account ngay bây giờ.

Script chỉ GET với timeout, không follow redirect và không retry request. Các probe:

- User-token verify; nếu không xác minh được thì thử endpoint account-token verify tương ứng để hỗ trợ cả hai loại token.
- Worker settings, Durable Object namespace listing và workers.dev subdomain.
- Status công khai (không gửi Authorization header).

Chỉ log thời điểm, tên probe cố định, HTTP status, mã lỗi số, boolean/null và link incident công khai đã kiểm tra định dạng. Không in URL account, token/account ID, tên account, namespace IDs, messages API, response bodies hoặc exception text. Không upload artifact debug log.

`token_active: null` nghĩa chưa xác định, không phải token sai. Worker/namespace chưa tồn tại (404) có thể bình thường trước deploy đầu. `migration_tag_matches_v1: null` nghĩa endpoint không cung cấp trường đủ dùng; không suy ra cần sửa migration. HTTP status ở probes là **request đọc riêng**, không phải HTTP status của request ghi deploy đã thất bại. Probes đọc thành công không chứng minh quyền ghi, hạn mức/entitlement hoặc sự cố đã phục hồi.

Dữ liệu runtime/provenance B2, real/demo isolation và UI giữ nguyên. Chưa có public multiplayer được xác nhận hoạt động.
