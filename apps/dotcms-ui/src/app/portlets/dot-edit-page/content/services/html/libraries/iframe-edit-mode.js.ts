export const MODEL_VAR_NAME = 'dotNgModel';

export const EDIT_PAGE_JS = `
(function () {
    var forbiddenTarget;
    let currentModel;

    function getContainers() {
        var containers = [];
        var containersNodeList = document.querySelectorAll('[data-dot-object="container"]');

        for (var i = 0; i < containersNodeList.length; i++) {
            containers.push(containersNodeList[i]);
        };

        return containers;
    }

    function getDotNgModel() {
        var model = [];
        getContainers().forEach(function(container) {
            var contentlets = Array.from(container.querySelectorAll('[data-dot-object="contentlet"]'));

            model.push({
                identifier: container.dataset.dotIdentifier,
                uuid: container.dataset.dotUuid,
                contentletsId: contentlets.map(function(contentlet) {
                    return contentlet.dataset.dotIdentifier;
                })
            });
        });
        return model;
    }

    function checkIfContentletTypeIsAccepted(el, target) {
        return el.dataset.dotBasetype === 'WIDGET' ||
               el.dataset.dotBasetype === 'FORM' ||
               target.dataset.dotAcceptTypes.indexOf(el.dataset.dotType) > -1;
    }

    function checkIfMaxLimitNotReached(target) {
        return Array.from(
                target.querySelectorAll("[data-dot-object='contentlet']:not(.gu-transit)")
            ).length < parseInt(target.dataset.maxContentlets, 10);
    }

    function checkIfContentletIsUnique(el, target) {
        return Array.from(target.querySelectorAll("[data-dot-object='contentlet']:not(.gu-transit)"))
            .map(node => node.dataset.dotInode).indexOf(el.dataset.dotInode) === -1;
    }

    var drake = dragula(
        getContainers(), {
        accepts: function (el, target, source, sibling) {
            var canDrop = false;
            if (target.dataset.dotObject === 'container') {
                canDrop = checkIfContentletTypeIsAccepted(el, target)
                            && checkIfMaxLimitNotReached(target)
                            && checkIfContentletIsUnique(el, target);
                if (!canDrop && target !== source) {
                    forbiddenTarget = target;
                    forbiddenTarget.classList.add('no')
                }
            }
            return canDrop;
        },
        invalid: function(el, handle) {
            return !handle.classList.contains('dotedit-contentlet__drag');
        }
    });

    drake.on('drag', function() {
        window.requestAnimationFrame(function() {
            const el = document.querySelector('.gu-mirror');
            const rect = el.getBoundingClientRect();
            let transform = 'rotate(4deg)';

            if (rect.width > 500) {
                const scale = 500 / rect.width;
                transform = transform + ' scale(' + scale + ') '
            }

            el.style.transform = transform;
        });

        currentModel = getDotNgModel();

    })

    drake.on('over', function(el, container, source) {
        container.classList.add('over')
    })

    drake.on('out', function(el, container, source) {
        container.classList.remove('over')
    })

    drake.on('dragend', function(el) {
        if (forbiddenTarget && forbiddenTarget.classList.contains('no')) {
            forbiddenTarget.classList.remove('no');
        }

        currentModel = [];
    });

    drake.on('drop', function(el, target, source, sibling) {
        const updatedModel = getDotNgModel();

        if (JSON.stringify(updatedModel) !== JSON.stringify(currentModel)) {
            window.${MODEL_VAR_NAME}.next({
                model: getDotNgModel(),
                type: 3,
            });
        }

        if (target !== source) {
            window.contentletEvents.next({
                name: 'relocate',
                data: {
                    container: {
                        identifier: target.dataset.dotIdentifier,
                        uuid: target.dataset.dotUuid
                    },
                    contentlet: {
                        identifier: el.dataset.dotIdentifier,
                        inode: el.dataset.dotInode
                    }
                }
            });
        }
    })

    window.getDotNgModel = getDotNgModel;

    var myAutoScroll = autoScroll([
        window
    ],{
        margin: 100,
        maxSpeed: 60,
        scrollWhenOutside: true,
        autoScroll: function(){
            // Only scroll when the pointer is down, and there is a child being dragged.
            return this.down && drake.dragging;
        }
    });

    // D&D Img - Start

    function isCursorOnUpperSide(cursor, contentletBoundingRect) {
        return cursor.y - contentletBoundingRect.top  <  (contentletBoundingRect.bottom - contentletBoundingRect.top)/2
    }

    function isContentletPlaceholderInDOM() {
        return document.getElementById('contentletPlaceholder');
    }

    function isContainerAndContentletValid(container, contentlet) {
        return !container.classList.contains('no') && !contentlet.classList.contains('gu-transit');
    }

    function insertBeforeElement(newElem, element) {
        element.parentNode.insertBefore(newElem, element);
    }

    function insertAfterElement(newElem, element) {
        try{
            element.parentNode.insertBefore(newElem, element.nextSibling);
        }catch(error){}
    }

    function removeElementById(elemId) {
        document.getElementById(elemId).remove()
    }

    function checkIfContainerAllowsContent(event) {

        var container = event.target.closest('[data-dot-object="container"]');
        
        // Different than 1 file
        if (event.dataTransfer.items.length !== 1 ) {
            return false;
        }

        // File uploaded not an img
        if (!event.dataTransfer.items[0].type.match(/image/g) ) {
            return false;
        }

        // Container does NOT allow img
        if (!container.dataset.dotAcceptTypes.toLocaleLowerCase().match(/image/g)) {
            return false;
        }

        return true;
    }

    var contentletPlaceholder;
    var currentContainer;

    window.addEventListener("dragenter", (event) => {
        
        event.preventDefault(); 
        event.stopPropagation();

        var container = event.target.closest('[data-dot-object="container"]');
        currentContainer = container;

        if (container && !checkIfContainerAllowsContent(event)) {
            container.classList.add('no');
        }

    }, false);

    window.addEventListener('dragover', (event) => {

        event.preventDefault(); 
        event.stopPropagation();

        var container = event.target.closest('[data-dot-object="container"]');
        var contentlet = event.target.closest('[data-dot-object="contentlet"]');

        if (contentlet) {

            if (isContainerAndContentletValid(container, contentlet) && isContentletPlaceholderInDOM()) { 
                removeElementById('contentletPlaceholder');
            }

            contentletPlaceholder = document.createElement('div');
            contentletPlaceholder.id = 'contentletPlaceholder';
            contentletPlaceholder.setAttribute('data-dot-object', 'contentlet')
            contentletPlaceholder.classList.add('gu-transit')
            
            if (isContainerAndContentletValid(container, contentlet) && isCursorOnUpperSide(event, contentlet.getBoundingClientRect())) {
                insertBeforeElement(contentletPlaceholder, contentlet);
            } else if (isContainerAndContentletValid(container, contentlet)) {
                insertAfterElement(contentletPlaceholder, contentlet);
            }

            contentletPlaceholder = null;

        }

    }, false)

    window.addEventListener('dragleave', (event) => {
        event.preventDefault(); 
        event.stopPropagation();

        var container = event.target.closest('[data-dot-object="container"]');

        if (container && currentContainer !== container) {
            container.classList.remove('no');
        }

    }, false)

    window.addEventListener('drop', (event) => {
        event.preventDefault(); 
        event.stopPropagation();

        var container = event.target.closest('[data-dot-object="container"]');

        if (container && !container.classList.contains('no')) {
            console.log('** INSERT')
        } else {
            console.log('** NO INSERT')
        }

        if (isContentletPlaceholderInDOM()) {
                removeElementById('contentletPlaceholder');
        }
        
        if (container) {
            container.classList.remove('no');
        }

    }, false)

    // D&D Img - End
})();

`;
