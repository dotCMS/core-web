export const EDIT_PAGE_CSS = `
    [data-dot-object="container"] {
        border: solid 1px #53c2f9;
        min-height: 120px;
        margin: 10px 0;
        }
   
    [data-dot-object="container"].no {
        border-color: red;
        box-shadow: 0 0 20px red;
        border-radious: 2px;
        background-color: #ff00000f;
    }

    [data-dot-object="container"]:hover {
       
    }

    [data-dot-object="contentlet"] {
        border: solid #fff;
        border-width: 36px 20px 20px 20px;
        background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAPElEQVQoU2NkIACCD/9KY8SnBqRgrS3bLJyKYApAhmBVhKwAqyJ0BRiKsClAUYRLAVwRPgVgRYQUgBQBAHYoIoCrUf5lAAAAAElFTkSuQmCC");
       
    }

    [data-dot-object="contentlet"]:hover {
        background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAPElEQVQoU2NkIACCD/38z4hPDUjBWjt2RpyKYApAhmBVhKwAqyJ0BRiKsClAUYRLAVwRPgVgRYQUgBQBADhDIxfuwmYjAAAAAElFTkSuQmCC");
    }

    .dotedit-contentlet__content {
        min-height: 100px;
        position: relative;
    }

   

    .loader,
    .loader:after {
        border-radius: 50%;
        width: 32px;
        height: 32px;
    }

    .loader {
        display: inline-block;
        vertical-align: middle;
        font-size: 10px;
        position: relative;
        text-indent: -9999em;
        border-top: solid 5px rgba(0, 0, 0, 0.2);
        border-right: solid 5px rgba(0, 0, 0, 0.2);
        border-bottom: solid 5px rgba(0, 0, 0, 0.2);
        border-left: solid 5px #000;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: load8 1.1s infinite linear;
        animation: load8 1.1s infinite linear;
        overflow: hidden;
    }

    .loader__overlay {
        align-items: center;
        background-color: rgba(255, 255, 255, 0.8);
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        overflow: hidden;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
    }

    @-webkit-keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    
    .dotedit-container__toolbar{
        position:relative;
        margin:0 0 -26px 8px;
    }
    
    .dotedit-container__toolbar button, .dotedit-contentlet__toolbar button{
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        font-size:0;
        outline:none;
    }
    
    .dotedit-container__toolbar button:hover, .dotedit-contentlet__toolbar button:hover{
        box-shadow:0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    }
    
    .dotedit-contentlet__toolbar{
        text-align: right;
        margin: -16px 0 5px 0;
        font-size:0;
    }
    
     .dotedit-contentlet__toolbar button{
        margin-right:8px;
     }
    
    .dotedit-container__add{
        background-image: url("data:image/svg+xml;utf8,<svg fill='#fff' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
        background-repeat: no-repeat;
        background-position: 4px;
        background-color:#0E80CB;
    }
    
     .dotedit-container__add:hover{
        background-color:#0b629b;
     }
     
     .dotedit-container__add:focus{
        background-color: #0b629b
     }
     
     .dotedit-container__add:active{
        background-color: #07446c;
     }
     
      .dotedit-contentlet__drag {
        touch-action: none;
        cursor: move;
        background-image: url("data:image/svg+xml;utf8,<svg fill='#3C3C3C' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><defs><path d='M0 0h24v24H0V0z' id='a'/></defs><clipPath id='b'><use overflow='visible' xlink:href='#a'/></clipPath><path clip-path='url(#b)' d='M20 9H4v2h16V9zM4 15h16v-2H4v2z'/></svg>");
        background-repeat: no-repeat;
        background-position: 7px;
    }
     
     .dotedit-contentlet__edit{
        background-image: url("data:image/svg+xml;utf8,<svg fill='#3C3C3C' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
        background-repeat: no-repeat;
        background-position: 7px;
     }
     
     .dotedit-contentlet__remove{
        background-image: url("data:image/svg+xml;utf8,<svg fill='#3C3C3C' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
        background-repeat: no-repeat;
        background-position: 7px;
     }
          
     .dotedit-container__menu {
          width: 100px;
          background-color: #ffffff;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
          font-family:Roboto, "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
          font-size: 13px;
          position: absolute;
          z-index:1003;
          visibility: hidden;
          opacity: 0;
          transition: opacity 200ms linear;
     }
     
     .dotedit-container__toolbar.active .dotedit-container__menu{
        visibility: visible;
        opacity: 1;
     }
     
     .dotedit-container__menu ul {
        list-style: none;
        margin:0;
        padding:0;
        min-width:100px;
        padding:8px 0;
     }
     
     .dotedit-container__menu-item a {
        padding: 8px;
        line-height:16px;
        display:block;
        cursor:pointer;
     }
     
     .dotedit-container__menu-item a:hover {
        background-color: #e7e7e7;  
     }
     
     .dotedit-container__menu-item a, .dotedit-container__menu-item a:visited{
        color:inherit;
        text-decoration:none;
     }
`;

