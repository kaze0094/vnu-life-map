# VNU Chill Space

Giữ nguyên bản đồ/B2, các nhãn nguồn và demo bãi xe/đặt chỗ riêng biệt. Homepage thêm lối vào Chill Space; 3D chỉ tải khi vào khu vực này.

- `/chill`: phòng low-poly, hướng dẫn nhanh, hai lựa chọn.
- `/chill/private`: My Chill Space; avatar, WASD/phím mũi tên/E hoặc joystick, xoay/zoom/fullscreen, bàn học, mèo, cây5 giai đoạn, 4 mood, âm thanh tổng hợp chỉ bật bằng thao tác người dùng. Pomodoro25/5,50/10 hoặc tùy chỉnh; pause/resume/stop. Chỉ hoàn tất đồng hồ mới tăng cây; đây không phải xác minh việc học. Lời ước tối đa120 ký tự, chỉnh/xóa; tiến độ và sở thích lưu localStorage trên thiết bị, không đồng bộ cloud.
- `/chill/together`: WebSocket thật qua Cloudflare Durable Objects, avatar chỉ từ kết nối thật. Nickname, hướng/vị trí/animation, biểu cảm, ghế độc quyền, trạng thái học/nghỉ/rảnh và Pomodoro chung25/50 theo timestamp server. Tạo phòng riêng, sao chép link, vào/rời/đóng phòng. Không chat tự do, NPC online giả hay đăng nhập sinh viên.

Khi thiếu endpoint, Study Together hiện **Chưa kết nối realtime**, không tuyên bố multiplayer công khai hoạt động. [Cấu hình](chill-realtime-setup.md), [QA và ảnh](qa-chill-space.md).

WebGL được yêu cầu để hiển thị3D; fallback vẫn cho phép đọc điều khiển và dùng phần chức năng HTML. Chế độ giảm chuyển động được hỗ trợ. Không có backend bãi xe, Supabase, thẻ, thanh toán hoặc API AI.

## Demo 2–3 phút

1. 30 giây: mở homepage → B2, phân biệt ghế khảo sát/công suất gần đúng với dữ liệu thời gian thực chưa có.
2. 45 giây: My Chill Space, di chuyển/ngồi, chọn Pomodoro, mèo/mood/cây; nói rõ cây tăng khi đồng hồ hoàn tất, không tăng khi hủy.
3. 60 giây: Study Together trên hai phiên thực đã nối endpoint: tạo link, bạn vào, di chuyển/vẫy tay, chọn cùng ghế để thấy khóa, ngồi cùng bàn và học chung. Đối chiếu đồng hồ.
4. 15 giây: rời phòng → giải phóng ghế. Nêu giới hạn4 người, chưa có tích hợp thẻ. Nếu Preview chưa nối endpoint, trình bày trạng thái chưa kết nối và chỉ demo multiplayer bằng server local đã kiểm thử, không nhận là cloud đã chạy.
