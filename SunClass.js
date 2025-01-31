class Sun {
    constructor({ x, y, image, scale = 1, fromSkies = true }) {
        this.x = x ?? MAP.grid.x + Math.floor(Math.random() * (MAP.grid.w - 40)) + 20;
        this.y = y ?? 0;
        this.image = image;
        this.Vy = Math.floor(Math.random() * 3) + 3;
        this.ground = Math.floor(Math.random() * (canvas.height - 200)) + 120;
        this.scale = scale;
        this.w = UTILITIES.sun.w * this.scale;
        this.h = UTILITIES.sun.h * this.scale;
        this.claimed = false;
        this.claimVx = 0;
        this.claimVy = 0;
        this.fromSkies = fromSkies;

        // NONE SKIES SUNS (Variables)
        this.animationComplete = false;
        this.startTime = Date.now();
        this.originX = this.x;
        this.originY = this.y;
        // ---------------

    }

    draw() {
        // NONE SKIES SUNS (Animation)
        if (!this.claimed && !this.fromSkies && !this.animationComplete) {
            let p = Math.min((Date.now() - this.startTime) / 1000, 1);
            this.x = this.originX;
            this.y = this.originY - Math.sin(p * Math.PI) * 40;
            if (p === 1) this.animationComplete = true;
        }
        // ---------------

        ctx.drawImage(this.image, UTILITIES.sun.x, UTILITIES.sun.y, UTILITIES.sun.w, UTILITIES.sun.h, this.x, this.y, this.w, this.h); if (!this.claimed && this.y < this.ground && this.fromSkies) { this.y += this.Vy; }

        if (this.claimed) {
            const dx = topbar.x - this.x;
            const dy = topbar.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = Math.min(distance * 0.2, 20);
            const angle = Math.atan2(dy, dx);
            this.claimVx = Math.cos(angle) * speed;
            this.claimVy = Math.sin(angle) * speed;

            this.y += this.claimVy;
            this.x += this.claimVx;

            if (Math.abs(this.y - topbar.y) <= 10 && Math.abs(this.x - topbar.x) <= 10) {
                suns = suns.filter(s => s !== this);
                collectedSuns += 25;
            }
        }

        if (Date.now() - this.startTime > 10000 && !this.claimed) {
            suns = suns.filter(s => s !== this);
        }
    }
}