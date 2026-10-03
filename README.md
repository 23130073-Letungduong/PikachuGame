# Pikachu Game

Bài giữa kỳ môn **Lập trình Frontend** – game Pikachu nối hình.

## Luật chơi

- Chọn 2 hình Pokémon giống nhau.
- Nếu nối được 2 hình bằng một đường gấp khúc **tối đa 3 đoạn thẳng** (rẽ tối đa 2 lần), đi qua ô trống hoặc vòng ra ngoài viền bảng, thì 2 hình biến mất và được **+10 điểm**.
- Ăn hết 112 cặp hình thì thắng.
- Khi không còn cặp nào nối được, game tự đổi vị trí các hình còn lại.

## Công nghệ

HTML, CSS, JavaScript, jQuery 3.5.1, Bootstrap 4.1.3.

## Cách chạy

Mở file `index.html` bằng trình duyệt (Chrome, Edge...). Máy cần có internet để tải jQuery, Bootstrap và ảnh Pokémon.

## Cấu trúc

```text
PikachuGame/
├── index.html                    Giao diện
├── css/style.css                 Định dạng ô, tia nối
├── js/script.js                  Toàn bộ xử lý game
└── test/TestCase_PikachuGame.xlsx  Danh sách test case và kết quả
```

## Cấu hình

Ở đầu file `js/script.js`:

- `soCot`, `soHang`: kích thước bảng (mặc định 14 x 16; `soCot x soHang` phải là số chẵn).
- `maPokemon`: danh sách mã Pokémon dùng làm hình.

Ảnh Pokémon lấy từ [PokeAPI sprites](https://github.com/PokeAPI/sprites).
