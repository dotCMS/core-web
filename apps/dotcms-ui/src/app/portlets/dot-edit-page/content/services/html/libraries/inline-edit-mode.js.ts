export const INLINE_TINYMCE_SCRIPTS = `
    function handleTinyMCEEvents(editor) {
    editor.on("change", ({ type: eventType }) => {
        window.contentletEvents.next({
        name: "tinyMceEvents",
        data: {
            eventType,
            isNotDirty: editor.isNotDirty,
        },
        });
    });

    editor.on("focus blur", (e) => {
        const { target: ed, type: eventType } = e;

        const content = ed.getContent();
        const dataset = ed.targetElm.dataset;
        const element = ed.targetElm;

        // Fixes the pointerEvents issue
        if (eventType === "focus" && dataset.mode === "full") {
        ed.bodyElement.classList.add("active");
        }

        if (eventType === "blur" && ed.bodyElement.classList.contains("active")) {
        ed.bodyElement.classList.remove("active");
        }

        if (eventType === "blur") {
        e.stopImmediatePropagation();
        ed.destroy(false);
        }

        window.contentletEvents.next({
        name: "tinyMceEvents",
        data: {
            dataset,
            innerHTML: content,
            element,
            eventType,
        },
        });
    });
    }

    const defaultConfig = {
    menubar: false,
    inline: true,
    valid_styles: {
        "*": "font-size,font-family,color,text-decoration,text-align",
    },
    powerpaste_word_import: "clean",
    powerpaste_html_import: "clean",
    setup: (editor) => handleTinyMCEEvents(editor),
    };

    const tinyMCEConfig = {
    minimal: {
        plugins: ["link"],
        toolbar: "bold italic underline | link",
        valid_elements: "strong,em,span[style],a[href]",
        content_css: ["//fonts.googleapis.com/css?family=Lato:300,300i,400,400i"],
        ...defaultConfig,
    },
    full: {
        plugins: ["link", "lists", "autolink", "hr", "charmap"],
        style_formats: [
        { title: "Paragraph", format: "p" },
        { title: "Header 1", format: "h1" },
        { title: "Header 2", format: "h2" },
        { title: "Header 3", format: "h3" },
        { title: "Header 4", format: "h4" },
        { title: "Header 5", format: "h5" },
        { title: "Header 6", format: "h6" },
        { title: "Pre", format: "pre" },
        { title: "Code", format: "code" },
        ],
        toolbar: [
        "styleselect | undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignfull | numlist bullist outdent indent | hr charmap removeformat | link",
        ],
        ...defaultConfig,
    },
    };

    document.addEventListener("click", function ({ target: { dataset } }) {
    const dataSelector =
        '[data-inode="' +
        dataset.inode +
        '"][data-field-name="' +
        dataset.fieldName +
        '"]';
    // if the mode is truthy we initialize tinymce
    if (dataset.mode) {
        tinymce
        .init({
            ...tinyMCEConfig[dataset.mode],
            selector: dataSelector,
        })
        .then(([ed]) => {
            ed?.editorCommands.execCommand("mceFocus");
        });
    }
    });
`;