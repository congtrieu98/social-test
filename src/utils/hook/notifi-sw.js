export function noti() {
    const checkpermission = () => {
        if (!("serviceWorker" in navigator)) {
            throw new Error("No support service worker");
        }

        if (('Noticafition') in window) {
            throw new Error('No support from notification API');
        }
    };

    const registerSW = async () => {
        const registration = await navigator.serviceWorker.register("sw.js");
        return registration;
    };

    const requestNotiPermission = async () => {
        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            throw new Error('Notification not allow')
        }
    }


    const main = async () => {
        checkpermission();
        await requestNotiPermission()
        await registerSW();
        // reg.showNotification('show your title', {
        //     body: "aaaaaa"
        // })
    }

    main()
}
