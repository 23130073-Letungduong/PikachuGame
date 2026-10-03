var soCot = 14;
var soHang = 16;

var soCap = soCot * soHang / 2;

var maPokemon = [1, 4, 7, 10, 13, 16, 19, 25, 27, 35, 37, 39,
                 41, 43, 50, 52, 54, 58, 60, 63, 66, 69, 74, 77,
                 79, 81, 92, 95, 104, 109, 116, 120, 129, 133, 143, 151];

var danhSachHinh = [];
for (var k = 0; k < maPokemon.length; k++) {
    danhSachHinh.push("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + maPokemon[k] + ".png");
}

var bang = [];

var hangChon = -1;
var cotChon = -1;

var diem = 0;
var soCapDaAn = 0;

var henGioTia = null;

function taoBoHinh() {
    var boHinh = [];
    for (var i = 0; i < soCap; i++) {
        var hinh = danhSachHinh[i % danhSachHinh.length];
        boHinh.push(hinh);
        boHinh.push(hinh);
    }
    return boHinh;
}

function xaoTron(mang) {
    for (var i = 0; i < mang.length; i++) {
        var j = Math.floor(Math.random() * mang.length);

        var tam = mang[i];
        mang[i] = mang[j];
        mang[j] = tam;
    }
}

function taoBang() {
    var boHinh = taoBoHinh();
    xaoTron(boHinh);

    bang = [];
    var dem = 0;

    for (var h = 0; h <= soHang + 1; h++) {
        var hangMoi = [];

        for (var c = 0; c <= soCot + 1; c++) {
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

    $(".o").click(function () {
        var h = parseInt($(this).attr("data-hang"));
        var c = parseInt($(this).attr("data-cot"));
        xuLyClick(h, c);
    });
}

function xuLyClick(h, c) {
    $(".tia").remove();

    if (bang[h][c] == "") {
        return;
    }

    if (hangChon == -1) {
        hangChon = h;
        cotChon = c;
        $("#o-" + h + "-" + c).addClass("dang-chon");
    } else if (hangChon == h && cotChon == c) {
        boChon();
    } else {
        thuNoi(hangChon, cotChon, h, c);
    }
}

function boChon() {
    $("#o-" + hangChon + "-" + cotChon).removeClass("dang-chon");
    hangChon = -1;
    cotChon = -1;
}

function thuNoi(h1, c1, h2, c2) {
    if (bang[h1][c1] != bang[h2][c2]) {
        boChon();
        return;
    }

    if (timDuong(h1, c1, h2, c2, true) == true) {
        xoaO(h1, c1);
        xoaO(h2, c2);

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

    boChon();
}

function xoaO(h, c) {
    bang[h][c] = "";
    var o = $("#o-" + h + "-" + c);
    o.find("img").remove();
    o.addClass("o-trong");
}

function oTrong(h, c) {
    if (bang[h][c] == "") {
        return true;
    }
    return false;
}

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

function timDuong(h1, c1, h2, c2, coVe) {
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

function themTia(h, c, huong) {
    $("#o-" + h + "-" + c).append('<div class="tia tia-' + huong + '"></div>');
}

function veDuongNoi(h1, c1, h2, c2) {
    if (h1 == h2 && c1 == c2) {
        return;
    }

    if (h1 == h2) {
        var tu = c1;
        var den = c2;
        if (c1 > c2) {
            tu = c2;
            den = c1;
        }
        for (var c = tu; c <= den; c++) {
            if (c > tu) {
                themTia(h1, c, "trai");
            }
            if (c < den) {
                themTia(h1, c, "phai");
            }
        }
    } else {
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

function kiemTraThang() {
    if (soCapDaAn == soCap) {
        $("#thong-bao").show();
    }
}

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

function xaoTronLai() {
    var conLai = [];
    for (var h = 1; h <= soHang; h++) {
        for (var c = 1; c <= soCot; c++) {
            if (bang[h][c] != "") {
                conLai.push(bang[h][c]);
            }
        }
    }

    xaoTron(conLai);

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

function kiemTraHetNuoc() {
    if (soCapDaAn == soCap) {
        return;
    }

    if (conNuocDi() == false) {
        alert("Hết nước đi! Các hình sẽ được đổi vị trí.");

        while (conNuocDi() == false) {
            xaoTronLai();
        }

        boChon();
        veBang();
    }
}

function batDauGame() {
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

    while (conNuocDi() == false) {
        xaoTronLai();
    }

    veBang();
}

$(document).ready(function () {
    batDauGame();

    $("#nut-choi-lai").click(function () {
        batDauGame();
    });
});
