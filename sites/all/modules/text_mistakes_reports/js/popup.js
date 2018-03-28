(function ($) {
    $(function() {

        function PopUpHide(){
            $('#mistakes_popup_panel').hide();
        }

        function PopUpShow(){
            $('#mistakes_popup_panel').show();
        }

        function selectionIsInAllowedField(current_selection) {
            activeFields = Drupal.settings.textMistakesReports;
            var correct = false;
            $.each(activeFields, function( index, field ) {
                if (!correct) {
                    var htmlName = '.field-name-' + field.fieldName.split('_').join('-');
                    var receiverEmail = field.receiverEmail;
                    var maxLength = field.maxLength;
                    var reportText = field.reportText;
                    var maxReports = field.maxReports;

                    console.log(htmlName);
                    // console.log(receiverEmail);
                    // console.log(maxLength);
                    // console.log(reportText);
                    // console.log(maxReports);

                    if ($(current_selection.startContainer.parentElement).parents(htmlName).length) {
                        correct = true;
                        return true;
                    }

                    if ($(current_selection.endContainer.parentElement).parents(htmlName).length) {
                        correct = true;
                        return true;
                    }
                }
            });

            return correct;
        }

        function selectionHasValidParents(current_selection) {
            if (!$(current_selection.startContainer.parentElement).parents('.field').length) {
                return false;
            }

            if (!$(current_selection.endContainer.parentElement).parents('.field').length) {
                return false;
            }

            if (!selectionIsInAllowedField(current_selection)) {
                return false;
            }

            return true;
        }

        function selectionIsValid(selection_text) {
            if (selection_text.length > Drupal.settings.textMistakesReports.field_addition_text.maxLength) {
                var text = 'selected text is too big';
                var report_current = ' ( current - ' + selection_text.length ;
                var report_max = ', max - ' + Drupal.settings.textMistakesReports.field_addition_text.maxLength + ')';
                alert(text + report_current + report_max);
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
                    var selection_info = getSelectionInfo();
                    selection_info['text'] = selection_info['text'].replace(/<[^>]+>/g,'');

                    if (selection_info['text']) {
                        var current_selection = getSelection();

                        if (selectionHasValidParents(current_selection)) {
                            if (selectionIsValid(selection_info['text'])) {
                                console.log('success 7!');
                                PopUpShow();
                                $('#mistakes_popup_text').text(selection_info['text']);
                            }

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