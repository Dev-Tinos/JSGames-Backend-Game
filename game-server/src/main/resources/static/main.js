// 캔버스 설정
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 1006;
canvas.height = 624;
document.body.appendChild(canvas);

// 게임 상태 변수
let spaceshipX = canvas.width / 2 - 20;
let spaceshipY = canvas.height - 40;
let gameOver = false;
let startTime = Date.now(); // 게임 시작 시간 저장

// 총 버틴 시간 변수
let totalElapsedTime = 0;


// 이미지 로드
let backgroundImg, spaceshipImg, gameoverImg;
let enemyImg1, enemyImg2, enemyImg3, enemyImg4;
function loadImage() {
    backgroundImg = new Image();
    backgroundImg.src = "./img/background.png";

    spaceshipImg = new Image();
    spaceshipImg.src = "./img/character.jpg";

    enemyImg1 = new Image();
    enemyImg1.src = "./img/enemy1.gif";

    enemyImg2 = new Image();
    enemyImg2.src = "./img/enemy2.gif";

    enemyImg3 = new Image();
    enemyImg3.src = "./img/enemy3.gif";

    enemyImg4 = new Image();
    enemyImg4.src = "./img/enemy4.gif";

    gameoverImg = new Image();
    gameoverImg.src = "./img/fail.png";

    skil1 = new Image();
    skil1.src = "./img/skil1.gif";

    skil2 = new Image();
    skil2.src = "./img/skil2.gif";

    skil3 = new Image();
    skil3.src = "./img/skil3.gif";
}

let enemyList = [];
function enemy() {
    this.x = 0;
    this.y = 0;
    this.img = null;

    this.init = function () {
        let minX = Math.max(spaceshipX - 100, 0);
        let maxX = Math.min(spaceshipX + 100, canvas.width - 60);
        this.x = RandomValue(minX, maxX); // 수정된 X 좌표 범위
        this.y = -60; // 화면 위에서 시작

        let randomImg = RandomValue(1, 4);
        switch (randomImg) {
            case 1:
                this.img = enemyImg1;
                break;
            case 2:
                this.img = enemyImg2;
                break;
            case 3:
                this.img = enemyImg3;
                break;
            case 4:
                this.img = enemyImg4;
                break;
        }

        enemyList.push(this);
    };
    this.update = function () {
        this.y += 1;
        if (this.x < spaceshipX + 40 && this.x + 30 > spaceshipX && this.y < spaceshipY + 40 && this.y + 30 > spaceshipY) {
            gameOver = true;
        }
    };
}

function createEnemy() {
    setInterval(function () {
        let proximityToCenter = Math.abs(spaceshipX - canvas.width / 2);
        let spawnRate = Math.max(300, 500 - proximityToCenter);

        let e = new enemy();
        e.init();
    }, 500);
}


let keysDown = {};
function setupKeyboard() {
    document.addEventListener("keydown", function (event) {
        keysDown[event.key] = true;
    });
    document.addEventListener("keyup", function (event) {
        delete keysDown[event.key];
    });
}

function Blade() {
    this.x = 0;
    this.y = 0;
    this.active = false;
    this.activationTime = 0;

    this.activate = function () {
        this.x = spaceshipX;
        this.y = spaceshipY;
        this.active = true;
        this.activationTime = Date.now();
    };

    this.update = function () {
        if (this.active) {
            // 현재 시간과 활성화 시간 비교
            if (Date.now() - this.activationTime > 2000) {
                this.active = false; // 3초 후 비활성화
            }

            // 캐릭터 위치를 부드럽게 따라가도록 업데이트
            this.x += (spaceshipX - this.x) * 0.1; // 0.1은 이동 속도 계수
            this.y += (spaceshipY - this.y) * 0.1;

            // 플레이어 주변의 적 제거
            enemyList = enemyList.filter((enemy) => {
                let distance = Math.sqrt(Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2));
                return distance > 90;
            });

            // blade 이미지 렌더링 (스킬 활성화 시)
            if (this.active) {
                ctx.drawImage(skil1, this.x - 42, this.y - 30, 150, 150); // 이미지 크기 및 위치 조정 필요
            }
        }
    };
}

let bladeSkill = new Blade();

// 칼날 생성 및 업데이트
function activateBlade() {
    bladeSkill.activate();
}

