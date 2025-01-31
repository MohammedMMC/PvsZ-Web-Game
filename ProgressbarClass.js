class Progressbar {
    constructor({
        x = 0, y = 0, image, progress = 0, flagsCount = 1
    }) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.progress = progress;
        this.flagsCount = flagsCount;
    }

    draw() {
        // BAR BACKGROUND
        ctx.drawImage(this.image,
            UTILITIES.progressbar.x,
            UTILITIES.progressbar.y,
            UTILITIES.progressbar.w,
            UTILITIES.progressbar.h,
            this.x,
            this.y,
            UTILITIES.progressbar.w,
            UTILITIES.progressbar.h
        );

        // BAR PROGRESS
        ctx.drawImage(this.image,
            UTILITIES.progressbarfill.x + UTILITIES.progressbarfill.w * ((100 - this.progress) / 100),
            UTILITIES.progressbarfill.y,
            UTILITIES.progressbarfill.w,
            UTILITIES.progressbarfill.h,
            this.x + 8 + UTILITIES.progressbarfill.w * ((100 - this.progress) / 100),
            this.y + 8,
            UTILITIES.progressbarfill.w,
            UTILITIES.progressbarfill.h
        );

        // DRAW FLAG
        for (let i = 0; i < this.flagsCount; i++) {
            ctx.drawImage(this.image,
                UTILITIES.flag.x,
                UTILITIES.flag.y,
                UTILITIES.flag.w,
                UTILITIES.flag.h,
                this.x + (UTILITIES.progressbar.w / (this.flagsCount * 1.2)) * i + 8,
                this.y - 6,
                UTILITIES.flag.w,
                UTILITIES.flag.h
            );
        }

        // DRAW ZOMBIE HEAD
        ctx.drawImage(this.image,
            UTILITIES.zombiehead.x,
            UTILITIES.zombiehead.y,
            UTILITIES.zombiehead.w,
            UTILITIES.zombiehead.h,
            this.x + 8 + UTILITIES.progressbarfill.w * ((100 - this.progress) / 100) - 18,
            this.y + 2,
            UTILITIES.zombiehead.w,
            UTILITIES.zombiehead.h
        );
    }
}