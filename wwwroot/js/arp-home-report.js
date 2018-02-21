/**
 * excute resize reports after all images loaded
 */
function loadAllImages() {
    this.images = document.getElementsByClassName("img-portrait");
    this.index_loaded = 0;
    for (var i = 0; i < this.images.length; i++) {
        var img = new Image();
        document.body.appendChild(img);
        img.onload = function () {
            index_loaded++;
            if (index_loaded === window.images.length) {
                setPositionCardReports();
            }
            document.body.removeChild(this);
        }
        img.src = this.images[i].src;
    }
}
/**
 * resize reports in homepage
 */
function setPositionCardReports() {
    this.home_report_content = document.getElementsByClassName("home-report-content")[0];
    this.eles = document.getElementsByClassName("home-report-content-card");
    this.sizes = [];
    this.size_large = {};
    this.size_start = {};
    this.row = 1;
    if (eles.length === 0 || eles === undefined || eles === null) {
        return;
    }
    this.width = 0;
    this.maxrow = 3;
    this.landscape = false;
    if (window.innerWidth <= window.innerHeight) {
        this.width = window.innerWidth;
    } else {
        this.width = window.innerHeight;
        this.landscape = true;
    }
    for (var i = 0; i < eles.length; i++) {
        eles[i].className = "noTransition home-report-content-card home-report-content-portrait float-left";
        eles[i].children[0].children[0].paddingTop = 0 + "px";
        var size_node = {
            h: eles[i].children[0].children[0].children[0].children[0].clientHeight,
            w: eles[i].children[0].children[0].children[0].children[0].clientWidth,
            t: eles[i].getBoundingClientRect().top,
            l: eles[i].getBoundingClientRect().left,
        };
        if (size_node.w > size_node.h) {
            eles[i].className = "noTransition home-report-content-card home-report-content-landscape float-left";
            eles[i].children[0].children[0].children[0].children[0].className = "noTransition img-landscape";
            size_node = {
                h: eles[i].children[0].children[0].children[0].children[0].clientHeight,
                w: eles[i].children[0].children[0].children[0].children[0].clientWidth,
                t: eles[i].getBoundingClientRect().top,
                l: eles[i].getBoundingClientRect().left,
            };
        } else {}
        if (i === 0) {
            size_large = size_node;
            size_start = size_node;
        } else {
            if (size_large.h < size_node.h) {
                size_large = size_node;
            }
            if (size_node.l === size_start.l) {
                this.row++;
            }
        }
        if (this.width >= 312 && this.width < 599) {
            if (this.landscape) {
                this.maxrow = 3;
            } else {
                this.maxrow = 4;
            }
        } else if (this.width >= 600 && this.width < 1025) {} else if (this.width >= 1025) {}
        if (this.row > this.maxrow) {
            eles[i].className = eles[i].className + " noTransition hide";
        }
        sizes.push(size_node);
    }
    for (var i = 0; i < sizes.length; i++) {
        var img_par = eles[i].children[0].children[0].children[0];
        img_par.style.paddingTop = (size_large.h - sizes[i].h) + "px";
    }
};
window.addEventListener("resize", loadAllImages, true);

window.index_loaded = 0;
window.time_limit = parseInt(3000 / 24);

var images_loaded = setInterval(function () {
    window.index_loaded = document.getElementsByClassName("img-portrait").length;
    if ((document.readyState === "complete" && window.index_loaded !== 0) || window.time_limit === 0) {
        loadAllImages();
        clearInterval(images_loaded);
    }
    if (window.time_limit > 0) {
        window.time_limit--;
    }
}, 1000 / 24);