# HSK Intensive Studio

Ứng dụng web học tiếng Trung theo HSK, tập trung vào:
- Bộ thủ (đầy đủ hơn 200 mục, hiện tại 246 mục theo Unicode CJK Radicals)
- Từ vựng + chính tả (dictation) theo từng level HSK
- Ngữ pháp theo từng level HSK
- Theo dõi tiến độ học và ôn tập theo SRS

Ứng dụng được thiết kế để deploy lên GitHub Pages tại:
- `https://mtuann.github.io/chinese/`

## Tính năng chính

1. `Overview`
- Tổng quan số bộ thủ/ngữ pháp đã nắm
- Tỷ lệ đúng quiz
- Chuỗi ngày học (streak)
- Danh sách mục đến hạn ôn
- Tiến độ theo từng level HSK

2. `Radicals Explorer`
- Lọc theo level HSK (`introduced` / `up to level` / `all`)
- Tìm theo bộ thủ, pinyin, nghĩa
- Hiển thị ví dụ từ vựng theo level
- Đánh dấu mastered và cập nhật review stage

3. `Quiz & Dictation`
- Trắc nghiệm nghĩa bộ thủ (MCQ)
- Dictation bộ thủ
- Dictation từ vựng theo level HSK + filter theo bộ thủ
- Kết quả được ghi vào tiến độ SRS cục bộ

4. `Grammar by Level`
- Ngữ pháp chia theo HSK 1-6 và 7-9
- Filter theo `Only this level` hoặc `Up to this level`
- Có pinyin cho tiêu đề và ví dụ ngữ pháp (có thể bật/tắt trong app)
- Tìm kiếm theo mã/tên/nhóm
- Đánh dấu mastered
- Grammar quick quiz

5. `Vocabulary by Level`
- Học từ vựng theo level với lọc `Only this level` hoặc `Up to this level`
- Filter theo bộ thủ, tìm theo từ/pinyin/nghĩa, và phân trang
- Audio mode không cần API: dùng Web Speech API để phát âm từ vựng (nút `Audio` trong bảng), auto-speak trong flashcard, và nút replay
- Đánh dấu từ đã mastered để theo dõi tiến độ

6. `Pronunciation Guide`
- Bảng đầy đủ thanh điệu, initials, finals
- Hướng dẫn vị trí phát âm song ngữ Việt/Anh
- Có mục cặp âm dễ nhầm cho người Việt

7. `Intensive Lab`
- Mục tiêu học mỗi ngày (bộ thủ, ngữ pháp, dictation)
- Mục tiêu từ vựng mỗi ngày
- Focus timer (Pomodoro)
- Sổ lỗi sai (mistake notebook)
- Export/Import tiến độ dạng JSON

8. `PWA (Progressive Web App)`
- Cài được trên Android và iOS (Safari)
- Chạy offline nhờ service worker + cache thông minh
- Có install prompt (khi trình duyệt hỗ trợ)
- Có thông báo cập nhật phiên bản mới trong app

## Nguồn dữ liệu

### 1) Bộ thủ (chuẩn Unicode)
- Unicode CJK Radicals: `https://www.unicode.org/Public/UCD/latest/ucd/CJKRadicals.txt`
- Unihan Database: `https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip`

### 2) Từ vựng HSK + pinyin + nghĩa
- `https://github.com/drkameleon/complete-hsk-vocabulary`

### 3) Ngữ pháp HSK theo cấp độ
- `https://github.com/krmanik/HSK-3.0`
- Dữ liệu OCR từ đề cương HSK 3.0 (mô tả trong repo trên)
- Tài liệu tham chiếu: `https://hsk.cn-bj.ufileos.com/3.0/%E6%96%B0%E7%89%88HSK%E8%80%83%E8%AF%95%E5%A4%A7%E7%BA%B2%EF%BC%88%E8%AF%8D%E6%B1%87%E3%80%81%E6%B1%89%E5%AD%97%E3%80%81%E8%AF%AD%E6%B3%95%EF%BC%89.pdf`

## Cấu trúc thư mục

- `index.html`: điểm vào của ứng dụng
- `assets/styles.css`: giao diện
- `assets/app.js`: logic ứng dụng + lưu tiến độ cục bộ
- `manifest.webmanifest`: cấu hình PWA
- `service-worker.js`: cache/offline/update flow cho PWA
- `offline.html`: trang fallback khi mất mạng
- `assets/icons/*`: icon cho Android/iOS/PWA
- `data/radicals.json`: dữ liệu bộ thủ
- `data/words.json`: dữ liệu từ vựng theo level
- `data/grammar.json`: dữ liệu ngữ pháp theo level
- `data/meta.json`: thống kê tổng hợp
- `scripts/build_data.py`: script build lại dữ liệu
- `.github/workflows/deploy-pages.yml`: CI/CD deploy GitHub Pages

## Chạy local

Yêu cầu: `python3` (>=3.10), `pip`, và internet để build data.

1. Build data:
```bash
pip install requests pypinyin
python3 scripts/build_data.py
```

2. Chạy static server:
```bash
python3 -m http.server 8080
```

3. Mở trình duyệt:
- `http://localhost:8080`

## Deploy GitHub Pages (CI/CD)

### A. Thiết lập repo
1. Đẩy code lên GitHub (branch `main`).
2. Vào `Settings -> Pages`.
3. Chọn `Build and deployment -> Source: GitHub Actions`.

### B. Tự động deploy
- Mỗi lần push vào `main`, workflow `Deploy Chinese Study App` sẽ:
  1. Checkout code
  2. Build data (`python scripts/build_data.py`)
  3. Upload artifact
  4. Deploy lên GitHub Pages

### C. URL
- Nếu repo tên `chinese` trong account `mtuann`:
  - `https://mtuann.github.io/chinese/`

## Cài app trên điện thoại (PWA)

1. Android (Chrome/Edge/Samsung Internet)
- Mở `https://mtuann.github.io/chinese/`
- Bấm menu trình duyệt -> `Install app` / `Add to Home screen`

2. iOS (Safari)
- Mở cùng URL bằng Safari
- Bấm `Share` -> `Add to Home Screen`

3. Cập nhật phiên bản
- Khi có bản mới, app hiển thị banner cập nhật ở cuối màn hình.
- Bấm `Cập nhật` để reload sang phiên bản mới nhất.

## Lưu ý về tiến độ học

- Toàn bộ progress được lưu trong browser (`localStorage`).
- Khi đổi máy hoặc đổi trình duyệt, dùng `Export` và `Import` để chuyển dữ liệu.

## Gợi ý học intensive

1. Mỗi ngày vào `Intensive Lab` đặt mục tiêu.
2. Học bộ thủ mới trong `Radicals`.
3. Làm `word dictation` theo đúng level đang học.
4. Học ngữ pháp cùng level và đánh dấu mastered.
5. Cuối ngày kiểm tra `Due Reviews` trong `Overview`.
