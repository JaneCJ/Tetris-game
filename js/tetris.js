var  game = {
    OFFSET:15,
    CSIDE:26,
    shape:null,//保存主角图形
    pg:null,//保存游戏容器
    interval:200,
    timer:null,
    CN:10,RN:20,
    wall:null,
    nextShape:null,//保存备胎图形
    score:0,lines:0,
    SCORES:[0,10,30,60,100],
    state:0,//保存游戏状态
    GAMEOVER:0,//游戏结束
    RUNNING:1,//运行中
    PAUSE:2,//暂停
    start(){
        this.state=this.RUNNING;
        this.score=this.lines=0;
        this.wall=[];
        for(var r=0;r<this.RN;r++){//创建方块墙二维数组
            (this.wall)[r]=new Array(this.CN);
        }
        this.pg = document.querySelector(".playground");
        this.shape = this.randomShape();
        this.nextShape = this.randomShape();
        this.paint();//重绘一切
        this.timer = setInterval(this.moveDown.bind(this), this.interval);
        document.onkeydown = function(e){
            switch(e.keyCode){
                case 37:
                    this.state==this.RUNNING&&this.moveLeft();break;//左方向键
                case 39:
                    this.state==this.RUNNING&&this.moveRight();break;//右方向键
                case 32:
                    this.state==this.RUNNING&&this.hardDrop();break;//空格键
                case 40:
                    this.state==this.RUNNING&&this.moveDown();break;//下方向键
                case 38:
                    this.state==this.RUNNING&&this.rotateR();break;//上方向键
                case 90:
                    this.state==this.RUNNING&&this.rotateL();break;//上方向键
                case 80:
                    this.state==this.RUNNING&&this.pause();break;//P键
                case 67:
                    this.state==this.PAUSE&&this.myContinue();break;//C键
                case 81:
                    this.state!==this.GAMEOVER&&this.quit();break;//Q键
                case 83:
                    this.state==this.GAMEOVER&&this.start();break;//S键
            }
        }.bind(this);
    },
    pause(){
        clearInterval(this.timer);
        this.state=this.PAUSE;
        this.paintState();
    },
    myContinue(){
        this.state=this.RUNNING;
        this.timer = setInterval(this.moveDown.bind(this), this.interval);
        this.paint();
    },
    quit(){
        this.state=this.GAMEOVER;
        clearInterval(this.timer);
        this.paint();
    },
    randomShape(){//0~2之间生成随机整数
        switch (Math.floor(Math.random()*3)){
            case 0:return new O();
            case 1:return new I();
            case 2:return new T();
        }
    },
    canRotate(){//旋转后判断是否越界或撞墙
        for(var i=0;i<this.shape.cells.length;i++){
            var cell=this.shape.cells[i];
            if(cell.r<0||cell.r>=this.RN
                ||cell.c<0||cell.c>=this.CN
                ||this.wall[cell.r][cell.c]!==undefined
            ){return false;}
        }
        return true;
    },
    rotateR(){
        this.shape.rotateR();
        if(!this.canRotate())
        this.shape.rotateL();
    },
    rotateL(){
        this.shape.rotateL();
        if(!this.canRotate())
        this.shape.rotateR();
    },
    hardDrop(){
        while(this.canDown())
            this.moveDown();
    },
    canLeft(){
        for(var i=0;i<this.shape.cells.length;i++){
            var cell=this.shape.cells[i];
            if(cell.c==0||this.wall[cell.r][cell.c-1]!==undefined)
            return false;
        }
        return true;
    },
    moveLeft(){
        if(this.canLeft()){
            this.shape.moveLeft();
            this.paint();
        }
    },
    canRight(){
        for(var i=0;i<this.shape.cells.length;i++){
            var cell=this.shape.cells[i];
            if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!==undefined)
                return false;
        }
        return true;
    },
    moveRight(){
        if(this.canRight()){
            this.shape.moveRight();
            this.paint();
        }
    },
    canDown(){
        for(var i=0;i<this.shape.cells.length;i++){
            var cell = this.shape.cells[i];
            if(cell.r==this.RN-1){
                return false;
            }else if(this.wall[cell.r+1][cell.c]!==undefined){
                return false;
            }
        }
        return true;
    },
    landIntoWall(){//主角图形落入墙中
        for(var i=0;i<this.shape.cells.length;i++){
            var cell = this.shape.cells[i];
            this.wall[cell.r][cell.c] = cell;
        }
    },
    moveDown(){
        if(this.canDown()){
            this.shape.moveDown();
        }else{
            this.landIntoWall();
            var ln=this.deleteRows();
            this.lines+=ln;
            this.score+=this.SCORES[ln];
            if(!this.isGameOver()){
                this.shape=this.nextShape;
                this.nextShape=this.randomShape();
            }else{
                this.quit();
            }
        }
        this.paint();
    },
    isGameOver(){
        for(var i=0;i<this.nextShape.cells.length;i++){
            var cell=this.nextShape.cells[i];
            if(this.wall[cell.r][cell.c]!==undefined)
                return true;
        }
        return false;
    },
    deleteRows(){
        for(var r=this.RN- 1,ln=0;r>=0&&ln<4;r--){
            if(this.wall[r].join("")=="") break;
            if(this.isFullRow(r)){
                this.deleteRow(r);
                r++;
                ln++;
            }
        }
        return ln;
    },
    deleteRow(r){
        for(;r>=0;r--){
            this.wall[r]=this.wall[r-1];
            this.wall[r-1]=new Array(this.CN);
            for(var c=0;c<this.CN;c++){
                var cell=this.wall[r][c];
                if(cell!==undefined){
                    cell.r++;
                }
            }
            if(this.wall[r-2].join("")=="")
            break;
        }
    },
    isFullRow(r){
        return String(this.wall[r]).search(/^,|,,|,$/)==-1;//没找到说明是满格
    },
    paint(){
        var reg=/<img [^>]*>/g;
        this.pg.innerHTML=this.pg.innerHTML.replace(reg,"");
        this.paintShape();
        this.paintWall();
        this.paintNext();
        this.paintScore();
        this.paintState();
    },
    paintState(){//根据游戏状态绘制图片
        if(this.state==this.GAMEOVER){
            var img=new Image();
            img.style.width="100%";
            img.src="img/game-over.png";
            this.pg.appendChild(img);
        }else if(this.state==this.PAUSE){
            var img=new Image();
            img.style.width="100%";
            img.src="img/pause.png";
            this.pg.appendChild(img);
        }
    },
    paintScore(){
        document.getElementById("score").innerHTML=this.score;
        document.getElementById("lines").innerHTML=this.lines;
    },
    paintNext(){
        var frag = document.createDocumentFragment();
        for(var i= 0;i<this.nextShape.cells.length;i++){
            var cell = this.nextShape.cells[i];
            var img=this.paintCell(cell,frag);
            img.style.left=parseFloat(img.style.left)+10*this.CSIDE+"px";
            img.style.top=parseFloat(img.style.top)+this.CSIDE+"px";
        }
        this.pg.appendChild(frag);
    },
    paintWall(){
        var frag = document.createDocumentFragment();
        for(var r=this.RN-1;r>=0;r--) {
            if (this.wall[r].join() == "")return;
            for(var c=0;c<this.CN;c++){
                var cell = this.wall[r][c];
                if(cell!==undefined){this.paintCell(cell,frag);}
            }
        }
        this.pg.appendChild(frag);
    },
    paintCell(cell,frag){
        var img = new Image();
        img.style.left = this.OFFSET+this.CSIDE*cell.c+"px";
        img.style.top = this.OFFSET+this.CSIDE*cell.r+"px";
        img.src = cell.src;
        frag.appendChild(img);
        return img;
    },
    paintShape(){
        var frag = document.createDocumentFragment();
        for(var i= 0;i<this.shape.cells.length;i++){
            var cell = this.shape.cells[i];
            this.paintCell(cell,frag);
        }
        this.pg.appendChild(frag);
    }
}
game.start();