const NodeHelper = require("node_helper");
const { Gpio } = require("onoff");

module.exports = NodeHelper.create({
    buttons: [], // Array to store Gpio button instances

    start: function () {
        console.log("Starting node_helper for MMM-GPIO-Buttons");
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "INITIALIZE_BUTTONS") {
            this.initializeButtons(payload);
        }
    },

    initializeButtons: function (buttonConfig) {
        this.cleanup(); // Clean up existing buttons before reinitializing
        this.buttons = buttonConfig.map((button) => {
            // Configure GPIO with internal pull-up resistor
            const gpioButton = new Gpio(button.gpio, "in", "falling", {
                debounceTimeout: button.debounceTime || 300
            });

            gpioButton.watch((err, value) => {
                if (err) {
                    console.error(`Error watching GPIO ${button.gpio}:`, err);
                    return;
                }
                console.log(`Button on GPIO ${button.gpio} pressed`);
                this.sendSocketNotification(button.notification, { gpio: button.gpio });
            });

            console.log(`Initialized button on GPIO ${button.gpio} with notification ${button.notification}`);
            return gpioButton;
        });
    },

    cleanup: function () {
        // Properly release GPIO pins to avoid conflicts
        this.buttons.forEach((button) => {
            if (button) {
                button.unexport();
                console.log(`Cleaned up GPIO ${button.gpio}`);
            }
        });
        this.buttons = [];
    },

    stop: function () {
        this.cleanup();
    }
});
