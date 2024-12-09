const catImage = document.querySelector(".cat");
const love = document.querySelector("#love");
const loveText = document.querySelector("#love-text");
const hungerBar = document.getElementById("hunger-bar");
const happinessBar = document.getElementById("happiness-bar");
const cleanlinessBar = document.getElementById("cleanliness-bar");
const cat = document.getElementById("cat");
const items = document.querySelectorAll(".item");

const DECAY_INTERVAL = 100;
const DECAY_AMOUNT = 0.1;

const gauges = {
  hunger: 0,
  happiness: 0,
  cleanliness: 0,
};

let hunger_ = 0;
let happy_ = 0;
let clean_ = 0;
let love_ = 0;

window.addEventListener("message", (event) => {
  if (event.data.type === "LOAD_GAME_DATA") {
    const gameData = event.data.data;

    // Update gauges
    updateGauge(hungerBar, gameData.hunger, "배고픔", "orange", "hunger");
    updateGauge(
      happinessBar,
      gameData.happiness,
      "행복감",
      "yellow",
      "happiness"
    );
    updateGauge(
      cleanlinessBar,
      gameData.cleanliness,
      "청결도",
      "aqua",
      "cleanliness"
    );

    // Update love
    love_ = gameData.love;
    LikeText();
  }
});

function loadValues() {
  const savedHunger = localStorage.getItem("hunger_");
  const savedHappy = localStorage.getItem("happy_");
  const savedClean = localStorage.getItem("clean_");
  const savedLove = localStorage.getItem("love_");

  if (savedHunger) {
    hunger_ = parseInt(savedHunger, 10);
    updateGauge(hungerBar, hunger_, "배고픔", "orange", "hunger");
  }
  if (savedHappy) {
    happy_ = parseInt(savedHappy, 10);
    updateGauge(happinessBar, happy_, "행복감", "yellow", "happiness");
  }
  if (savedClean) {
    clean_ = parseInt(savedClean, 10);
    updateGauge(cleanlinessBar, clean_, "청결도", "aqua", "cleanliness");
  }
  if (savedLove) {
    console.log("dd");
    love_ = parseInt(savedLove, 10);
    love.innerHTML = "친밀도 : " + love_;
  }

  console.log("Loaded values:", { hunger_, happy_, clean_, love_ });
}

function saveValues() {
  localStorage.setItem("hunger_", hunger_);
  localStorage.setItem("happy_", happy_);
  localStorage.setItem("clean_", clean_);
  localStorage.setItem("love_", love_);
  console.log("Saved values:", { hunger_, happy_, clean_, love_ });

  window.parent.postMessage(
    {
      type: "SAVE_GAME_DATA",
      data: {
        hunger: parseInt(hungerBar.style.width),
        happiness: parseInt(happinessBar.style.width),
        cleanliness: parseInt(cleanlinessBar.style.width),
        love: love_,
      },
    },
    "*"
  );
}

loadValues();

items.forEach((item) => {
  item.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("item-id", e.target.id);
  });
});

cat.addEventListener("dragover", (e) => {
  e.preventDefault();
});

cat.addEventListener("click", () => {});

cat.addEventListener("drop", (e) => {
  e.preventDefault();
  const itemId = e.dataTransfer.getData("item-id");

  switch (itemId) {
    case "food":
      updateGauge(hungerBar, 20, "배고픔", "orange", "hunger");
      break;
    case "pet":
      updateGauge(happinessBar, 20, "행복감", "yellow", "happiness");
      break;
    case "clean":
      updateGauge(cleanlinessBar, 20, "청결도", "aqua", "cleanliness");
      break;
    default:
      alert("알 수 없는 동작입니다.");
  }
});
function LikeText() {
  var pharse = "";
  if (love_ < 100) {
    pharse = "낯선 사람";
  } else if (love_ < 300) {
    pharse = "배고플 때 밥 주는 사람";
  } else if (love_ < 500) {
    pharse = "놀아주는 사람";
  } else if (love_ < 700) {
    pharse = "쓰다듬어주는 사람";
  } else if (love_ < 1000) {
    pharse = "옆에서 같이 자는 사람";
  } else if (love_ < 1200) {
    pharse = "친구";
  } else {
    pharse = "가족";
  }
  loveText.innerHTML = pharse;
  love.innerHTML = "친밀도 : " + love_;
}
function LikeUp() {
  const hungerWidth = parseInt(hungerBar.style.width, 10);
  const happinessWidth = parseInt(happinessBar.style.width, 10);
  const cleanlinessWidth = parseInt(cleanlinessBar.style.width, 10);

  if (hungerWidth >= 40 && happinessWidth >= 40 && cleanlinessWidth >= 40) {
    love_++;
  }
  LikeText();
}
setInterval(LikeUp, 500);

LikeText();
function updateGauge(bar, amount, type, color, gaugeType) {
  const currentWidth = parseInt(bar.style.width || "0");
  const newWidth = Math.min(100, currentWidth + amount);

  gauges[gaugeType] = newWidth;

  bar.style.width = newWidth + "%";
  bar.style.backgroundColor = "rgba(0,0,0,0.5)";
  bar.style.boxShadow = `0 0 10px ${color}`;

  if (newWidth >= 40) {
    bar.style.backgroundColor = color;
    // setTimeout(() => alert(`${type} 게이지가 가득 찼어요!`), 100);
  }
}

function savingBarData() {
  hunger_ = hungerBar.style.width;
  happy_ = happinessBar.style.width;
  clean_ = cleanlinessBar.style.width;
  saveValues();
}

function decayGauges() {
  const gaugeElements = {
    hunger: hungerBar,
    happiness: happinessBar,
    cleanliness: cleanlinessBar,
  };

  Object.keys(gauges).forEach((type) => {
    if (gauges[type] > 0) {
      const newValue = Math.max(0, gauges[type] - DECAY_AMOUNT);
      gauges[type] = newValue;
      gaugeElements[type].style.width = newValue + "%";
      if (newValue < 40) {
        gaugeElements[type].style.backgroundColor = "rgba(0,0,0,0.5)";
      }
    }
  });
}

setInterval(decayGauges, DECAY_INTERVAL);

window.addEventListener("beforeunload", (event) => {
  savingBarData();
});
