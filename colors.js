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
    [
        new GradientEntry(0, 255, 255, 255),
        new GradientEntry(1, 255, 0, 0)
    ],
    [
        new GradientEntry(0, 255, 255, 255),
        new GradientEntry(1, 0, 255, 0)
    ],
    [
        new GradientEntry(0, 255, 255, 255),
        new GradientEntry(1, 0, 0, 255)
    ]
]

// The function gets called when the window is fully loaded
window.onload = function () {
    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    // Define the image dimensions
    var width = canvas.width;
    var magnitude = width / 2;
    var height = canvas.height;


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

    // Create the image
    function createImage(offset) {
        // Loop over all of the pixels
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                // // Generate a xor pattern with some random noise
                // var red = ((x + offset) % 256) ^ ((y + offset) % 256);
                // var green = ((2 * x + offset) % 256) ^ ((2 * y + offset) % 256);
                // var blue = 50 + Math.floor(Math.random() * 100);

                // // Rotate the colors
                // blue = (blue + offset) % 256;
                var dx = x - magnitude;
                var dy = y - magnitude;
                var rsqr = dx * dx + dy * dy;
                if (rsqr < magnitude * magnitude) {
                    var r = Math.sqrt() / magnitude;

                    // var r = 255 - (r * 255);
                    var r = 255;
                    var g = 0;//x;
                    var b = 0;//y;

                    setPixel(x, y, r, g, b);
                }
                else {
                    setPixel(x, y, 0, 0, 0);

                }
            }
        }

        var numgradients = mygradients.length;
        // console.log("numgradients", numgradients);
        var g = 0;

        mygradients.forEach(gradient => {
            // console.log("gradient.leng", gradient.length);
            gradient.forEach(entry => {
                var a = (Math.PI * 2) / numgradients * g;
                var x = (width / 2) + (entry.pos * Math.cos(a) * magnitude * 0.97);
                var y = (height / 2) - (entry.pos * Math.sin(a) * magnitude * 0.97);
                console.log(x, y, entry.r, entry.g, entry.b);
                // console.log(g, a);
                // console.log(a);
                setPixel(x, y, entry.r, entry.g, entry.b);
                setPixel(x - 1, y, entry.r, entry.g, entry.b);
                setPixel(x + 1, y, entry.r, entry.g, entry.b);
                setPixel(x, y - 1, entry.r, entry.g, entry.b);
                setPixel(x, y + 1, entry.r, entry.g, entry.b);

            })
            g = g + 1;

        });
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