//定义格子
function Cell(r,c,src){
    this.r=r;this.c=c;this.src=src;
}
//定义父类型Shape图形
function Shape(r0,c0,r1,c1,r2,c2,r3,c3,src,states,orgi){
    this.cells = [
      new Cell(r0,c0,src),
      new Cell(r1,c1,src),
      new Cell(r2,c2,src),
      new Cell(r3,c3,src)
    ];
    this.states=states;//旋转状态数组
    this.orgCell=this.cells[orgi];//根据下标获得参照格
    this.statei=0;
}
//在Shape原型中定义下移，左右移，旋转方法
Shape.prototype = {
    moveDown(){
        for(var i=0;i<this.cells.length;i++){
            this.cells[i].r++;
        }
    },
    moveLeft(){
        for(var i=0;i<this.cells.length;i++){
            this.cells[i].c--;
        }
    },
    moveRight(){
        for(var i=0;i<this.cells.length;i++){
            this.cells[i].c++;
        }
    },
    rotateR(){
        this.statei++;
        this.statei==this.states.length&&(this.statei=0);
        this.rotate();

    },
    rotateL(){
        this.statei--;
        this.statei==-1&&(this.statei=this.states.length-1);
        this.rotate();
    },
    rotate(){
        var state=this.states[this.statei];
        for(var i=0;i<this.cells.length;i++){
            var cell=this.cells[i];
            if(cell!==this.orgCell){
                cell.r=this.orgCell.r+state["r"+i];
                cell.c=this.orgCell.c+state["c"+i];
            }
        }
    }
}
//定义状态类型State
function State(r0,c0,r1,c1,r2,c2,r3,c3){//参数为偏移量
    this.r0=r0;this.c0=c0;
    this.r1=r1;this.c1=c1;
    this.r2=r2;this.c2=c2;
    this.r3=r3;this.c3=c3;
}
//定义子类型图形
function T(){
    Shape.call(this,
        0,3,0,4,0,5,1,4,
        "img/T.png",
        [
            new State(0,-1,0,0,0,+1,+1,0),
            new State(-1,0,0,0,+1,0,0,-1),
            new State(0,+1,0,0,0,-1,-1,0),
            new State(+1,0,0,0,-1,0,0,+1)
        ],
        1
    );

}
Object.setPrototypeOf(T.prototype,Shape.prototype);
function I(){
    Shape.call(this,
        0,3,0,4,0,5,0,6,
        "img/I.png",
        [
            new State(0,-1,0,0,0,+1,0,+2),
            new State(-1,0,0,0,+1,0,+2,0)
        ],
        1
    );
}
Object.setPrototypeOf(I.prototype,Shape.prototype);
function O(){
    Shape.call(this,
        0,4,0,5,1,4,1,5,
        "img/O.png",
        [
            new State(0,-1,0,0,+1,-1,+1,0)
        ],
        1
    );
}
Object.setPrototypeOf(O.prototype,Shape.prototype);