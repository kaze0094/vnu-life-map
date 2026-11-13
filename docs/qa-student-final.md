# Student-first final release QA — 13/11/2026

Nhánh `sprint-1-campus-map`, PR #1. Hạn thi 15/11/2026. Đây là kết quả phiên bản mới; báo cáo 11–12/11 là lịch sử. Không merge/Production/DB/dịch vụ trả phí.

## Kiểm tra tự động

Đã chạy và đạt sau thay đổi ứng dụng cuối:

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

**39 tests / 6 files**. Trong đó 11 test booking mới kiểm: giữ một chỗ DEMO, xác nhận có nhãn, chống trùng kể cả khác ngày/slot trong phiên, full fixture, huỷ trả quota, ngày/giờ không hợp lệ/quá khứ, check-in đúng cửa sổ, check-out, no-show sau ân hạn, hết hạn khi quên check-out, reset, ID sai và thời gian tiến sai. Ba test Student-first kiểm membership Homies chính xác, giữ inventory/source-only và chỉ đường chỉ cho toạ độ thực đủ điều kiện. Các test cũ về dữ liệu rỗng, ứng viên, occupancy, parking demo và tile recovery tiếp tục đạt.

Production build giữ các route `/`, `/b2`, `/parking`, `/locations/[id]`, `/parking/[id]`; không thêm API hay backend. 30 kiểm tra HTTP cục bộ đạt: route chính, tất cả real detail/candidate/demo detail đã có và các 404.

## Chromium desktop/mobile

Dùng production server `npm start`, Chromium hệ thống + Playwright; desktop **1440×1000**, mobile **390×844**, locale vi-VN. Sau lần sửa điều khiển reset và thu gọn lưới, toàn bộ luồng được chạy lại:

- Tiêu đề/subtitle đúng yêu cầu; 12 category, 10 disabled/“Sắp ra mắt”. Desktop 6 cột, mobile 3 cột.
- Bản đồ mobile bắt đầu ở **y ≈ 676.7px**, đã nhìn thấy trong viewport 844px cả khi tile báo lỗi. Không có thẻ B2 lặp trước map hoặc đoạn giải thích nguồn dài.
- Homies lọc 3 record, chỉ B2 có ghim; Nhà xe lọc 12 record, chỉ B2 có ghim; default giữ 6 điểm thật. Chờ xác minh/empty/reset/tìm kiếm/danh sách hoạt động.
- Popup keyboard Enter/click/tap: Homies có giờ 06:45–20:00, chỗ trống chưa biết, chỉ đường đúng điểm và link booking; Parking có phí và không có booking. Link hướng dẫn ngoài được kiểm tra URL đích, không giả lập một tuyến đã đi.
- Booking từ popup tới `#booking-demo`, chọn date/slot, full option bị khoá, đặt/đặt trùng (reject)/huỷ/đặt lại/check-in quá sớm (reject)/tới giờ/check-in/out/no-show/hết hạn/reset. Trạng thái và kho giả cập nhật đúng.
- Reload xoá booking, không ghi localStorage/server. Không có booking trên trang nhà xe thực. Real unknown-availability không thay đổi khi giữ chỗ DEMO.
- Mô phỏng nhà xe cũ vẫn có 3 lot và không có map; trở lại real loại bỏ simulator.
- Không có JavaScript/hydration error trong luồng cuối; không tràn ngang ở homepage, Homies booking hay parking 390px.
- Tile failure → list fallback focus đúng; fixture riêng kiểm retry sang ảnh 1px tổng hợp để kiểm event wiring. Không dùng fixture cho ảnh submission và không coi đó là nền bản đồ thực.

Một phép assert ban đầu của Playwright không nhận đúng `option disabled`; kiểm tra trực tiếp thuộc tính DOM xác nhận slot đầy bị khoá. Không đổi logic để qua test. Browser QA cũng phát hiện phần clock tự đóng khi hết hạn; đã sửa để điều khiển DEMO/reset sẵn dùng, rồi chạy lại đầy đủ.

## Ảnh hiện tại

Ảnh chụp **local production build**, không giả là screenshot hosted. Nền tile xám phản ánh lỗi chứng chỉ trong môi trường kiểm thử; không có đồ họa InMapz, ảnh cá nhân hoặc ảnh biển số.

- [Desktop homepage](screenshots/student-final/desktop-home.png)
- [Desktop Homies](screenshots/student-final/desktop-homies.png)
- [Desktop booking confirmation](screenshots/student-final/desktop-booking.png)
- [390px homepage](screenshots/student-final/mobile-home.png)
- [390px booking](screenshots/student-final/mobile-booking.png)
- [390px parking + source notes](screenshots/student-final/mobile-parking.png)

## File thay đổi

- `src/components/Explorer.tsx`: homepage/lưới/filter/map/list và đường vào parking simulation, loại nội dung giải thích lặp.
- `LocationPanel.tsx` (mới), `CampusMap.tsx`: popup gọn, unknown availability, chỉ đường, action Homies-only và fallback.
- `B2Detail.tsx`, `DetailMap.tsx`, `src/app/globals.css`: detail gọn, nguồn mở rộng, client-only booking, responsive/interaction styles.
- `src/lib/booking.ts` + `BookingDemo.tsx` (mới): reducer/demo form/confirmation/time transitions. Không dùng model/endpoint đặt thật.
- `src/lib/booking.test.ts`, `student-experience.test.ts` (mới): lifecycle/capacity/isolation/filter/navigation.
- `src/lib/models.ts`, `data.ts`, `src/data/b2.json`, `locations.json`, `sources.json`: giờ prototype có nguồn, explicit Homies membership, real occupancy null, safe directions.
- README, provenance/deployment docs, `final-student-release.md`, `ulis-b2-pilot-plan.md` và QA này: script/UAT/phạm vi/plan/chi phí giả định. Handoff cũ được gắn nhãn lịch sử.

## Giới hạn và trạng thái Preview

- **Booking không phải giữ chỗ ULIS.** Chỉ một trang trong một browser, không xác thực hay đồng bộ đa thiết bị; thời gian chỉ thay đổi bằng nút DEMO. Một số quota giả đã giữ sẵn để có khung đầy. Hết hạn demo giải phóng quota giả; pilot thật phải đối soát hiện diện trước khi khẳng định ghế vật lý trống.
- **Dữ liệu trực tiếp thực vẫn chưa có.** 98 ghế quan sát không phải official maximum, khoảng 480 capacity không phải free spaces, 480–500 chỉ là quan sát quá khứ. Provider/parking hours/amenities và quota vận hành thật chưa xác nhận.
- **Tile trong môi trường này lỗi TLS:** `net::ERR_CERT_AUTHORITY_INVALID`. Không disable TLS hay né hạn chế dịch vụ. Kiểm imagery trên mạng tin cậy/người dùng thực và giữ attribution.
- **Preview:** kiểm đầu phiên 13/11 cho URL nhánh `https://vnu-life-map-git-sprint-1-campus-map-vnu-life-map.vercel.app` trả HTTP 200 và B2 cũ, không còn SSO. Kiểm lại sau push để xác nhận UI mới; kết quả sẽ được ghi tiếp bên dưới. Không coi status build hoặc ảnh local là bằng chứng hosted browser đã qua.
- Branded Chrome/Edge và điện thoại vật lý chưa ký duyệt ở đây. Đội thi cần chạy [UAT cuối](final-student-release.md#uat-cuối--desktop-và-mobile-390px) trên đúng URL/commit. Không có lỗi chức năng critical còn biết trong luồng local đã kiểm, nhưng không gán kết quả kiểm chứng thực địa/hosting khi chưa kiểm.
