// =============================================
//  GAME PIKACHU - NỐI 2 HÌNH GIỐNG NHAU
//  Luật: chọn 2 hình giống nhau, nếu nối được bằng
//  đường gấp khúc tối đa 3 đoạn (tối đa 2 lần rẽ)
//  đi qua ô trống thì 2 hình biến mất.
// =============================================

// ----- BIẾN DÙNG CHUNG CHO CẢ GAME -----

// Kích thước phần có hình: 14 cột x 16 hàng = 224 ô
var soCot = 14;
var soHang = 16;

// Số cặp cần ăn = số ô chia 2 = 112 cặp
var soCap = soCot * soHang / 2;

// Danh sách các loại hình: ảnh Pokémon lấy từ PokeAPI (giống repo FE-Pikachu)
// Mỗi số là mã Pokémon, ví dụ 25 là Pikachu
var maPokemon = [1, 4, 7, 10, 13, 16, 19, 25, 27, 35, 37, 39,
                 41, 43, 50, 52, 54, 58, 60, 63, 66, 69, 74, 77,
                 79, 81, 92, 95, 104, 109, 116, 120, 129, 133, 143, 151];

var danhSachHinh = [];
for (var k = 0; k < maPokemon.length; k++) {
    danhSachHinh.push("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + maPokemon[k] + ".png");
}

// Bảng game là mảng 2 chiều: bang[hang][cot]
// Bảng có thêm 1 vòng viền trống bao quanh để đường nối đi vòng ra ngoài.
// Vì vậy hàng chạy từ 0 đến soHang + 1, cột chạy từ 0 đến soCot + 1.
// Mỗi ô chứa đường dẫn hình, hoặc "" nếu ô trống.
var bang = [];

// Ô đang được chọn (-1 nghĩa là chưa chọn ô nào)
var hangChon = -1;
var cotChon = -1;

// Điểm và số cặp đã ăn
var diem = 0;
var soCapDaAn = 0;

// Hẹn giờ tắt tia nối (dùng để hủy hẹn giờ cũ khi có tia mới)
var henGioTia = null;


// ----- BƯỚC 4, 5, 6: TẠO CÁC CẶP HÌNH VÀ XÁO TRỘN -----

// Tạo mảng 224 hình (112 cặp), lặp lại các loại hình bằng phép chia lấy dư
function taoBoHinh() {
    var boHinh = [];
    for (var i = 0; i < soCap; i++) {
        var hinh = danhSachHinh[i % danhSachHinh.length];
        boHinh.push(hinh);
        boHinh.push(hinh);
    }
    return boHinh;
}

// Đổi chỗ ngẫu nhiên các phần tử trong mảng
function xaoTron(mang) {
    for (var i = 0; i < mang.length; i++) {
        var j = Math.floor(Math.random() * mang.length);

        var tam = mang[i];
        mang[i] = mang[j];
        mang[j] = tam;
    }
}

// Đưa các hình vào mảng 2 chiều bang[hang][cot]
function taoBang() {
    var boHinh = taoBoHinh();
    xaoTron(boHinh);

    bang = [];
    var dem = 0;

    for (var h = 0; h <= soHang + 1; h++) {
        var hangMoi = [];

        for (var c = 0; c <= soCot + 1; c++) {
            // Vòng viền ngoài cùng luôn trống
            if (h == 0 || h == soHang + 1 || c == 0 || c == soCot + 1) {
                hangMoi.push("");
            } else {
                hangMoi.push(boHinh[dem]);
                dem++;
            }
        }

        bang.push(hangMoi);
    }
}


// ----- BƯỚC 7: HIỂN THỊ BẢNG LÊN MÀN HÌNH -----
// Mỗi ô có id dạng "o-hang-cot", ví dụ ô hàng 2 cột 5 có id "o-2-5"
function veBang() {
    $("#bang-game").empty();

    var html = '<table>';

    for (var h = 0; h <= soHang + 1; h++) {
        html += '<tr>';

        for (var c = 0; c <= soCot + 1; c++) {
            if (bang[h][c] == "") {
                html += '<td><div class="o o-trong" id="o-' + h + '-' + c + '"' +
                        ' data-hang="' + h + '" data-cot="' + c + '"></div></td>';
            } else {
                html += '<td><div class="o" id="o-' + h + '-' + c + '"' +
                        ' data-hang="' + h + '" data-cot="' + c + '">' +
                        '<img src="' + bang[h][c] + '"></div></td>';
            }
        }

        html += '</tr>';
    }

    html += '</table>';
    $("#bang-game").append(html);

    // Gắn sự kiện click cho các ô vừa tạo
    $(".o").click(function () {
        // Phần này chưa thấy trong slide: parseInt đổi chữ "3" thành số 3
        var h = parseInt($(this).attr("data-hang"));
        var c = parseInt($(this).attr("data-cot"));
        xuLyClick(h, c);
    });
}


// ----- BƯỚC 8, 9: XỬ LÝ KHI CLICK VÀO MỘT Ô -----
function xuLyClick(h, c) {
    // Xóa tia nối của lần ăn trước (nếu có)
    $(".tia").remove();

    // Click vào ô trống thì không làm gì
    if (bang[h][c] == "") {
        return;
    }

    if (hangChon == -1) {
        // Chưa chọn ô nào: đây là ô thứ nhất
        hangChon = h;
        cotChon = c;
        $("#o-" + h + "-" + c).addClass("dang-chon");
    } else if (hangChon == h && cotChon == c) {
        // Click lại đúng ô đang chọn: bỏ chọn
        boChon();
    } else {
        // Đây là ô thứ hai: thử nối 2 ô
        thuNoi(hangChon, cotChon, h, c);
    }
}

// Bỏ chọn ô đang chọn
function boChon() {
    $("#o-" + hangChon + "-" + cotChon).removeClass("dang-chon");
    hangChon = -1;
    cotChon = -1;
}


// ----- BƯỚC 10: KIỂM TRA 2 Ô CÓ ĂN ĐƯỢC KHÔNG -----
function thuNoi(h1, c1, h2, c2) {
    // Hai hình khác nhau thì không ăn được
    if (bang[h1][c1] != bang[h2][c2]) {
        boChon();
        return;
    }

    if (timDuong(h1, c1, h2, c2, true) == true) {
        // Bước 11: nối được => xóa 2 hình
        xoaO(h1, c1);
        xoaO(h2, c2);

        // Sau 1 giây (1000 mili giây) thì tự tắt tia,
        // rồi mới kiểm tra hết nước đi (để người chơi kịp nhìn thấy tia)
        // Phần này chưa thấy trong slide: setTimeout, clearTimeout
        clearTimeout(henGioTia);
        henGioTia = setTimeout(function () {
            $(".tia").remove();
            kiemTraHetNuoc();
        }, 1000);

        diem = diem + 10;
        $("#diem").text(diem);
        soCapDaAn++;

        kiemTraThang();
    }

    // Ăn được hay không thì cũng bỏ chọn ô thứ nhất
    boChon();
}

// Xóa một ô: mảng ghi "", trên màn hình xóa hình và thành ô trống
// (dùng find("img").remove() để chỉ xóa hình, giữ lại tia nối trong ô)
function xoaO(h, c) {
    bang[h][c] = "";
    var o = $("#o-" + h + "-" + c);
    o.find("img").remove();
    o.addClass("o-trong");
}


// ----- TÌM ĐƯỜNG NỐI (TỐI ĐA 3 ĐOẠN THẲNG) -----

// Ô (h, c) có trống không?
function oTrong(h, c) {
    if (bang[h][c] == "") {
        return true;
    }
    return false;
}

// Trên hàng h, các ô NẰM GIỮA cột c1 và cột c2 có trống hết không?
// (không tính 2 ô ở 2 đầu)
function ngangTrong(h, c1, c2) {
    var tu = c1;
    var den = c2;
    if (c1 > c2) {
        tu = c2;
        den = c1;
    }

    for (var c = tu + 1; c < den; c++) {
        if (oTrong(h, c) == false) {
            return false;
        }
    }
    return true;
}

// Trên cột c, các ô NẰM GIỮA hàng h1 và hàng h2 có trống hết không?
function docTrong(c, h1, h2) {
    var tu = h1;
    var den = h2;
    if (h1 > h2) {
        tu = h2;
        den = h1;
    }

    for (var h = tu + 1; h < den; h++) {
        if (oTrong(h, c) == false) {
            return false;
        }
    }
    return true;
}

// Tìm đường nối từ A(h1, c1) đến B(h2, c2).
// Mọi đường tối đa 3 đoạn đều thuộc 1 trong 2 dạng:
//
//  Dạng 1: ngang - dọc - ngang       Dạng 2: dọc - ngang - dọc
//
//    A ----- P1                        P1 -------- P2
//             |                        |           |
//             |                        |           |
//            P2 ----- B                A           B
//
// Ta thử lần lượt mọi cột (dạng 1) và mọi hàng (dạng 2) để đặt P1, P2.
// Nếu P1 trùng A hoặc P2 trùng B thì đường ít đoạn hơn (thẳng hoặc 1 góc).
// Tham số coVe: true thì tô màu đường nối, false thì chỉ kiểm tra.
function timDuong(h1, c1, h2, c2, coVe) {
    // Dạng 1: thử từng cột c, P1 = (h1, c), P2 = (h2, c)
    for (var c = 0; c <= soCot + 1; c++) {
        var p1Duoc = (c == c1) || oTrong(h1, c);
        var p2Duoc = (c == c2) || oTrong(h2, c);

        if (p1Duoc && p2Duoc &&
            ngangTrong(h1, c1, c) &&
            docTrong(c, h1, h2) &&
            ngangTrong(h2, c, c2)) {
            if (coVe == true) {
                veDuongNoi(h1, c1, h1, c);
                veDuongNoi(h1, c, h2, c);
                veDuongNoi(h2, c, h2, c2);
            }
            return true;
        }
    }

    // Dạng 2: thử từng hàng h, P1 = (h, c1), P2 = (h, c2)
    for (var h = 0; h <= soHang + 1; h++) {
        var p1Duoc = (h == h1) || oTrong(h, c1);
        var p2Duoc = (h == h2) || oTrong(h, c2);

        if (p1Duoc && p2Duoc &&
            docTrong(c1, h1, h) &&
            ngangTrong(h, c1, c2) &&
            docTrong(c2, h, h2)) {
            if (coVe == true) {
                veDuongNoi(h1, c1, h, c1);
                veDuongNoi(h, c1, h, c2);
                veDuongNoi(h, c2, h2, c2);
            }
            return true;
        }
    }

    return false;
}

// ----- VẼ TIA NỐI -----
// Mỗi ô trên đường nối được thêm các "nhánh tia" đi từ giữa ô ra cạnh:
// "trai", "phai", "tren", "duoi". Các nhánh của ô cạnh nhau nối lại thành tia.
// Tia sẽ được xóa ở lần click tiếp theo.

// Thêm 1 nhánh tia vào ô (h, c)
function themTia(h, c, huong) {
    $("#o-" + h + "-" + c).append('<div class="tia tia-' + huong + '"></div>');
}

// Vẽ tia cho một đoạn thẳng từ (h1, c1) đến (h2, c2)
function veDuongNoi(h1, c1, h2, c2) {
    // Đoạn có độ dài 0 (2 đầu trùng nhau) thì không vẽ
    if (h1 == h2 && c1 == c2) {
        return;
    }

    if (h1 == h2) {
        // Đoạn nằm ngang
        var tu = c1;
        var den = c2;
        if (c1 > c2) {
            tu = c2;
            den = c1;
        }
        for (var c = tu; c <= den; c++) {
            if (c > tu) {
                themTia(h1, c, "trai");   // không phải ô đầu trái: có nhánh sang trái
            }
            if (c < den) {
                themTia(h1, c, "phai");   // không phải ô cuối phải: có nhánh sang phải
            }
        }
    } else {
        // Đoạn nằm dọc
        var tu = h1;
        var den = h2;
        if (h1 > h2) {
            tu = h2;
            den = h1;
        }
        for (var h = tu; h <= den; h++) {
            if (h > tu) {
                themTia(h, c1, "tren");
            }
            if (h < den) {
                themTia(h, c1, "duoi");
            }
        }
    }
}


// ----- BƯỚC 13: KIỂM TRA CHIẾN THẮNG -----
function kiemTraThang() {
    if (soCapDaAn == soCap) {
        $("#thong-bao").show();
    }
}


// ----- KIỂM TRA HẾT NƯỚC ĐI -----

// Còn cặp nào nối được không? Thử mọi cặp ô có hình giống nhau.
function conNuocDi() {
    for (var h1 = 1; h1 <= soHang; h1++) {
        for (var c1 = 1; c1 <= soCot; c1++) {
            if (bang[h1][c1] != "") {

                for (var h2 = 1; h2 <= soHang; h2++) {
                    for (var c2 = 1; c2 <= soCot; c2++) {
                        var khacO = (h1 != h2) || (c1 != c2);

                        if (khacO && bang[h2][c2] == bang[h1][c1]) {
                            if (timDuong(h1, c1, h2, c2, false) == true) {
                                return true;
                            }
                        }
                    }
                }

            }
        }
    }
    return false;
}

// Xáo trộn lại các hình còn lại trên bảng (ô trống giữ nguyên)
function xaoTronLai() {
    // Lấy các hình còn lại ra một mảng
    var conLai = [];
    for (var h = 1; h <= soHang; h++) {
        for (var c = 1; c <= soCot; c++) {
            if (bang[h][c] != "") {
                conLai.push(bang[h][c]);
            }
        }
    }

    xaoTron(conLai);

    // Đặt lại vào các ô có hình
    var dem = 0;
    for (var h = 1; h <= soHang; h++) {
        for (var c = 1; c <= soCot; c++) {
            if (bang[h][c] != "") {
                bang[h][c] = conLai[dem];
                dem++;
            }
        }
    }
}

// Nếu chưa thắng mà hết nước đi thì xáo trộn lại đến khi có nước đi
function kiemTraHetNuoc() {
    if (soCapDaAn == soCap) {
        return;
    }

    if (conNuocDi() == false) {
        alert("Hết nước đi! Các hình sẽ được đổi vị trí.");

        while (conNuocDi() == false) {
            xaoTronLai();
        }

        // Bỏ chọn ô đang chọn (nếu có) vì các hình đã đổi vị trí
        boChon();
        veBang();
    }
}


// ----- BƯỚC 14: BẮT ĐẦU (HOẶC CHƠI LẠI) MỘT VÁN MỚI -----
function batDauGame() {
    // Số ô phải là số chẵn thì mới chia đủ thành từng cặp
    if ((soCot * soHang) % 2 != 0) {
        alert("Lỗi cấu hình: soCot x soHang phải là số chẵn!");
        return;
    }

    diem = 0;
    soCapDaAn = 0;
    hangChon = -1;
    cotChon = -1;

    $("#diem").text(diem);
    $("#thong-bao").hide();

    taoBang();

    // Nếu bảng mới tạo không có nước đi nào thì xáo lại
    while (conNuocDi() == false) {
        xaoTronLai();
    }

    veBang();
}


// ----- CHẠY KHI TRANG ĐÃ TẢI XONG -----
$(document).ready(function () {
    batDauGame();

    $("#nut-choi-lai").click(function () {
        batDauGame();
    });
});
