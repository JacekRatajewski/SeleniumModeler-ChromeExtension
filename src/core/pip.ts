export class PictureInPicture {
    canvas: HTMLCanvasElement;
    video: HTMLVideoElement;
    ctx: CanvasRenderingContext2D;
    isAnimating: boolean = false;
    canvasImage: any;
    init() {
        this.canvasImage = this.canvas = this.addCanvas();
        this.video = this.addVideo();
        this.setCanvasToVideo();
        this.isAnimating = true;
        this.animate();
    }

    reset() {
        if (this.video) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            }
            this.video.remove();
        };
        if (this.canvas) this.canvas.remove();
        this.isAnimating = false;
    }

    updateCanvasImage(image) {
        this.canvasImage = image;
    }

    animate() {
        if (this != undefined)
            if (this.isAnimating == true) {
                this.ctx.drawImage(this.canvasImage, 0, 0);
                requestAnimationFrame(this.animate);
            }
    }

    setCanvasToVideo() {
        this.ctx = this.canvas.getContext("2d");
        this.video.srcObject = this.canvas.captureStream();
        this.video.onloadedmetadata = () => {
            setTimeout(() => {
                this.video.requestPictureInPicture();
            }, 500);
        };
    }

    addVideo(): HTMLVideoElement {
        let video = document.getElementById("video-sem");
        if (video == null) {
            video = document.createElement("video");
            this.appendElement(video, "video-sem");
        }
        return <HTMLVideoElement>video;
    }

    addCanvas(): HTMLCanvasElement {
        let canvas = document.getElementById("pip-sem");
        if (canvas == null) {
            canvas = document.createElement("canvas");
            this.appendElement(canvas, "pip-sem");
        }
        return <HTMLCanvasElement>canvas;
    }

    appendElement(element: HTMLElement, id) {
        element.id = id;
        element.style.position = "absolute";
        element.style.zIndex = "-1";
        element.style.opacity = "0";
        document.body.append(element);
    }

}
const pip = new PictureInPicture();
chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.method && (req.method === 'cursorMode')) {
        if (!req.isActive) {
            pip.reset();
            return;
        }
        pip.init();
    }
    res({ method: req.method });
});

chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req.method && (req.method === 'updatePip')) {
        pip.updateCanvasImage(req.image);
    }
    res({ method: req.method });
});