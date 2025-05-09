//변수값들 정리!
let mic;
let vol = 0;
let smoothVol = 0;
let wave = [];
let threshold = 0.05;
let changeThreshold = 0.02;
let lastSmoothVol = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 화면전체 배경색
  background(255); 

  mic = new p5.AudioIn();
  mic.start(onMicStart, onMicError);
}

  // 마이크 작동되는지 여부 확인
function onMicStart() {
  console.log("🎤 가보자고");
}

function onMicError(err) {
  console.error("🚫 안되겄다:", err);
}

function draw() {
  // 아이보리 배경 + 살짝 잔상효과 유지
  background(255, 253, 240, 50); 

  let centerY = height / 2;
  
  if (mic) {
    vol = mic.getLevel();
        // smoothVol이 vol을 서서히 따라가도록
    smoothVol = lerp(smoothVol, vol, 0.1); // ← 0.1은 반응 속도 조절 (0.01 ~ 0.3)

    let diameter = map(smoothVol, 0, 1, 50, width);

    // 진폭변화량이 changeThreshold 이상일 때만 파동표현
    let volChange = abs(smoothVol - lastSmoothVol);

    if (smoothVol > threshold && volChange > changeThreshold) {
   
      wave.push(smoothVol); // 진폭을 배열에 추가

    // 배열의 길이가 너무 길어지면 오래된 값을 제거
    if (wave.length > width) {
      wave.shift();
    }
    
      // 파동 선 색상
    stroke('#B8B4A8'); 
    noFill();
    beginShape();
    
    // 파동을 선으로 그리기
   beginShape();
for (let i = 0; i < wave.length; i++) {
  let x = i * (width / wave.length);
  let y = centerY + (wave[i] - 0.5) * 600;
  curveVertex(x, y);
}
endShape();

    }
    
    // 🎯 크기-색상이 붉은 계열로 변하도록
let baseRadius = 100; // 원의 기본 크기
let radius = baseRadius + smoothVol * 500;

// 볼륨이 커질수록 파란색 → 붉은색 자연 전환
let c = lerpColor(color('#D7E9F7'), color('#E63946'), constrain((radius - baseRadius) / baseRadius, 0, 1));

fill(c);
noStroke();
ellipse(width / 2, centerY, radius, radius);

      lastSmoothVol = smoothVol;
  }
}
  
