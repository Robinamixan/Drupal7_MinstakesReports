(function ($) {
    $(function() {


        function PopUpHide(){
            $('#mistakes_popup_panel').hide();
        }

        function PopUpShow(){
            $('#mistakes_popup_panel').show();
        }

        function selectionHasValidParents(current_selection) {
            if (!$(current_selection.startContainer.parentElement).parents('.field-type-text-with-summary').length) {
                return false;
            }

            if (!$(current_selection.endContainer.parentElement).parents('.field-type-text-with-summary').length) {
                return false;
            }

            return true;
        }

        function getSelectionInfo() {
            var html = '';
            if (typeof window.getSelection !== 'undefined') {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    if (sel.baseNode.parentNode.id !== 'content') {
                        var container = document.createElement('div');
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                        html = container.innerHTML;
                    }
                }
            } else if (typeof document.selection !== 'undefined') {
                if (document.selection.type === 'Text') {
                    html = document.selection.createRange().htmlText;
                }
            }
            return {'text': html, 'length': html.length};
        }

        function getSelection() {

            return window.getSelection().getRangeAt(0);
        }

        var test = $('.content').find('.node').find('.content').find('p').text();

        $('body').keydown(function(e, byScript) {
            var keyCode = e.keyCode || e.charCode || e.which;
            if (keyCode === 10 || keyCode === 13) {
                if (e.ctrlKey) {
                    var selected_info = getSelectionInfo();

                    if (selected_info['text']) {
                        var current_selection = getSelection();

                        if (selectionHasValidParents(current_selection)) {
                            console.log('success 7!');
                            PopUpShow();
                            $('#mistakes_popup_text').text(selected_info['text']);
                        } else {
                            alert('wrong selection!(you cant select this text)');
                        }

                    } else {
                        alert('you didn\'t select anything!');
                    }
                }

                return false;
            }
        });

        $('#hide_popup').click(function (el) {
            PopUpHide();
        });

        $('body').click(function (event) {
            if ($(event.target).closest('#mistakes_popup_content').length === 0) {
                PopUpHide();
            }
        });



    })
}(jQuery));