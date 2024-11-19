/* MMM-GPIO-Buttons.js */
Module.register("MMM-GPIO-Buttons", {
    defaults: {
        buttons: [
            { gpio: 6, notification: "BUTTON_1_PRESSED" },
            { gpio: 13, notification: "BUTTON_2_PRESSED" },
            { gpio: 19, notification: "BUTTON_3_PRESSED" }
        ],
        debounceTime: 300 // Global debounce time in milliseconds
    },

    start: function () {
        Log.info(`Starting module: ${this.name}`);
        this.sendSocketNotification("INITIALIZE_BUTTONS", this.config.buttons);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification.startsWith("BUTTON_")) {
            Log.info(`Notification received: ${notification}`);
            this.sendNotification(notification, payload); // Broadcast to other modules
        }
    }
});
