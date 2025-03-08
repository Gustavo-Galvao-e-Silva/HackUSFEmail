const QRScanner = {
    scanner: null,
    isScanning: false,
    scanPromise: null,
    promiseResolve: null,

    init: function(elementId) {
        this.scanner = new Html5Qrcode(elementId);
        return this; // For method chaining
    },

    scan: function() {
        if (!this.scanner) {
            return Promise.reject("Scanner not initialized. Call init() first.");
        }

        // Create a new promise
        this.scanPromise = new Promise((resolve, reject) => {
            this.promiseResolve = resolve;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
            };

            const handleSuccess = (decodedText, decodedResult) => {
                resolve(decodedText);

                this.stop();
            };

            // Error handler
            const handleError = (error) => {
                console.warn(`QR code scanning failed: ${error}`);
            };

            // Start scanning
            this.scanner.start(
                { facingMode: "environment" },
                config,
                handleSuccess,
                handleError
            ).then(() => {
                this.isScanning = true;
                console.log("Scanner started");
            }).catch((err) => {
                console.error("Error starting scanner:", err);
                reject(err);
            });
        });

        return this.scanPromise;
    },

    // Stop scanning
    stop: function() {
        if (this.scanner && this.isScanning) {
            this.scanner.stop().then(() => {
                this.isScanning = false;
            }).catch((err) => {
                console.error("Error stopping scanner:", err);
            });
        }
    }
};