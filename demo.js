function onload(){
    if (HTMLCanvasElement) {
        var cv = document.querySelector("#cv");
        var c = cv.getContext("2d")

        var flags = [];
        var root = 0;
        //フラグ初期化 & イベントリスナ追加
        for(var i = 0; i < 12; ++i){
            flags.push(false);

            var mid = "m" + String(i);
            var rid = "r" + String(i);
            var moji = document.getElementById(mid);
            var root_moji = document.getElementById(rid);
            moji.addEventListener("click", listenerM, false);
            root_moji.addEventListener("click", listenerR, false);

            var left = 185+120*Math.sin((i)*Math.PI/6);
            var top = 65+120-(120*Math.cos((i)*Math.PI/6));
            moji.style = "left: "+left+"px; top: "+top+"px";

            var left_ = 185+155*Math.sin((i)*Math.PI/6);
            var top_ = 65+120-(155*Math.cos((i)*Math.PI/6));
            root_moji.style = "left: "+left_+"px; top: "+top_+"px";
        }

        document.getElementById("reset").onclick=function(){
            for(var i = 0; i < 12; ++i){
                flags[i] = false;
                var nid = "m" + String(i);
                document.getElementById(nid).children[0].firstChild.style = "color: #000";
                draw();
            }
        };
        document.getElementById("r0").children[0].firstChild.style = "color: #f00";
        draw();

        //図形の描画ポイント指定
        function moveToflag(){
            var first = true;
            flags.forEach(function (item, index, array){
                //12角形なので30°ごとに進む
                if(item && first){
                    c.moveTo(200+100*Math.sin((index)*Math.PI/6),100+100-(100*Math.cos((index)*Math.PI/6)));
                    first = false;
                }
                else if (item){
                    c.lineTo(200+100*Math.sin((index)*Math.PI/6),100+100-(100*Math.cos((index)*Math.PI/6)));
                }
            });
        }

        //描画
        function draw(){
            //キャンバスサイズは400x400     
            c.clearRect(0,0,400,400);//初期化

            c.strokeStyle = "red";
            c.lineWidth = "2";
            c.globalAlpha = "0.5"

            c.beginPath();
            c.arc(200,200, 100, 0, 2*Math.PI, false);
            c.stroke();

            var style = choad(flags,root);//コード識別

            c.strokeStyle = "purple";
            c.fillStyle = style[1];
            var st = 50*Math.sqrt(3);
            c.beginPath();
            moveToflag();
            c.closePath();
            c.stroke();
            c.fill();

            c.fillStyle = "blue"
            c.globalAlpha = "1"
            c.textAlign = "center"
            c.font = "bold 20px Meryo";
            c.fillText(style[0], 200,200+10);
        }

        function listenerM(e){
            var vid = e.currentTarget.id.split("m")[1];
            flags[vid] = !flags[vid];
            if(flags[vid]){
                e.target.style = "color: #f00";
            }
            else{
                e.target.style = "color: #000";
            }
            //console.log(flags);
            //console.log(e.currentTarget.id.split("m")[1]);
            draw();
        }
        function listenerR(e){
            var vid = e.currentTarget.id.split("r")[1];
            root = Number(vid);
            for(var i = 0; i < 12; ++i){
                var rid = "r" + String(i);
                document.getElementById(rid).children[0].firstChild.style = "color: #000";
            }
            e.target.style = "color: #f00";
            draw();
        }
    }
};

function choad(fls,rt){ //コード識別 オートマトン的な考えで…
    var root = rt; 
    var letter = "";
    var fillcolor = "";
    var i = 0;
    if (!fls[root] ) { //ルートがチェックしてあっても同じ音にチェックがなければ、不明にする。
        return [letter, fillcolor];
    }
    switch(root){
        case 0: letter="C"; break;
        case 1: letter="C#"; break;
        case 2: letter="D"; break;
        case 3: letter="D#"; break;
        case 4: letter="E"; break;
        case 5: letter="F"; break;
        case 6: letter="F#"; break;
        case 7: letter="G"; break;
        case 8: letter="G#"; break;
        case 9: letter="A"; break;
        case 10: letter="A#"; break;
        case 11: letter="B"; break;
        default:
        console.log("error");
    }
    root++;
    i++;
    var outscale = false;
    var second = 0;
    var third = 0;
    var fourth = 0;
    var fifth = 0;
    var sixth = 0;
    var seventh = 0;
    var ch = 0x0;
    //フラグを2進数管理してもいいかも？？？
    //ルート音から半音ずつ判断して、決める。9度以上については1周超えるのでいまのところ実装予定は無し。
    while (i < 12) {
        var index = root % 12;

        if(!outscale){
            if(i === 1 && fls[index]){
                outscale = true;
            }
            else if (i === 2 && fls[index]){
                outscale = true;
            }

            if(i === 3 && fls[index]){
                letter += "m";
                third = 1;
                fillcolor = "blue"
            }
            else if (i === 4 && fls[index]){
                if(third){
                    outscale = true;
                }
                else {
                    third = 1;
                    fillcolor = "orange"
                }
            }
            else if(i === 5 && fls[index]){
                if(third){
                    outscale = true;
                }
                else {
                    letter += "sus4";
                    third = 1;
                    fourth = 1;
                    fillcolor = "pink";
                }
            }

            if(i === 6 && fls[index]){
                if(letter.match(/[A-G]#?m/) != null){
                    letter = letter.substr(0, letter.length-1) + "dim";
                    fifth = 1;
                }
                else {
                    outscale = true;
                }
            }
            else if (i === 7 && fls[index]){
                if(fifth){
                    outscale = true;
                }
                else {
                    fifth = 1;
                }
            }
            else if (i === 8 && fls[index]){
                if(letter.match(/[A-G]#?(?![a-z])/) != null && !fifth){
                    letter = letter + "aug";
                    fifth = 1;
                }
                else {
                    outscale = true;
                }
            }

            if(i === 9 && fls[index]){
                if(third) {
                    letter += "6";
                    fillcolor = "purple";
                    sixth = 1;
                }
                else {
                    outscale = true;
                }
            }

            if(i === 10 && fls[index] && third){
                if(!sixth){
                    fillcolor = "red";
                    letter += "7"
                    seventh = 1;
                }
                else{
                    outscale = true;
                }
            }
            else if(i === 11 && fls[index] && third){
                if(!sixth && !seventh){
                    fillcolor = "red";
                    letter += "M7"
                    seventh = 1;
                }
                else { //12回目のときはoutscaleの外になってもループが終わるのでここで処理
                    letter = "?";
                    fillcolor = "gray";
                }
            }
        }
        else {
            letter = "?";
            fillcolor = "gray";
        }
        ++i;
        ++root;
    }
    return [letter, fillcolor];
};