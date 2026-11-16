# VNU LIFE MAP — Student-first final competition release

Ngày bàn giao: **13/11/2026** · Hạn thi: **15/11/2026**. Repository `kaze0094/vnu-life-map`, nhánh `sprint-1-campus-map`, PR #1. Tài liệu này thay phần mô tả giao diện/lịch/QA ở các bản 11–12/11; dữ liệu khảo sát và lịch sử nguồn vẫn được giữ.

## Tóm tắt sản phẩm

**Mở web → chọn tiện ích → xem bản đồ → chạm ghim → xem tình trạng → chỉ đường hoặc thử đặt chỗ.**

- Homepage hỏi “Hôm nay bạn muốn đi đâu?”, lưới 12 tiện ích, bản đồ ngay sau lưới. Homies/Nhà xe hoạt động; 10 mục còn lại hiện “Sắp ra mắt”, không mở trang rỗng hay ghim giả.
- Homies lọc riêng B2/C3/Đa năng; C1T hoặc địa điểm học tập khác không bị đổi thành Homies. C3/Đa năng vẫn chờ xác minh vị trí; tất cả bản ghi cũ và XT-P01–XT-P11 được giữ nguyên phạm vi xác minh.
- Popup/trang B2 ưu tiên số chỗ chưa biết, quy mô ghi nhận, giờ, điều kiện vào, phí và nút hành động. Nguồn/lịch sử nằm trong mục mở rộng thay vì phủ homepage.
- Homies: 98 ghế khảo sát, không phải giới hạn chính thức; chưa có số ghế trống trực tiếp. Giờ **06:45–20:00 theo chủ dự án cho prototype**, mang thẻ sinh viên ULIS, cán bộ kiểm tra ở cửa.
- Nhà xe: cổng chung đúng toạ độ khảo sát; khoảng 480 sức chứa vận hành, 5.000đ/lượt, nhận/trả thẻ. Không có đặt chỗ, giờ mở cửa chưa xác minh, không tính chỗ trống từ quan sát cũ.
- Chỉ đường mở công cụ bản đồ bên ngoài đến toạ độ có nguồn. Người dùng chọn điểm đi; ứng dụng không tự vẽ tuyến hoặc khẳng định lối vào Homies. Không bật geolocation, không gửi lịch sử vị trí của người dùng.
- Booking **DEMO** hoạt động trong trang Homies B2: chọn ngày/khung giờ, 1 ghế, xác nhận demo, huỷ, check-in/out, no-show, hết hạn và reset. Kho **3 chỗ giả lập/khung giờ**, một số lượt giữ chỗ giả có sẵn để thử đầy, hoàn toàn độc lập với 98 ghế thật.

## Đã làm / chưa làm

| Đã có trong prototype | Chưa có / không được ngụ ý |
| --- | --- |
| JSON có nguồn, bản đồ, lọc/tìm kiếm, trang chi tiết, chỉ đường ngoài | Số chỗ trống hoặc xe đang gửi trực tiếp |
| Mô phỏng đặt chỗ một trang, kho giả, kiểm trùng trong phiên | Giữ chỗ thật, xác nhận ULIS, chống trùng đa máy hoặc đồng bộ nhiều tab |
| Đồng hồ DEMO tiến bằng nút để thử no-show/hết hạn | Hệ thống vận hành tự động theo thời gian thực hoặc thông báo chính thức |
| Mô phỏng nhà xe hư cấu cũ, tách khỏi bản đồ thật | API thẻ/camera, ảnh biển số, đọc thẻ, backend, Supabase, thanh toán |
| Lưới 12 tiện ích biểu thị định hướng | Phòng học/căn tin/ATM/xe buýt có dữ liệu hay chức năng đã hoạt động |

Booking chỉ ở bộ nhớ component; tải lại/rời trang sẽ mất. Mỗi phiên chỉ một lượt đang hoạt động, không phải cơ chế xác thực sinh viên. Không thu tên, email, mã thẻ hoặc biển số. QR và staff dashboard chỉ có trong [đề xuất pilot](ulis-b2-pilot-plan.md), chưa được xây.

