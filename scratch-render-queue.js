    let dragItem = null;
    let dragStartY = 0;
    let dragStartTop = 0;
    let dragTimeout = null;

    function renderQueue() {
        if(!queueContentArea) return;
        queueContentArea.innerHTML = '';
        
        let displayList = [];
        if (currentTab === 'upnext') {
            displayList = [
                ...userQueue.map(s => ({...s, isUserQueue: true})),
                ...currentQueue.slice(currentSongIndex + 1).map(s => ({...s, isUserQueue: false}))
            ];
        } else {
            displayList = [...historyQueue].reverse(); // Most recent first
        }

        if(displayList.length === 0) {
            queueContentArea.innerHTML = `<p style="text-align: center; color: #b3b3b3; margin-top: 20px;">${currentTab === 'upnext' ? 'Queue is empty' : 'No history yet'}</p>`;
            return;
        }

        displayList.forEach((song, idx) => {
            const item = document.createElement('div');
            item.className = 'queue-item';
            
            const isDraggable = currentTab === 'upnext' && song.isUserQueue;
            item.dataset.index = idx;
            item.dataset.songId = song.id;
            
            item.innerHTML = `
                <img src="${song.art}" alt="${song.title}">
                <div class="queue-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                ${isDraggable ? '<div class="queue-more-btn" title="Drag to move, click for options">...</div>' : ''}
            `;
            
            if(isDraggable) {
                const moreBtn = item.querySelector('.queue-more-btn');
                let isDragging = false;
                
                moreBtn.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    isDragging = false;
                    dragTimeout = setTimeout(() => {
                        isDragging = true;
                        dragItem = item;
                        dragStartY = e.clientY;
                        dragStartTop = item.offsetTop;
                        item.style.position = 'relative';
                        item.style.zIndex = 100;
                        item.classList.add('dragging');
                        queueContentArea.style.cursor = 'grabbing';
                    }, 200); // 200ms hold to drag
                });
                
                document.addEventListener('pointermove', (e) => {
                    if (isDragging && dragItem === item) {
                        const deltaY = e.clientY - dragStartY;
                        item.style.transform = `translateY(${deltaY}px)`;
                    }
                });
                
                moreBtn.addEventListener('pointerup', (e) => {
                    if (dragTimeout) clearTimeout(dragTimeout);
                    if (isDragging && dragItem === item) {
                        isDragging = false;
                        dragItem = null;
                        item.style.position = '';
                        item.style.zIndex = '';
                        item.style.transform = '';
                        item.classList.remove('dragging');
                        queueContentArea.style.cursor = '';
                        
                        // Calculate drop index based on position
                        const items = Array.from(queueContentArea.querySelectorAll('.queue-item')).filter(el => el.querySelector('.queue-more-btn'));
                        let droppedIdx = idx;
                        for (let i = 0; i < items.length; i++) {
                            const rect = items[i].getBoundingClientRect();
                            if (e.clientY < rect.top + rect.height / 2) {
                                droppedIdx = i;
                                break;
                            } else if (i === items.length - 1) {
                                droppedIdx = items.length - 1;
                            }
                        }
                        
                        if (droppedIdx !== idx) {
                            const movedSong = userQueue.splice(idx, 1)[0];
                            userQueue.splice(droppedIdx, 0, movedSong);
                            renderQueue();
                        }
                    } else if (!isDragging) {
                        // It was just a tap/click! Open context menu
                        openQueueContextMenu(e, song.id, idx);
                    }
                });
            }

            queueContentArea.appendChild(item);
        });
    }

    // Queue Context Menu
    const queueContextMenu = document.createElement('div');
    queueContextMenu.className = 'song-context-menu hidden glass-panel';
    queueContextMenu.innerHTML = `
        <button class="context-menu-item" id="qctx-play-next">Play Next</button>
        <button class="context-menu-item" id="qctx-play-last">Play Last</button>
        <button class="context-menu-item" id="qctx-favorite">Favorite</button>
        <button class="context-menu-item" id="qctx-suggest-more">Suggest More by Mixxer</button>
        <button class="context-menu-item" id="qctx-suggest-less">Suggest Less</button>
        <button class="context-menu-item" id="qctx-remove" style="color: #ff4444;">Remove from Queue</button>
    `;
    document.body.appendChild(queueContextMenu);
    
    let qctxTargetId = null;
    let qctxTargetIdx = null;

    function openQueueContextMenu(e, songId, idx) {
        e.preventDefault();
        e.stopPropagation();
        qctxTargetId = songId;
        qctxTargetIdx = idx;
        const rect = e.target.getBoundingClientRect();
        queueContextMenu.style.left = `${Math.min(rect.left - 150, window.innerWidth - 220)}px`;
        queueContextMenu.style.top = `${rect.bottom + window.scrollY + 5}px`;
        queueContextMenu.classList.remove('hidden');
    }

    document.addEventListener('click', (e) => {
        if (!queueContextMenu.classList.contains('hidden') && !e.target.closest('.song-context-menu')) {
            queueContextMenu.classList.add('hidden');
        }
    });

    document.getElementById('qctx-play-next')?.addEventListener('click', () => {
        if (qctxTargetIdx !== null) {
            const movedSong = userQueue.splice(qctxTargetIdx, 1)[0];
            userQueue.unshift(movedSong);
            renderQueue();
        }
        queueContextMenu.classList.add('hidden');
    });

    document.getElementById('qctx-play-last')?.addEventListener('click', () => {
        if (qctxTargetIdx !== null) {
            const movedSong = userQueue.splice(qctxTargetIdx, 1)[0];
            userQueue.push(movedSong);
            renderQueue();
        }
        queueContextMenu.classList.add('hidden');
    });

    document.getElementById('qctx-favorite')?.addEventListener('click', () => {
        if (qctxTargetId) toggleFavorite(qctxTargetId);
        queueContextMenu.classList.add('hidden');
    });

    document.getElementById('qctx-remove')?.addEventListener('click', () => {
        if (qctxTargetIdx !== null) {
            userQueue.splice(qctxTargetIdx, 1);
            renderQueue();
        }
        queueContextMenu.classList.add('hidden');
    });
    
    // Suggest More / Less (Simulated for now, as we'll add background mixxer logic later)
    document.getElementById('qctx-suggest-more')?.addEventListener('click', () => {
        alert("Mixxer will suggest more songs like this!");
        queueContextMenu.classList.add('hidden');
    });
    
    document.getElementById('qctx-suggest-less')?.addEventListener('click', () => {
        alert("Mixxer will suggest fewer songs like this.");
        queueContextMenu.classList.add('hidden');
    });
