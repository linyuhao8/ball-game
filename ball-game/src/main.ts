const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const canvasHeight: number = canvas.height;
const canvasWidth: number = canvas.width;
const ctx = canvas.getContext("2d")!; // ts使用非空斷言運算符

//Interval id
let game: number;
//初始位置
let ball_x = 160;
let ball_y = 60;
//半徑
let radius = 20;
//每秒移動速度
let xSpeed = 20;
let ySpeed = 20;
//地板
let floorHeight = 50;
let floorWidth = 150;
let floor_x = 100;
let floor_y = 500;

function drawBg() {
  //背景canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawBall() {
  //畫一個圓
  ctx.beginPath();
  ctx.arc(ball_x, ball_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.fill();
  //先讓圓往右下角走
  ball_x += xSpeed;
  ball_y += ySpeed;
  //撞到上
  if (ball_y <= 0 + radius) {
    ySpeed = -ySpeed;
  }
  //撞到左
  if (ball_x <= 0 + radius) {
    xSpeed = -xSpeed;
  }
  //撞到下牆
  if (ball_y >= canvasHeight - radius) {
    ySpeed = -ySpeed;
  }
  //撞到右
  if (ball_x >= canvasWidth - radius) {
    xSpeed = -xSpeed;
  }
}

function drawFloor() {
  //地板
  ctx.fillStyle = "blue";
  ctx.fillRect(floor_x, floor_y, floorWidth, floorHeight);
  //滑鼠移動
  canvas.addEventListener("mousemove", (e) => {
    //讓floor對齊滑鼠中間
    floor_x = e.clientX - floorWidth / 2;
    //不讓地板超過左右canvas
    if (e.clientX > canvasWidth - floorWidth) {
      floor_x = canvasWidth - floorWidth;
    }
    if (e.clientX < floorWidth) {
      floor_x = 0;
    }
  });

  //怎麼讓ball可以回彈
  //偵測出發兩邊回彈，還是上下回彈
  let ballIsSide: boolean = false;
  loadBallSide();
  function loadBallSide() {
    // 左側
    if (
      ball_x + radius <= floor_x && // 球的右邊在地板的左邊
      ball_x - radius >= 0 && // 球的左邊大於畫布的左邊界
      ball_y + radius >= floor_y && // 球的底部在地板的頂部以下
      ball_y - radius <= floor_y + floorHeight // 球的頂部在地板的底部以上
    ) {
      ballIsSide = true;
      return; // 已經判斷在左側，直接返回
    }

    // 右側
    if (
      ball_x - radius >= floor_x + floorWidth && // 球的左邊在地板的右邊
      ball_x + radius <= canvasWidth && // 球的右邊小於畫布的右邊界
      ball_y + radius >= floor_y && // 球的底部在地板的頂部以下
      ball_y - radius <= floor_y + floorHeight // 球的頂部在地板的底部以上
    ) {
      ballIsSide = true;
      return; // 已經判斷在右側，直接返回
    }

    // 如果不在左側或右側
    ballIsSide = false;
  }

  console.log(ballIsSide);
  //球Ｘ座標只要接觸到floorWidth又同時Y也接觸，實現上下反彈
  // ooo
  // ---
  // ooo
  //上下反彈的邏輯
  if (!ballIsSide) {
    if (
      ball_x + radius >= floor_x &&
      ball_x - radius <= floor_x + floorWidth &&
      ball_y + radius >= floor_y &&
      ball_y - radius <= floor_y + floorHeight
    ) {
      ySpeed = -ySpeed;
    }
  }

  //左右反彈邏輯
  //球的X接觸到左邊或右邊，球的Y又剛好進入floor_y之間
  //o --- o
  // 左右邊界反彈

  if (ballIsSide) {
    // 左邊界碰撞
    if (
      ball_x + radius >= floor_x && // 球的右邊超過地板左邊
      ball_x - radius <= floor_x && // 球的左邊小於地板左邊
      ball_y + radius >= floor_y && // 球的底部在地板的頂部以下
      ball_y - radius <= floor_y + floorHeight // 球的頂部在地板的底部以上
    ) {
      xSpeed = -Math.abs(xSpeed); // 向左反彈
      ball_x = floor_x - radius; // 修正位置到地板左側外
    }

    // 右邊界碰撞
    else if (
      ball_x - radius <= floor_x + floorWidth && // 球的左邊超過地板右邊
      ball_x + radius >= floor_x + floorWidth && // 球的右邊超過地板右邊
      ball_y + radius >= floor_y && // 球的底部在地板的頂部以下
      ball_y - radius <= floor_y + floorHeight // 球的頂部在地板的底部以上
    ) {
      xSpeed = Math.abs(xSpeed); // 向右反彈
      ball_x = floor_x + floorWidth + radius; // 修正位置到地板右側外
    }
  }
}

//開始遊戲
function startgame() {
  game = setInterval(draw, 100);
}

startgame();
function draw() {
  drawBg();
  drawBall();
  drawFloor();
}
