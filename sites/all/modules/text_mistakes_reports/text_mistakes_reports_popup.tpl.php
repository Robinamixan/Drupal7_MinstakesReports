<?php //var_dump(field_info_instance('node', 'field_addition_text', 'news'));?>

<div id="mistakes_popup_panel">
    <div class="popup_backgroung" id="mistakes_popup_background">
        <div class="popup_content" id="mistakes_popup_content">
            <h3 id="popup_title">
                Tutot
            </h3>
            <div class="popup_text_container">
                <span class="popup_text_container_title"><strong>Selected Text:</strong></span>
                <div class="mistakes_popup_text">
                    Text in Popup
                </div>
            </div>
            <div class="popup_button_panel">
                <button id="popup_send" type="button" class="btn btn-dark">Send</button>
                <button id="popup_hide" type="button" class="btn btn-dark">Cancel</button>
            </div>

        </div>
    </div>
</div>

<style>

    #mistakes_popup_panel{
        display: none;
    }

    #mistakes_popup_panel .popup_backgroung{
        width:100%;
        min-height:100%;
        background-color: rgba(0,0,0,0.5);
        overflow:hidden;
        position:fixed;
        top:0px;
        left: 0px;
        z-index: 100;
    }

    #mistakes_popup_panel .popup_backgroung .popup_content{
        margin:15% auto 0px auto;
        width:600px;
        min-height: 200px;
        padding:10px;
        background-color: #c5c5c5;
        border-radius:5px;
        box-shadow: 0px 0px 10px #000;
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        align-items: center;
    }

    #mistakes_popup_panel .popup_text_container{
        width: 100%;
        padding: 5px;
    }

    #mistakes_popup_panel .popup_text_container .popup_text_container_title{
        margin-left: 10px;
    }

    #mistakes_popup_panel .popup_text_container .mistakes_popup_text{
        background-color: white;
        border: black solid 1px;
        border-radius: 10px;
        padding: 5px;
        margin: 5px;
        display: block;
    }

    #mistakes_popup_panel .popup_button_panel {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }



</style>