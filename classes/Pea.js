class Pea {
    constructor({ x, y, Gx, Gy, image, scale = 1, damage = 20 }) {
        this.x = x;
        this.y = y;
        this.Gx = Gx;
        this.Gy = Gy;
        this.image = image;
        this.Vx = 5;
        this.scale = scale;
        this.damage = damage;
    }

    draw() {
        this.x += this.Vx;
        ctx.drawImage(this.image,
            0, 0,
            this.image.width, this.image.height,
            this.x + MAP.grid.w / 8 - this.image.width,
            this.y + 18,
            30, 30
        );
        if (this.x >= canvas.width) {
            peas = peas.filter(p => p !== this);
        }
        zombiesGrid.filter(z => z.Gy === this.Gy && checkCollide({
            h1: 30, w1: 30,
            x1: this.x + MAP.grid.w / 8 - this.image.width,
            y1: this.y + 18
        }, {
            h2: z.zombie.h * z.scale,
            w2: z.zombie.w * z.scale,
            x2: z.x,
            y2: z.y + (MAP.grid.h / 5) / 2 + 30 - z.zombie.h * z.scale
        })).map(z => {
            z.zombie.health -= this.damage;
            peas = peas.filter(p => p !== this);
        });
    }
}