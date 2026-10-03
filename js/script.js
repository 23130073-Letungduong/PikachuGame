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

function timDuong(h1, c1, h2, c2, coVe) {
    var soDoan = [];
    var truocH = [];
    var truocC = [];
    for (var h = 0; h <= soHang + 1; h++) {
        soDoan.push([]);
        truocH.push([]);
        truocC.push([]);
        for (var c = 0; c <= soCot + 1; c++) {
            soDoan[h].push(-1);
            truocH[h].push(-1);
            truocC[h].push(-1);
        }
    }

    var huongH = [-1, 1, 0, 0];
    var huongC = [0, 0, -1, 1];

    var hangDoi = [];
    hangDoi.push([h1, c1]);
    soDoan[h1][c1] = 0;

    while (hangDoi.length > 0) {
        var o = hangDoi.shift();
        var h = o[0];
        var c = o[1];

        if (soDoan[h][c] < 3) {
            for (var k = 0; k < 4; k++) {
                var hMoi = h + huongH[k];
                var cMoi = c + huongC[k];

                while (hMoi >= 0 && hMoi <= soHang + 1 && cMoi >= 0 && cMoi <= soCot + 1) {
                    if (hMoi == h2 && cMoi == c2) {
                        truocH[h2][c2] = h;
                        truocC[h2][c2] = c;
                        if (coVe == true) {
                            veDuongDi(h1, c1, h2, c2, truocH, truocC);
                        }
                        return true;
                    }

                    if (bang[hMoi][cMoi] != "") {
                        break;
                    }

                    if (soDoan[hMoi][cMoi] == -1) {
                        soDoan[hMoi][cMoi] = soDoan[h][c] + 1;
                        truocH[hMoi][cMoi] = h;
                        truocC[hMoi][cMoi] = c;
                        hangDoi.push([hMoi, cMoi]);
                    }

                    hMoi = hMoi + huongH[k];
                    cMoi = cMoi + huongC[k];
                }
            }
        }
    }

    return false;
}

function veDuongDi(h1, c1, h2, c2, truocH, truocC) {
    var h = h2;
    var c = c2;
    while (h != h1 || c != c1) {
        var hTruoc = truocH[h][c];
        var cTruoc = truocC[h][c];
        veDuongNoi(hTruoc, cTruoc, h, c);
        h = hTruoc;
        c = cTruoc;
    }
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
