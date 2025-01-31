const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

/** @type {Array<{name: string,path: string,grid: {x: number,y: number,w: number,h: number}}>} */
const MAPS = getJSON("./maps/Maps.json");
const MAP = MAPS[0];

/** @type {{[key: string]: {[key: string]: {x: number, y: number, w: number, h: number}} | {x: number, y: number, w: number, h: number}}} */
const UTILITIES = getJSON("./exp/PvsZ Utilities2.json");

/** @type {{[key: string]: {x: number, y: number, w: number, h: number}}} */
const GROUNDS = getJSON("./exp/PvsZ Utilities.json");

/** @type {{[key: string]: {name: string, image: string, price: number, damage: number, range: number, health: number, frames: number, w: number, h: number}}} */
const PLANTS = getJSON("./plants/plants.json");

/** @type {{[key: string]: {imageSrc: string, health: number, speed: number, attack: number, attackSpeed: number, attackRange: number, frames: number, w: number, h: number}}} */
const ZOMBIES = getJSON("./zombies/zombies.json");

/** @type {{level: string, map: null, waves: Array<{[key: string]: number}>, prize: string}} */
const LEVEL1_1 = getJSON("./levels/1-1.json");


// Canvas Size
canvas.width = 1024;
canvas.height = 576;

// canvas.width = 1280;
// canvas.height = 768;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const gameMapImage = new Image();
gameMapImage.onload = animate;
gameMapImage.src = MAP.path;

let utilitiesImage = new Image();
utilitiesImage.src = "./exp/PvsZ Utilities2.png";
let groundsImage = new Image();
groundsImage.src = "./exp/PvsZ Utilities.png";

(new FontFace('GameFont', 'url(./font.ttf)')).load()
    .then(font => document.fonts.add(font));

// GAME VARIABLES
/** @type {Array<Sun>} */
let suns = [];
let collectedSuns = 100;
let selectedPlants = PLANTS;
/** @type {Array<{x: number,y: number,w: number,h: number, plant: PLANTS[key: string]}>} */
let topbarPlantsData = [];
/** @type {PLANTS[key: string] | null} */
let holdingPlant = null;

/** @type {Array<{Gx: number,Gy: number, plant: PLANTS[key: string]}>} */
let plantsGrid = [];

/** @type {Array<Zombie>} */
let zombiesGrid = [];

let mouseX = 0;
let mouseY = 0;
let framesElapsed = 0;

let currentWave = 0;
let waveStartTime = Date.now();
let zombiesInWave = 0;

setInterval(() => suns.push(new Sun({ image: utilitiesImage, scale: 1.5 })), 8000);

const topbar = new Topbar({
    x: 230,
    y: 1,
    image: utilitiesImage,
    plantsCount: 6
});

const progressbar = new Progressbar({
    x: canvas.width - UTILITIES.progressbar.w - 50,
    y: canvas.height - UTILITIES.progressbar.h - 1,
    image: utilitiesImage
});

