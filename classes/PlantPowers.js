class PlantPowers {
    /**
     * @param {{ name: string, image: string, price: number, damage: number, range: number, health: number, frames: number, w: number, h: number }} plant 
     * @param {{ x: number, y: number, Gx: number, Gy: number }} grid 
     */
    constructor(plant, grid) {
        this.startTime = Date.now();
        this.seconds = 0;
        this.powerSent = false;

        this.projectileImage = new Image();
        if (plant.projectile) this.projectileImage.src = plant.projectile;

        /** @type {plant} */
        this.plant = plant;
        /** @type {grid} */
        this.grid = grid;
    }

    tick() {
        // Update Time
        this.seconds = Math.floor((Date.now() - this.startTime) / 1000);

        // Check Plant
        if (this.plant.name === "Sunflower") {
            if (this.seconds % 24 === 0) {
                if (this.powerSent) return;
                this.powerSent = true;
                this.generateFlower(1.3);
            } else { this.powerSent = false; }
        } else if (this.plant.name === "Peashooter") {
            if (this.seconds % 1.5 === 0) {
                if (this.powerSent) return;
                this.powerSent = true;
                if (zombiesGrid.map(z => z.Gy === this.grid.Gy && z.x >= this.grid.x).includes(true)) {
                    this.generatePea();
                }
            } else { this.powerSent = false; }
        }
    }

    generateFlower(scale = 1.5) {
        suns.push(new Sun({
            fromSkies: false, image: utilitiesImage, scale,
            x: this.grid.x + (MAP.grid.w / 8) / (3 + Math.random()), y: this.grid.y + 10 + (Math.random() * 10)
        }));
    }

    generatePea() {
        peas.push(new Pea({
            image: this.projectileImage,
            ...this.grid, damage: this.plant.damage
        })
        );

    }
}