let shipList = [];

function Ship() {
    let skil3Y = canvas.height;
    let skil3X = spaceshipX;
    this.active = false;

    this.activate = function () {
        this.active = true;
        skil3Y = canvas.height;
        skil3X = spaceshipX + 15;
    };

    this.update = function () {
        if (this.active) {
            skil3Y -= 5;

            if (skil3Y <= 0) {
                this.active = false;
            }

            enemyList = enemyList.filter((enemy) => {
                let distance = Math.sqrt(Math.pow(enemy.x - skil3X, 2) + Math.pow(enemy.y - skil3Y, 2));
                return distance > 90;
            });

            // blade 이미지 렌더링 (스킬 활성화 시)
            if (this.active) {
                ctx.drawImage(skil3, skil3X, skil3Y, 150, 150); // 이미지 크기 및 위치 조정 필요
            }
        }
    };
}

let ShipSkill = new Ship();

function activateShip() {
    let newShip = new Ship(); // 새로운 배(ship) 생성
    newShip.activate(); // 배(ship) 활성화
    shipList.push(newShip); // shipList 배열에 배(ship) 추가
}

function update() {
    if ("ArrowRight" in keysDown) {
        spaceshipX += 3;
        spaceshipX = Math.min(spaceshipX, canvas.width - 40);
    }
    if ("ArrowLeft" in keysDown) {
        spaceshipX -= 3;
        spaceshipX = Math.max(spaceshipX, 0);
    }
    if ("ArrowUp" in keysDown) {
        spaceshipY -= 3;
        spaceshipY = Math.max(spaceshipY, 0);
    }
    if ("ArrowDown" in keysDown) {
        spaceshipY += 3;
        spaceshipY = Math.min(spaceshipY, canvas.height - 40);
    }

    enemyList.forEach((e) => e.update());
    bladeSkill.update();
    ShipSkill.update();

    // 현재 시간 계산
    let currentTime = Date.now();
    // 경과 시간(초) 계산
    let elapsedTime = Math.floor((currentTime - startTime) / 1000);
    totalElapsedTime = elapsedTime; // 총 버틴 시간 업데이트
}

// 게임 렌더링 함수
function render() {
    ctx.globalAlpha = 0.5;
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    bladeSkill.update();
    ShipSkill.update();

    ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY, 60, 60);

    shipList.forEach((ship) => {
        ship.update();
    });
    enemyList.forEach((e) => {
        ctx.drawImage(e.img, e.x, e.y, 60, 60);
    });


    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`총 시간: ${totalElapsedTime} 초`, 20, 50);

    if (gameOver) {
        ctx.drawImage(gameoverImg, 310, 100, 400, 400);
    }
}

function addRestartButton() {
    restartButton = document.createElement("button");
    restartButton.textContent = "다시하기";
    restartButton.style.position = "absolute";
    restartButton.style.left = "22%";
    restartButton.style.top = "36%";
    restartButton.style.transform = "translateX(-50%)";
    restartButton.style.padding = "10px 20px";
    restartButton.style.fontSize = "20px";
    restartButton.style.backgroundColor = "#6CB7F8";
    restartButton.style.color = "white";
    restartButton.style.border = "none";
    restartButton.style.cursor = "pointer";
    document.body.appendChild(restartButton);

    restartButton.addEventListener("click", function () {
        restartButton.style.display = "none"; // 버튼 숨김
        gameOver = false;
        spaceshipX = canvas.width / 2 - 20;
        spaceshipY = canvas.height - 40;
        enemyList = [];
        shipList = [];
        totalElapsedTime = 0;
        startTime = Date.now();
        createEnemy();
        main();
    });
}


function initGame() {
    setupKeyboard();
    createEnemy();
    main();
}
// 주 게임 루프 함수
function main() {
    if (!gameOver) {
        update();
        render();

        requestAnimationFrame(main);
        if (Math.random() < 0.001) {
            activateBlade();
        }
        if (Math.random() < 0.002) {
            activateShip();
        }
    } else {
        ctx.drawImage(gameoverImg, 310, 100, 400, 400);
        addRestartButton();
    }
}

// 게임 초기화 및 실행
loadImage();
setupKeyboard();
createEnemy();
render();
main();

// 유틸리티 함수
function RandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
