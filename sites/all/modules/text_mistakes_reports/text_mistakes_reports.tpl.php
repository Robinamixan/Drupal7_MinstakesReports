<div id="mistakes_popup_panel">
    <div class="popup-backgroung" id="mistakes_popup_background">
        <div class="popup-content" id="mistakes_popup_content">
            <div id="mistakes_popup_text">
                Text in Popup
            </div>
            <a id="hide_popup" ">Hide popup</a>
        </div>
    </div>
</div>

<style>

    #mistakes_popup_panel{
        display: none;
    }

    .popup-backgroung{
        width:100%;
        min-height:100%;
        background-color: rgba(0,0,0,0.5);
        overflow:hidden;
        position:fixed;
        top:0px;
        left: 0px;
        z-index: 100;
    }

    .popup-backgroung .popup-content{
        margin:15% auto 0px auto;
        width:600px;
        height: 500px;
        padding:10px;
        background-color: #c5c5c5;
        border-radius:5px;
        box-shadow: 0px 0px 10px #000;
    }

</style>