## Demo script — khoảng 2 phút 30 giây

| Thời gian | Thao tác | Lời trình bày gợi ý |
| --- | --- | --- |
| 0:00–0:20 | Homepage/lưới tiện ích | “VNU LIFE MAP bắt đầu từ câu hỏi: hôm nay bạn muốn đi đâu? Sinh viên chọn Homies hoặc nhà xe để thấy địa điểm ngay trên bản đồ. Các tiện ích khác được ghi rõ là sắp ra mắt.” |
| 0:20–0:45 | Chọn Homies → ghim B2 | “Nhóm khảo sát B2 ngày 11/11: đếm 98 ghế, chưa xác nhận sức chứa tối đa. Chưa có dữ liệu chỗ trống trực tiếp. Giờ dùng cho prototype là 06:45–20:00; sinh viên mang thẻ ULIS và được cán bộ kiểm tra.” |
| 0:45–1:30 | Đặt chỗ DEMO → ngày → đặt → tới giờ → check-in/out | “Phần đặt chỗ này là mô phỏng, không giữ chỗ thật. Kho ba chỗ giả lập độc lập với số ghế khảo sát. Luồng có chống đặt trùng trong phiên, chặn khung giờ đầy, huỷ, check-in, check-out và trả chỗ. Đây là cách thể hiện quy trình trước khi xin phép triển khai thật.” |
| 1:30–1:50 | Đặt lại, tăng thời gian để hiện no-show/hết hạn | “Đồng hồ demo cho thấy lượt không đến sẽ hết hạn giữ chỗ; lượt đã check-in cũng có trạng thái quá giờ. Pilot thật còn cần cán bộ đối soát, vì hết giờ đặt không chứng minh ghế vật lý đã trống.” |
| 1:50–2:15 | Nhà xe → popup/chi tiết/chỉ đường | “Nhà xe B2 có chung cổng vào và ra. Khoảng 480 là sức chứa vận hành, còn 480–500 xe là quan sát quá khứ. Website không biến các số này thành chỗ trống hiện tại. Phí theo khảo sát là 5.000 đồng mỗi lượt. Nhà xe không có nút đặt chỗ.” |
| 2:15–2:40 | Danh sách pending, mở kế hoạch pilot | “Triển khai thật bắt đầu bằng cập nhật thủ công có thời điểm, sau đó mới nghiên cứu nguồn thẻ được cho phép hoặc bộ đếm tổng hợp. C3/Đa năng và các tiện ích khác chỉ mở rộng sau khảo sát. Không thu biển số hay dữ liệu cá nhân cho bản thi.” |

Nếu nền bản đồ lỗi, dùng nút danh sách để tiếp tục; không gọi nền xám là bản đồ đã tải thành công. Có thể rút ngắn bước no-show khi trình bày dưới 2 phút 30 giây; không bỏ nhãn DEMO.

## UAT cuối — desktop và mobile 390px

Ghi URL, commit/deployment, browser, thiết bị, mạng, người kiểm và ngày. Chạy Chrome/Edge desktop và điện thoại thực nếu có; Chromium headless không thay thế ký duyệt thiết bị thật.

