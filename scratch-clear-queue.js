    const clearQueueBtn = document.getElementById('clear-queue-btn');
    if (clearQueueBtn) {
        clearQueueBtn.addEventListener('click', () => {
            if (currentTab === 'upnext') {
                userQueue = [];
                renderQueue();
            } else if (currentTab === 'history') {
                historyQueue = [];
                if(currentUser) {
                    const userRef = doc(db, "users", currentUser.uid);
                    updateDoc(userRef, { musicHistory: [] }).catch(console.error);
                }
                renderQueue();
            }
        });
    }
