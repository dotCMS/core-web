export const GOOGLE_FONTS = 'https://fonts.googleapis.com/css?family=Roboto:400,700';
export const MODEL_VAR_NAME = 'dotNgModel';

export function getEditPageJS(remoteRendered: boolean) {
    return `
    (function () {
        var forbiddenTarget;

        function getContainers() {
            var containers = [];
            var containersNodeList = document.querySelectorAll('div[data-dot-object="container"]');

            for (var i = 0; i < containersNodeList.length; i++) {
                containers.push(containersNodeList[i]);
            };

            return containers;
        }

        function getDotNgModel() {
            var model = [];
            getContainers().forEach(function(container) {
                var contentlets = Array.from(container.querySelectorAll('div[data-dot-object="contentlet"]'));

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
            return target.children.length < parseInt(target.dataset.maxContentlets, 10)
        }

        function checkIfContentletIsUnique(el, target) {
            return Array.from(target.querySelectorAll("div[data-dot-object='contentlet']:not(.gu-transit)"))
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
        drake.on('dragend', function(el) {
            if (forbiddenTarget && forbiddenTarget.classList.contains('no')) {
                forbiddenTarget.classList.remove('no');
            }
            window.${MODEL_VAR_NAME}.next(getDotNgModel());
        });
        drake.on('drop', function(el, target, source, sibling) {
            if (target !== source) {
                debugger
                // 05 send param spa-page
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
                        },
                        remoteRendered: ${remoteRendered}
                    }
                });
            }
        })

        window.getDotNgModel = getDotNgModel;
    })();
    `;
}

export function getEditPageJSDojoRequire(remoteRendered: boolean) {
    return `require(['/html/js/dragula-3.7.2/dragula.min.js'], function(dragula) { ${getEditPageJS(remoteRendered)} });  `
}