- [ ] Homepage đúng tiêu đề/subtitle, không còn intro dài hoặc hai thẻ B2 lặp trước map. 12 icon: mobile 3 cột, desktop 4–6 cột; bản đồ xuất hiện trong màn hình mobile đầu tiên hoặc ngay phần tiếp theo.
- [ ] Homies lọc 3 bản ghi B2/C3/Đa năng, chỉ B2 có ghim. C1T không trở thành Homies. Nhà xe lọc B2 + 11 ứng viên, chỉ B2 có ghim.
- [ ] 10 mục “Sắp ra mắt” không tương tác, không chuyển trang/không tạo ghim. Tìm kiếm, danh sách, xoá bộ lọc và trạng thái rỗng hoạt động.
- [ ] Popup Homies có giờ 06:45–20:00, mang thẻ ULIS, “Chưa có dữ liệu chỗ trống trực tiếp.” và nút đặt DEMO/chỉ đường. 98 được ghi là ghế khảo sát, không phải số chỗ trống.
- [ ] Popup nhà xe có phí, quy mô ước tính, cổng chung, giờ chưa biết và chỉ đường. **Không có nút đặt chỗ** hoặc tỷ lệ lấp đầy trực tiếp.
- [ ] Link chỉ đường đúng toạ độ, mở công cụ bên ngoài; không có link chỉ đường tới demo/pending. Lối vào Homies chưa xác nhận được ghi rõ.
- [ ] Chọn ngày/khung giờ, đặt 1 ghế DEMO, thử đặt trùng → bị từ chối, huỷ → trả lại kho demo. Khung đầy không nhận thêm lượt.
- [ ] Thử check-in quá sớm → từ chối; tới giờ → check-in; check-out → hoàn tất. Tăng đồng hồ qua 15 phút để no-show, qua hết giờ khi đã check-in để hết hạn. Reset/tải lại xoá lượt cũ.
- [ ] Số chỗ giả không xuất hiện như số chỗ thật trong popup, nhà xe, hoặc bản đồ. Mô phỏng nhà xe cũ vẫn tách biệt và không có map/route.
- [ ] Nguồn, ngày khảo sát 11/11, giờ prototype do chủ dự án cung cấp 13/11 và dữ liệu lịch sử vẫn có trong mục mở rộng. Không đổi 4 điểm source-only thành field-verified.
- [ ] Tile lỗi có thông báo gọn, danh sách và retry hoạt động; khôi phục đúng nguồn được phép thì cảnh báo mất. OSM attribution vẫn hiện. Không bỏ kiểm tra TLS.
- [ ] Tab/focus, nút ≥44px cho hành động chính, chữ dễ đọc, không tràn ngang 390px. Không có hydration/JS error.
- [ ] Preview mở incognito không cần Vercel login, đúng commit, reload trực tiếp các route và 404 hoạt động. Kiểm nền bản đồ thực trên mạng người dùng.

## Preview / bàn giao

Preview nhánh đã tồn tại: https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app . Kiểm tra đầu phiên ngày 13/11 trả **HTTP 200** và nội dung B2 cũ, không còn redirect SSO. Điều đó không chứng minh bản Student-first mới đã deploy; xem kết quả sau push trong [QA](qa-student-final.md).

Dùng project Vercel hiện có: Next.js, root `./`, Node 22.x, `npm ci`, `npm run build`, output mặc định, production branch vẫn `main`. Không cần env/DB/token; tile provider tuỳ chọn phải có cặp HTTPS URL + credit công khai theo `.env.example` và chính sách dịch vụ. Không mua gói hay dùng bypass URL.

Sau push, dùng Preview do Git integration tạo; kiểm commit/status Ready trước khi UAT. Nếu chưa có deployment mới, chủ project chọn **Deployments → Create Deployment → sprint-1-campus-map**, xác nhận **Preview**, không Promote/merge/Production. Kiểm incognito trên máy tính và mạng di động. Thay đổi public env cần rebuild. Không import project mới vì lần deploy đầu có thể bị phân loại Production.

Tài liệu vận hành/nguồn/chi phí/khả thi và tiêu chí điểm: [ULIS B2 pilot plan](ulis-b2-pilot-plan.md). Ảnh, test, file thay đổi và giới hạn kỹ thuật: [QA Student-first](qa-student-final.md). Các handoff ngày 12/11 chỉ là lịch sử, không còn mô tả UI/giờ prototype hiện tại.

### Kết quả Preview sau phát hành

Đã xác nhận application commit `ed5872b` được Vercel báo Ready. [Mở Student-first Preview](https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app): HTTPS HTTP 200 không đăng nhập, homepage mới và hai route B2 có nội dung đúng; route sai trả 404; 8 JS assets Homies trả 200. Chưa có ký duyệt browser hosted vì Chromium cloud từ chối chứng chỉ; tiếp tục UAT trên mạng/thiết bị thật, không tắt TLS. Xem [bằng chứng QA](qa-student-final.md#hosted-verification-sau-push).
