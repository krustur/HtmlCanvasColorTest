function GradientEntry(pos, r, g, b) {
    this.pos = pos;
    this.r = r;
    this.g = g;
    this.b = b;
}
var n = 100;
var sample = [];
for (var i = 0; i < n; i++)
    sample.push({});

var mygradients = [
    // [
    //     new GradientEntry(0, 255, 255, 255),
    //     new GradientEntry(1, 255, 0, 0)
    // ],
    // [
    //     // new GradientEntry(0, 255, 255, 255),
    //     // new GradientEntry(0, 0, 0, 0),
    //     new GradientEntry(0.75, 255, 255, 0),
    //     new GradientEntry(1, 0, 255, 0)
    // ],
    // [
    //     // new GradientEntry(0, 255, 255, 255),
    //     new GradientEntry(0.63, 255, 0, 255),
    //     new GradientEntry(1, 255, 255, 0),
    // ]
    // ,
    // [
    //     // new GradientEntry(0, 255, 255, 255),
    //     new GradientEntry(0.63, 255, 0, 255),
    //     new GradientEntry(1, 0, 0, 255),
    // ],

    [
        new GradientEntry(0, 255, 255, 255),
        // new GradientEntry(0.9, 0, 0, 0)
    ]
]

// The function gets called when the window is fully loaded
window.onload = function () {
    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    // Define the image dimensions
    var width = canvas.width;
    var height = canvas.height;

    var magnitude = width / 2;
    var magnitudesqr = magnitude * magnitude;

    console.log(magnitudesqr);

    // Create an ImageData object
    var imagedata = context.createImageData(width, height);

    function setPixel(x, y, r, g, b) {
        // Get the pixel index
        x = Math.round(x);
        y = Math.round(y);

        var pixelindex = (y * width + x) * 4;

        // Set the pixel data
        imagedata.data[pixelindex] = r;
        imagedata.data[pixelindex + 1] = g;
        imagedata.data[pixelindex + 2] = b;
        imagedata.data[pixelindex + 3] = 255;
    }

    function evaluateColor(x, y, m) {
        var numgradients = mygradients.length;
        var g = 0;
        var msqr = m * m;
        var ret = { red: 0, green: 0, blue: 0 }
        var hits = 0;

        // magnitude
        // magnitudesqr

        // console.log("numgradients", numgradients);

        mygradients.forEach(gradient => {
            gradient.forEach(entry => {
                var a = (Math.PI * 2) / numgradients * g;
                var gx = (width) + (entry.pos * Math.cos(a) * m * 0.98);
                var gy = (height) - (entry.pos * Math.sin(a) * m * 0.98);
                // console.log(x, y, entry.r, entry.g, entry.b);
                // console.log(g, a);
                // console.log(a);

                var dx = x - gx;
                var dy = y - gy;
                var dsqr = dx * dx + dy * dy;
                // console.log(dsqr);
                if (dsqr < msqr) {
                    var d = m - Math.sqrt(dsqr);
                    var d2 = d / m;
                    // hits = hits + 1;
                    // ret.red = ret.red + entry.r * d2;
                    // ret.green = ret.green + entry.g * d2;
                    // ret.blue = ret.blue + entry.b * d2;

                    ret.red = entry.r * d2;
                    ret.green = entry.g * d2;
                    ret.blue = entry.b * d2;

                    // return { red: entry.r, green: entry.g, blue: entry.b }
                    // return { red: 0, green: 255, blue: 128 }
                }
            })
            g = g + 1;

        });
        // ret.red = ret.red / hits;
        // ret.green = ret.green / hits;
        // ret.blue = ret.blue / hits;

        // ret.red = x % 255;
        // ret.green = x % 255;
        // ret.blue = y % 255;

        return ret;
    }

    var lightSource = new ArrayBuffer(1536 * 1536 * 4);
    // function createLightSource() {
    for (var x = 0; x < 1536; x++) {
        for (var y = 0; y < 1536; y++) {
            // // Generate a xor pattern with some random noise
            // var red = ((x + offset) % 256) ^ ((y + offset) % 256);
            // var green = ((2 * x + offset) % 256) ^ ((2 * y + offset) % 256);
            // var blue = 50 + Math.floor(Math.random() * 100);

            // // Rotate the colors
            // blue = (blue + offset) % 256;
            // var dx = x - 768;
            // var dy = y - 768;
            // var rsqr = dx * dx + dy * dy;
            // if (rsqr < magnitudesqr) {
            // var r = Math.sqrt() / magnitude;

            var color = evaluateColor(x, y, 768);
            // var r = 255 - (r * 255);
            // var r = 255;
            // var g = 0;//x;
            // var b = 0;//y;

            lightSource[((y * 1536 + x) * 4)] = color.red;
            lightSource[((y * 1536 + x) * 4) + 1] = color.green;
            lightSource[((y * 1536 + x) * 4) + 2] = color.blue;
            lightSource[((y * 1536 + x) * 4) + 3] = 255;
            // setPixel(x, y, color.red, color.green, color.blue);
            // }
            // else {
            //     setPixel(x, y, 0, 0, offset % 255);

            // }
        }
    }
    // }

    var bumpImage = new ArrayBuffer(768 * 768);
    for (var x = 0; x < 768; x++) {
        for (var y = 0; y < 768; y++) {
            bumpImage[y * 768 + x] = Math.floor(Math.random() * 50);
            // bumpImage[y * 768 + x] = 0;

        }
    }
    for (var r = 20; r < 40; r++) {
        for (var d = 0; d < 660; d++) {
            var d2 = (d * Math.PI * 2) / 660;
            var x = (768 / 2) + Math.floor((Math.cos(d2) * r));
            var y = (768 / 2) - Math.floor((Math.sin(d2) * r));
            var d3 = (((r - 20) / 20) * Math.PI);
            var c = Math.floor(Math.sin(d3) * 250);
            bumpImage[y * 768 + x] = c;
        }
    }
    // var bumpImageSmoothed = new ArrayBuffer(768*768);
    // for (var x = 0; x < 768; x++) {
    //     for (var y = 1; y < 767; y++) {
    //         var a = bumpImage[y * 768 + x - 1];
    //         var b = bumpImage[y * 768 + x + 1];
    //         var c = bumpImage[y * 768 + x - 768];
    //         var d = bumpImage[y * 768 + x + 768];
    //         bumpImageSmoothed[y * 768 + x] = (a + b + c+ d) / 4;
    //     }
    // }
    // var bumpImageSmoothed2 = new ArrayBuffer(768*768);
    // for (var x = 0; x < 768; x++) {
    //     for (var y = 1; y < 767; y++) {
    //         var a = bumpImageSmoothed[y * 768 + x - 1];
    //         var b = bumpImageSmoothed[y * 768 + x + 1];
    //         var c = bumpImageSmoothed[y * 768 + x - 768];
    //         var d = bumpImageSmoothed[y * 768 + x + 768];
    //         bumpImageSmoothed2[y * 768 + x] = (a + b + c+ d) / 4;
    //     }
    // }

    // for (var x = 0; x < 768; x++) {
    //     for (var y = 1; y < 767; y++) {
    //         var a = bumpImageSmoothed2[y * 768 + x - 1];
    //         var b = bumpImageSmoothed2[y * 768 + x + 1];
    //         var c = bumpImageSmoothed2[y * 768 + x - 768];
    //         var d = bumpImageSmoothed2[y * 768 + x + 768];
    //         bumpImageSmoothed[y * 768 + x] = (a + b + c+ d) / 4;
    //     }
    // }

    // for (var x = 0; x < 768; x++) {
    //     for (var y = 1; y < 767; y++) {
    //         bumpImageSmoothed[y * 768 + x] = 0;
    //     }
    // }

    var bumpMap = new ArrayBuffer(768 * 768 * 2);
    for (var x = 0; x < 768; x++) {
        for (var y = 0; y < 768; y++) {

            var xl = bumpImage[y * 768 + x - 1];
            var xr = bumpImage[y * 768 + x + 1];
            var yt = bumpImage[(y - 1) * 768 + x];
            var yb = bumpImage[(y + 1) * 768 + x];

            var xbump = Math.floor((xl - xr) * 5);
            var ybump = Math.floor((yt - yb) * 5);

            bumpMap[((y * 768 + x) * 2)] = xbump;
            bumpMap[((y * 768 + x) * 2) + 1] = ybump;
        }
    }

    // Create the image
    function createImage(offset) {
        // console.log("offset", offset);

        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                //var lightSourceOffset = 0;
                // setPixel(x, y, x%255, 0, y%255);
                var lightSourceOffset = (y * 1536 + x) * 4;

                lightSourceOffset += (1536 / 4) * 4;
                lightSourceOffset += (1536 / 4) * (1536 * 4)

                lightSourceOffset += Math.floor(Math.cos(offset * 0.02) * (1536 / 4)) * 4;
                lightSourceOffset += Math.floor(Math.sin(offset * 0.023) * (1536 / 4)) * 1536 * 4;

                var xb = bumpMap[(y * 768 + x) * 2];
                var yb = bumpMap[((y * 768 + x) * 2) + 1];

                lightSourceOffset += xb * 4;
                lightSourceOffset += yb * 1536 * 4;

                var r = lightSource[lightSourceOffset];
                var g = lightSource[lightSourceOffset + 1];
                var b = lightSource[lightSourceOffset + 2];
                setPixel(x, y, r, g, b);

                // var image = bumpImage[y * 768 + x];
                // setPixel(x, y, image, image, image);
            }
        }

        // // Loop over all of the pixels
        // for (var x = 0; x < width; x++) {
        //     for (var y = 0; y < height; y++) {
        //         // // Generate a xor pattern with some random noise
        //         // var red = ((x + offset) % 256) ^ ((y + offset) % 256);
        //         // var green = ((2 * x + offset) % 256) ^ ((2 * y + offset) % 256);
        //         // var blue = 50 + Math.floor(Math.random() * 100);

        //         // // Rotate the colors
        //         // blue = (blue + offset) % 256;
        //         var dx = x - magnitude;
        //         var dy = y - magnitude;
        //         var rsqr = dx * dx + dy * dy;
        //         //  if (rsqr < magnitudesqr) {
        //         var r = Math.sqrt() / magnitude;

        //         var color = evaluateColor(x, y);
        //         // var r = 255 - (r * 255);
        //         // var r = 255;
        //         // var g = 0;//x;
        //         // var b = 0;//y;

        //         setPixel(x, y, color.red, color.green, color.blue);
        //         // }
        //         // else {
        //         //     setPixel(x, y, 0, 0, offset % 255);

        //         // }
        //     }
        // }

        // var numgradients = mygradients.length;
        // // console.log("numgradients", numgradients);
        // var g = 0;

        // mygradients.forEach(gradient => {
        //     // console.log("gradient.leng", gradient.length);
        //     gradient.forEach(entry => {
        //         var a = (Math.PI * 2) / numgradients * g;
        //         var x = (width / 2) + (entry.pos * Math.cos(a) * magnitude * 0.97);
        //         var y = (height / 2) - (entry.pos * Math.sin(a) * magnitude * 0.97);
        //         // console.log(x, y, entry.r, entry.g, entry.b);
        //         // console.log(g, a);
        //         // console.log(a);
        //         setPixel(x, y, entry.r, entry.g, entry.b);
        //         setPixel(x - 1, y, entry.r, entry.g, entry.b);
        //         setPixel(x + 1, y, entry.r, entry.g, entry.b);
        //         setPixel(x, y - 1, entry.r, entry.g, entry.b);
        //         setPixel(x, y + 1, entry.r, entry.g, entry.b);

        //     })
        //     g = g + 1;

        // });
    }

    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);

        // Create the image
        createImage(Math.floor(tframe / 10));

        // Draw the image data to the canvas
        context.putImageData(imagedata, 0, 0);
    }

    // Call the main loop
    main(0);
};