new Vue({
  el: "#app",
  data: function () {
    return {
      rgb: {
        r: 255,
        g: 0,
        b: 0,
      },
      hsv: {
        h: 360,
        s: 100,
        v: 100,
      },
      alpha: 1,
      colorPickerSize: 410,
      hueChangeFlg: false,
      hueCursorClickFlg: false,
      hueCursorSize: 14,
      colorChangeFlg: false,
      colorCursorSize: 16,
      container: {
        left: 40,
        top: 40,
      },
      mouseDownFlg: false,
    };
  },
  methods: {
    //色相領域クリック
    hueSelectStart: function (event) {
      this.hueChangeFlg = true;
      var ajustY = 0;

      if (this.hueCursorClickFlg) {
        ajustY = this.hueCursorPos + this.hueCursorSize / 2;
      }

      this.hsv.h = Math.round(
        Math.abs((event.offsetY + ajustY) * this.hueUnit - 360)
      );
      this.rgb = this.hsv2rgb;
    },
    //色相カーソルクリック
    hueCursorClick: function () {
      this.hueCursorClickFlg = true;
    },
    //カラーピッカークリック
    colorSelect: function (event) {
      this.colorChangeFlg = true;
      this.hsv.s = Math.round(event.offsetX * this.colorUnit);
      this.hsv.v = Math.round(Math.abs(event.offsetY * this.colorUnit - 100));

      this.rgb = this.hsv2rgb;
    },
    //ドラッグ時
    dragPicker: function (event) {
      var cx = event.pageX;
      var cy = event.pageY - document.documentElement.scrollTop;

      var container = document.getElementById("container");
      var colorArea = document.getElementById("color-area");
      var conT = container.offsetTop;
      var conL = container.offsetLeft;

      //色相ドラッグ
      if (this.hueChangeFlg) {
        var hueArea = document.getElementById("huepicker");
        var ht = hueArea.offsetTop + conT;
        var hh = hueArea.clientHeight;

        var hueCursorPos = cy - ht;
        if (hueCursorPos < 0) {
          hueCursorPos = 0;
        } else if (hueCursorPos > hh) {
          hueCursorPos = hh;
        }

        this.hsv.h = Math.round(Math.abs(this.hueUnit * hueCursorPos - 360));
        this.rgb = this.hsv2rgb;
      }

      //カラーピッカードラッグ
      if (this.colorChangeFlg) {
        var ct = colorArea.offsetTop + conT;
        var cl = colorArea.offsetLeft + conL;
        var ch = colorArea.clientHeight;
        var cw = colorArea.clientWidth;

        var colorCursorPosY = cy - ct;
        if (colorCursorPosY < 0) {
          colorCursorPosY = 0;
        } else if (colorCursorPosY > ch) {
          colorCursorPosY = ch;
        }
        var colorCursorPosX = cx - cl;
        if (colorCursorPosX < 0) {
          colorCursorPosX = 0;
        } else if (colorCursorPosX > cw) {
          colorCursorPosX = cw;
        }
        this.hsv.s = Math.round(colorCursorPosX * this.colorUnit);
        this.hsv.v = Math.round(
          Math.abs(colorCursorPosY * this.colorUnit - 100)
        );
        this.rgb = this.hsv2rgb;
      }
    },
    //マウスアップで全フラグを解除
    selectEnd: function () {
      this.hueChangeFlg = false;
      this.colorChangeFlg = false;
      this.hueCursorClickFlg = false;
    },
    //16進数コード入力
    hexInput: function (event) {
      var hex = event.target.value;
      hex = hex.replace(/#/, "");
      if (!hex.match(/[A-Fa-f0-9]+/)) {
        return false;
      } else {
        if (hex.length != 6 && hex.length != 3) {
          return false;
        } else {
          if (hex.length == 3) {
            hex =
              hex.charAt(0) +
              hex.charAt(0) +
              hex.charAt(1) +
              hex.charAt(1) +
              hex.charAt(2) +
              hex.charAt(2);
          }
        }
      }
      this.rgb = this.hex2rgb(hex);
      this.hsv = this.rgb2hsv;
    },
    //RGBA HSB入力時
    colorNumInput: function (color, event) {
      if (event.type != "keydown" && event.type != "blur") {
        return false;
      } else {
        var val = event.target.value;
        if (!val.match(/\d+/)) {
          return false;
        }
        val = Number(val);

        if (event.type == "keydown") {
          if (
            event.key != "Enter" &&
            event.key != "ArrowUp" &&
            event.key != "ArrowDown" &&
            !event.shiftKey
          ) {
            return false;
          } else {
            var changeNum = 1;
            if (event.shiftKey) {
              changeNum = 10;
            }

            if (event.key == "ArrowUp") {
              val += changeNum;
            } else if (event.key == "ArrowDown") {
              val -= changeNum;
            }
          }
        }

        if (color == "r" || color == "b" || color == "g") {
          if (val > 255) {
            val = 255;
          } else if (val < 0) {
            val = 0;
          }
          if (color == "r") {
            this.rgb.r = val;
          } else if (color == "g") {
            this.rgb.g = val;
          } else if (color == "b") {
            this.rgb.b = val;
          }
          this.hsv = this.rgb2hsv;
        } else if (color == "a") {
          if (val > 100) {
            val = 100;
          } else if (val < 0) {
            val = 0;
          }
          this.alpha = (val / 100).toFixed(2);
        } else if (color == "h" || color == "s" || color == "v") {
          if (color == "h") {
            if (val > 360) {
              val = 360;
            } else if (val < 0) {
              val = 0;
            }
            this.hsv.h = val;
          } else if (color == "s") {
            if (val > 100) {
              val = 100;
            } else if (val < 0) {
              val = 0;
            }
            this.hsv.s = val;
          } else if (color == "v") {
            if (val > 100) {
              val = 100;
            } else if (val < 0) {
              val = 0;
            }
            this.hsv.v = val;
          }
          this.rgb = this.hsv2rgb;
        }
      }
    },
    //rgbaコード入力時
    rgbaCodeInput: function (event) {
      var rgbaCode = event.target.value;

      rgbaCode = rgbaCode.replace(/rgba?/, "");
      rgbaCode = rgbaCode.replace(/\(/, "");
      rgbaCode = rgbaCode.replace(/\)/, "");
      rgbaCode = rgbaCode.replace(/\ /, "");
      var rgbaCodeAry = rgbaCode.split(",");

      if (rgbaCodeAry.length < 3) {
        return false;
      } else {
        if (
          !rgbaCodeAry[0].match(/\d+/) ||
          !rgbaCodeAry[1].match(/\d+/) ||
          !rgbaCodeAry[2].match(/\d+/)
        ) {
          return false;
        }
      }

      this.rgb.r = rgbaCodeAry[0];
      this.rgb.g = rgbaCodeAry[1];
      this.rgb.b = rgbaCodeAry[2];
      this.alpha = rgbaCodeAry[3];
      this.hsv = this.rgb2hsv;
    },

    //テキストボックスフォーカス
    focusAndSelect: function (event) {
      event.target.select();
    },

    //16進数→RGB値
    hex2rgb: function (hex) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4), 16),
      };
    },
  },
  computed: {
    rgbaCode: function () {
      var alpha = this.alpha;
      if (alpha == 1.0) {
        alpha = 1;
      } else if (alpha == 0.0) {
        alpha = 0;
      }
      return (
        "rgba(" +
        this.rgb.r +
        "," +
        this.rgb.g +
        "," +
        this.rgb.b +
        "," +
        alpha +
        ")"
      );
    },
    hueUnit: function () {
      return 360 / this.colorPickerSize;
    },
    hueCursorPos: function () {
      return Math.round(
        Math.abs(this.hsv.h - 360) / this.hueUnit - this.hueCursorSize / 2
      );
    },
    colorUnit: function () {
      return 100 / this.colorPickerSize;
    },
    colorCursor: function () {
      return {
        left: this.hsv.s / this.colorUnit - this.colorCursorSize / 2,
        top:
          Math.abs(this.hsv.v / this.colorUnit - this.colorPickerSize) -
          this.colorCursorSize / 2,
      };
    },
    //カラーピッカーのカーソルの位置によってカーソルの色を変える
    colorCursorState: function () {
      var color = "white";
      if (this.hsv.h <= 201 && this.hsv.h >= 22) {
        if (this.hsv.v >= 50) {
          color = "black";
        } else {
          color = "white";
        }
      } else {
        if (this.hsv.v >= 50 && this.hsv.s <= 71) {
          color = "black";
        } else {
          color = "white";
        }
      }
      return color;
    },
    alphaInt: function () {
      return Math.round(this.alpha * 100);
    },
    pickerStyle: function () {
      return {
        backgroundColor: "hsl(" + this.hsv.h + ",100%,50%)",
        opacity: this.alpha,
      };
    },
    //RGB→16進数
    rgb2hex: function () {
      this.rgb.r = Math.round(this.rgb.r);
      this.rgb.g = Math.round(this.rgb.g);
      this.rgb.b = Math.round(this.rgb.b);
      return (
        ("00" + this.rgb.r.toString(16)).slice(-2) +
        ("00" + this.rgb.g.toString(16)).slice(-2) +
        ("00" + this.rgb.b.toString(16)).slice(-2)
      );
    },
    //RGB→HSV
    rgb2hsv: function () {
      var rr,
        gg,
        bb,
        r = this.rgb.r / 255,
        g = this.rgb.g / 255,
        b = this.rgb.b / 255,
        h,
        s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function (c) {
          return (v - c) / 6 / diff + 1 / 2;
        };
      if (diff == 0) {
        h = s = 0;
      } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
          h = bb - gg;
        } else if (g === v) {
          h = 1 / 3 + rr - bb;
        } else if (b === v) {
          h = 2 / 3 + gg - rr;
        }
        if (h < 0) {
          h += 1;
        } else if (h > 1) {
          h -= 1;
        }
      }

      if (this.hsv.h == 360 && h == 0) {
        h = 1;
      }
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100),
      };
    },
    //HSV→RGB
    hsv2rgb: function () {
      var h = this.hsv.h;
      var s = this.hsv.s;
      var v = this.hsv.v;

      var max = v;
      var min = max - (s / 255) * max;
      var rgb = { r: 0, g: 0, b: 0 };

      if (h == 360) {
        h = 0;
      }

      s = s / 100;
      v = v / 100;

      if (s == 0) {
        rgb.r = v * 255;
        rgb.g = v * 255;
        rgb.b = v * 255;
        return rgb;
      }

      var dh = Math.floor(h / 60);
      var p = v * (1 - s);
      var q = v * (1 - s * (h / 60 - dh));
      var t = v * (1 - s * (1 - (h / 60 - dh)));

      switch (dh) {
        case 0:
          rgb.r = v;
          rgb.g = t;
          rgb.b = p;
          break;
        case 1:
          rgb.r = q;
          rgb.g = v;
          rgb.b = p;
          break;
        case 2:
          rgb.r = p;
          rgb.g = v;
          rgb.b = t;
          break;
        case 3:
          rgb.r = p;
          rgb.g = q;
          rgb.b = v;
          break;
        case 4:
          rgb.r = t;
          rgb.g = p;
          rgb.b = v;
          break;
        case 5:
          rgb.r = v;
          rgb.g = p;
          rgb.b = q;
          break;
      }

      rgb.r = Math.round(rgb.r * 255);
      rgb.g = Math.round(rgb.g * 255);
      rgb.b = Math.round(rgb.b * 255);
      return rgb;
    },
  },
});
