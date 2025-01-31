class Zombie {
    /**
     * @param {{x: number, y: number, Gy: number, zombie: {imageSrc: string, health: number, speed: number, attack: number, attackSpeed: number, attackRange: number, frames: number, w: number, h: number}} param0
    */
    constructor({
        x = canvas.width,
        y,
        Gy,
        zombie,
        scale = 1.6
    }) {
        this.Gy = Gy;
        this.x = x;
        this.y = y ?? (MAP.grid.y + Gy * MAP.grid.h / 5 + (MAP.grid.h / 5 - 100) / 2);
        this.image = new Image();
        this.image.src = zombie.imageSrc;
        this.zombie = zombie;
        this.scale = scale;
        this.framesElapsed = 0;
        this.frame = 1;
    }

    draw() {
        if (++this.framesElapsed % 15 === 0) {
            this.direction = this.direction ?? 1;
            this.frame += this.direction;
            
            if (this.frame >= this.zombie.frames || this.frame <= 1) {
                this.direction *= -1;
                this.frame = this.frame >= this.zombie.frames ? this.zombie.frames : 1;
            }
        this.x -= 0.4 * this.zombie.speed * 15;

        }

        ctx.drawImage(this.image,
            this.zombie.w * (this.frame - 1), 0,
            this.zombie.w, this.zombie.h,
            this.x,
            this.y + (MAP.grid.h / 5) / 2 + 30 - this.zombie.h * this.scale,
            this.zombie.w * this.scale,
            this.zombie.h * this.scale
        );
    }
}