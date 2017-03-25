 (function(){
            var ROW = 4,
                    COL = 6,
                    NUM = ROW * COL,
                    BIG_IMG_WIDTH = 750,
                    BIG_IMG_HEIGHT = 500,
                    THUMB_IMG_WIDTH = 125,
                    THUMB_IMG_HEIGHT = 125;
            var oContainer = document.getElementById('container'),
                    oPrev = document.getElementById('prev'),
                    oNext = document.getElementById('next');
            var count = 0;//记录已经加载图片的个数
            var index = 0;
            var bClick = false;//标识是否被点击过
            var nowIdx = 1;//记录当前点击图片名称
            var aImg = document.getElementsByClassName('img');
            //图片预加载
            for(var i=0; i<NUM; i++){
                var thumbImg = new Image();
                thumbImg.onload = function(){
                    count++;
                    if(count == NUM * 2){
                        loadSuccess();
                    }
                };
                thumbImg.src = 'img/thumbs/'+ (i + 1) +'.jpg';

                var bigImg = new Image();
                bigImg.onload = function(){
                    count++;
                    if(count == NUM * 2){
                        loadSuccess();
                    }
                };
                bigImg.src = 'img/'+ (i + 1) +'.jpg';
            }

            var iColGap = (oContainer.offsetWidth - THUMB_IMG_WIDTH * COL) / (COL + 1);
            var iRowGap = (oContainer.offsetHeight - THUMB_IMG_HEIGHT * ROW) / (ROW + 1);
            function loadSuccess(){
                //创建24个div
                for(var i=0; i<ROW; i++){
                    for(var j=0; j<COL; j++){
                        index++;
                        var oDiv = document.createElement('div');
                        oDiv.className = 'img';
                        oDiv.style.width = THUMB_IMG_WIDTH + 'px';
                        oDiv.style.height = THUMB_IMG_HEIGHT + 'px';
                        oDiv.style.backgroundImage = 'url(img/thumbs/' + index + '.jpg)';
                        oDiv.innerHTML = '<span></span>';
                        oDiv.pos = {
                            row : i,
                            col : j,
                            left : j * (iColGap + THUMB_IMG_WIDTH) + iColGap,
                            top : i * (iRowGap + THUMB_IMG_HEIGHT) + iRowGap
                        };
                        oDiv.index = index;
                        oContainer.appendChild(oDiv);
                    }
                }

                var timer = setInterval(function(){
                    aImg[--index].style.left = aImg[index].pos.left + 'px';
                    aImg[index].style.top = aImg[index].pos.top + 'px';
                    setStyle(aImg[index], 'transform', 'rotate('+ (Math.random() * 40 - 20 ) +'deg)');
                    if(index == 0){
                        clearInterval(timer);
                    }
                }, 100);
            }

            oContainer.onclick = function(e){
                var target = e.target;
                if(target != oContainer){
                    if(bClick){//已经被点击过，现在是大图，需要被打散
                        for(var i=0; i<NUM; i++){
                            aImg[i].style.left = aImg[i].pos.left + 'px';
                            aImg[i].style.top = aImg[i].pos.top + 'px';
                            setStyle(aImg[i], 'transform', 'rotate('+ (Math.random() * 40 - 20 ) +'deg)');
                            aImg[i].style.borderWidth = '5px';
                            var oSpan = aImg[i].getElementsByTagName('span')[0];
                            oSpan.style.opacity = 0;
                        }
                        oPrev.style.display = oNext.style.display = 'none';
                    }else{//没被点击过，现在是小图，需要合并
                        var bigImgPos = {
                            left : (oContainer.offsetWidth - BIG_IMG_WIDTH) / 2,
                            top:  (oContainer.offsetHeight - BIG_IMG_HEIGHT) / 2
                        };
                        for(var i=0; i<NUM; i++){
                            aImg[i].style.left = bigImgPos.left + THUMB_IMG_WIDTH * aImg[i].pos.col + 'px';
                            aImg[i].style.top = bigImgPos.top + THUMB_IMG_HEIGHT * aImg[i].pos.row + 'px';
                            aImg[i].style.borderWidth = '1px';
                            setStyle(aImg[i], 'transform', 'rotate(0deg)');

                            var oSpan = aImg[i].getElementsByTagName('span')[0];
                            oSpan.style.opacity = 1;
                            oSpan.style.backgroundImage = 'url(img/' + target.parentNode.index + '.jpg)';
                            oSpan.style.backgroundPosition = -aImg[i].pos.col * THUMB_IMG_WIDTH + 'px '
                                    + (-aImg[i].pos.row * THUMB_IMG_HEIGHT) + 'px';
                        }
                        oPrev.style.display = oNext.style.display = 'block';
                        nowIdx = target.parentNode.index;
                    }
                    bClick = !bClick;
                }
            };

            oPrev.onclick = oNext.onclick = function(){
                if(this == oPrev){
                    nowIdx--;
                    if(nowIdx == 0){
                        nowIdx = NUM;
                    }
                }else{
                    nowIdx++;
                    if(nowIdx == NUM + 1){
                        nowIdx = 1;
                    }
                }

                var arr = [];
                for(var i=0; i<NUM; i++){
                    arr.push(i);
                }
                arr.sort(function(){
                    return Math.random() - 0.5;
                });
                var timer = setInterval(function(){
                    var item = arr.pop();
                    var oSpan = aImg[item].getElementsByTagName('span')[0];
                    oSpan.style.backgroundImage = 'url(img/'+ nowIdx +'.jpg)';

                    if(arr.length == 0){
                        clearInterval(timer);
                    }
                }, 30);
            };

            function setStyle(elem, prop, val){
                ['Webkit', 'Moz', 'Ms', 'O', ''].forEach(function(prefix){
                    elem.style[prefix + prop.charAt(0).toUpperCase() + prop.substring(1)] = val;
                });
            }

        })();
