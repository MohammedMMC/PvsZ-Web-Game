class Topbar {
    constructor({
        x = 0, y = 0, image, plantsCount, slotsCount
    }) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.plantsCount = plantsCount;
        this.gap = 10;
        this.w = UTILITIES.topbar.left.w + UTILITIES.topbar.slot.w * this.plantsCount + this.gap * (this.plantsCount - 1) + UTILITIES.topbar.right.w;
        this.h = UTILITIES.topbar.middle.h;
    }

    drawSlots() {
        Object.values(selectedPlants).forEach((plant, i) => {
            let plantImage = new Image();
            plantImage.src = plant.image;

            // DRAW SLOT
            if (collectedSuns < plant.price) ctx.filter = "brightness(0.75)";
            ctx.drawImage(this.image,
                UTILITIES.topbar.slot.x,
                UTILITIES.topbar.slot.y,
                UTILITIES.topbar.slot.w,
                UTILITIES.topbar.slot.h,
                this.x + UTILITIES.topbar.left.w + UTILITIES.topbar.slot.w * i + this.gap * i - 8,
                this.y + 12,
                UTILITIES.topbar.slot.w,
                UTILITIES.topbar.slot.h
            );

            // DRAW PLANT
            ctx.drawImage(plantImage,
                0, 0,
                plant.w, plant.h,
                this.x + UTILITIES.topbar.left.w + UTILITIES.topbar.slot.w * i + this.gap * i - 8,
                this.y + 12,
                54, 54
            );

            topbarPlantsData.push({
                x: this.x + UTILITIES.topbar.left.w + UTILITIES.topbar.slot.w * i + this.gap * i - 8,
                y: this.y + 12,
                w: UTILITIES.topbar.slot.w,
                h: UTILITIES.topbar.slot.h,
                plant: { ...plant, loadedImage: plantImage }
            });

            // DRAW PRICE
            ctx.font = "16px GameFont";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.fillText(plant.price,
                this.x + UTILITIES.topbar.left.w + UTILITIES.topbar.slot.w * i + this.gap * i - 8 + 27,
                this.y + 12 + 67
            );
            ctx.filter = "brightness(1)";
        });
    }

    draw() {
        ctx.drawImage(this.image,
            UTILITIES.topbar.left.x,
            UTILITIES.topbar.left.y,
            UTILITIES.topbar.left.w,
            UTILITIES.topbar.left.h,
            this.x, this.y,
            UTILITIES.topbar.left.w,
            UTILITIES.topbar.left.h
        );
        ctx.drawImage(this.image,
            UTILITIES.topbar.middle.x,
            UTILITIES.topbar.middle.y,
            UTILITIES.topbar.middle.w,
            UTILITIES.topbar.middle.h,
            this.x + UTILITIES.topbar.left.w,
            this.y,
            UTILITIES.topbar.slot.w * this.plantsCount + this.gap * (this.plantsCount - 2),
            UTILITIES.topbar.middle.h
        );
        ctx.drawImage(this.image,
            UTILITIES.topbar.right.x,
            UTILITIES.topbar.right.y,
            UTILITIES.topbar.right.w,
            UTILITIES.topbar.right.h,
            this.x + UTILITIES.topbar.left.w + UTILITIES.topbar.slot.w * this.plantsCount + this.gap * (this.plantsCount - 1) - 16,
            this.y,
            UTILITIES.topbar.right.w,
            UTILITIES.topbar.right.h
        );

        // DRAW COLLECTED SUNS COUNT
        ctx.font = "18px GameFont";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.fillText(collectedSuns, this.x + 37, this.y + 80);

        this.drawSlots();
    }
}