function animate() {
    const animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gameMapImage, 0, 0);


    // DRAW GRID
    for (let c = -1; c <= 5; c++) {
        for (let r = -1; r <= 8; r++) {
            let isDarker = ((r + 1) % 2 === 1 && (c + 1) % 2 === 1) || ((r + 1) % 2 === 0 && (c + 1) % 2 === 0);

            // Corners
            let groundPlace = c == -1 && r == -1 ? "TL" : c == -1 && r == 8 ? "TR" : c == 5 && r == -1 ? "BL" : c == 5 && r == 8 ? "BR" : null;
            if (groundPlace) isDarker = !isDarker;

            // if no corners check normal grounds
            if (!groundPlace) groundPlace = c == -1 ? "TM" : c == 5 ? "BM" : r == -1 ? "ML" : r == 8 ? "MR" : "MM";
            if (groundPlace === "MM") isDarker = !isDarker;

            // Draw
            const ground = GROUNDS[`light${isDarker ? "1" : "2"}${groundPlace}`];
            ctx.drawImage(groundsImage,
                ground.x, ground.y,
                ground.w, ground.h,
                MAP.grid.x + MAP.grid.w / 8 * r,
                MAP.grid.y + MAP.grid.h / 5 * c,
                MAP.grid.w / 8,
                MAP.grid.h / 5
            );
        }
    }

    // DRAW TOPBAR - PROGRESSBAR
    topbar.draw();
    progressbar.draw();

    // DRAW PLANTS ON GRID
    framesElapsed++;
    plantsGrid.forEach(pg => {
        // DRAW PLANT
        if (!pg.plant.frame) pg.plant.frame = 0;
        if (!pg.plant.reverse) pg.plant.reverse = false;
        if (framesElapsed % Math.ceil(25 / pg.plant.frames) === 0) {
            if (!pg.plant.reverse) {
                if (pg.plant.frame < pg.plant.frames - 1) {
                    pg.plant.frame = pg.plant.frame + 1;
                } else {
                    pg.plant.reverse = true;
                    pg.plant.frame = pg.plant.frames - 2;
                }
            } else {
                if (pg.plant.frame > 0) {
                    pg.plant.frame = pg.plant.frame - 1;
                } else {
                    pg.plant.reverse = false;
                    pg.plant.frame = 1;
                }
            }
        }
        let gridXpos = MAP.grid.x + pg.Gx * MAP.grid.w / 8 + (MAP.grid.w / 8 - 100) / 2;
        let gridYpos = MAP.grid.y + pg.Gy * MAP.grid.h / 5 + (MAP.grid.h / 5 - 100) / 2;
        ctx.drawImage(pg.plant.loadedImage,
            pg.plant.w * pg.plant.frame, 0,
            pg.plant.w, pg.plant.h,
            gridXpos, gridYpos,
            100, 100);

        // PLANT POWERS
        if (!pg.plant.power) pg.plant.power = new PlantPowers(pg.plant, { x: gridXpos, y: gridYpos })
        pg.plant.power.tick();

    });

    // HANDLE ZOMBIE WAVES - RAW ZOMBIES
    if (currentWave < LEVEL1_1.waves.length) {
        const waveElapsedTime = (Date.now() - waveStartTime) / 1000;
        const currentWaveZombies = Object.values(LEVEL1_1.waves[currentWave]).reduce((a, b) => a + b, 0);
        
        progressbar.progress = Math.min(((currentWave * 60 + Math.min(waveElapsedTime, 60)) / ((LEVEL1_1.waves.length - 1) * 60)) * 100, 100);

        if (waveElapsedTime >= 60) {
            currentWave++;
            waveStartTime = Date.now();
            zombiesInWave = 0;
        } else if (waveElapsedTime >= 5 && zombiesInWave < currentWaveZombies && waveElapsedTime >= 10 + ((55 / currentWaveZombies) * zombiesInWave)) {
            const zombieTypes = [];
            Object.entries(LEVEL1_1.waves[currentWave]).forEach(([type, count]) => zombieTypes.push(...Array(count).fill(type)));
            
            console.log(`Spawning ${zombieTypes[Math.floor(Math.random() * zombieTypes.length)]} in row ${Math.floor(Math.random() * 5)}`);
            zombiesInWave++;
        }
    } else {
        console.log("Level Complete!");
    }

    // DRAW HOLDED PLANT
    if (holdingPlant !== null) {
        canvas.style.cursor = "grabbing";

        const gridX = Math.floor((mouseX - MAP.grid.x) / (MAP.grid.w / 8));
        const gridY = Math.floor((mouseY - MAP.grid.y) / (MAP.grid.h / 5));

        if (
            gridX >= 0 && gridX < 8 && gridY >= 0 && gridY < 5
            && !plantsGrid.map(pg => pg.Gx === gridX && pg.Gy === gridY).includes(true)
        ) {
            // DRAW the plant in the grid that the mouse on
            ctx.globalAlpha = 0.2;
            ctx.drawImage(holdingPlant.loadedImage, 0, 0, holdingPlant.w, holdingPlant.h,
                MAP.grid.x + gridX * MAP.grid.w / 8 + (MAP.grid.w / 8 - 100) / 2,
                MAP.grid.y + gridY * MAP.grid.h / 5 + (MAP.grid.h / 5 - 100) / 2,
                100, 100);
            ctx.globalAlpha = 1;
        }

        // DRAW the moving plant the mouse
        ctx.drawImage(holdingPlant.loadedImage,
            0, 0,
            holdingPlant.w, holdingPlant.h,
            mouseX - 50, mouseY - 50,
            100, 100
        );
    }


    // DRAW FALLING SUNS
    suns.forEach(s => s.draw());

    // cancelAnimationFrame(animationId);
}

canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    if (
        suns.filter(s => !s.claimed).map(s => checkMouseTouching({ mx: e.offsetX, my: e.offsetY, ...s })).includes(true)
        || topbarPlantsData.filter(p => collectedSuns >= p.plant.price).map(p => checkMouseTouching({ mx: e.offsetX, my: e.offsetY, ...p })).includes(true)
    ) {
        canvas.style.cursor = "pointer";
    } else {
        canvas.style.cursor = "default";
    }
});

canvas.addEventListener("mousedown", (e) => e.button === 2 ? holdingPlant = null : null);
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

canvas.addEventListener("click", (e) => {
    suns.filter(s => checkMouseTouching({ mx: e.offsetX, my: e.offsetY, ...s }) && !s.claimed).forEach(s => s.claimed = true);

    topbarPlantsData.filter(p => checkMouseTouching({ mx: e.offsetX, my: e.offsetY, ...p })).forEach(p => {
        if (collectedSuns >= p.plant.price) {
            holdingPlant = p.plant;
        }
    });

    if (holdingPlant) {
        const gridX = Math.floor((mouseX - MAP.grid.x) / (MAP.grid.w / 8));
        const gridY = Math.floor((mouseY - MAP.grid.y) / (MAP.grid.h / 5));

        if (
            gridX >= 0 && gridX < 8 && gridY >= 0 && gridY < 5
            && !plantsGrid.map(pg => pg.Gx === gridX && pg.Gy === gridY).includes(true)
            && !checkMouseTouching({ mx: e.offsetX, my: e.offsetY, ...topbar })
        ) {
            plantsGrid.push({ Gx: gridX, Gy: gridY, plant: holdingPlant });
            collectedSuns -= holdingPlant.price;
            holdingPlant = null;
        }
    }
});