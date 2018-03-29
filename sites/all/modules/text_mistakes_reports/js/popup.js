(function ($) {
    $(function() {

        var selectedField;
        var selectedText;

        function PopUpHide() {
            $('#mistakes_popup_panel').hide();
        }

        function PopUpShow() {
            $('#mistakes_popup_panel').show();
        }

        function selectionIsInSingleField(currentSelection, fieldClassName) {
            return !((!$(currentSelection.startContainer.parentElement).parents(fieldClassName).length) ||
                (!$(currentSelection.endContainer.parentElement).parents(fieldClassName).length));
        }

        function selectionIsInAllowedField(currentSelection) {
            activeFields = Drupal.settings.textMistakesReportsFields;
            var correct = false;
            $.each(activeFields, function( index, field ) {
                if (!correct) {
                    var htmlName = getHtmlFieldName(field.fieldName);

                    if (selectionIsInSingleField(currentSelection, htmlName)) {
                        selectedField = field;
                        correct = true;
                        return true;
                    }
                }
            });

            return correct;
        }

        function getHtmlFieldName(fieldname) {
            return '.field-name-' + fieldname.split('_').join('-');
        }

        function selectionHasValidLocation(currentSelection) {
            if (!selectionIsInSingleField(currentSelection, '.field')) {
                return false;
            }

            if (!selectionIsInAllowedField(currentSelection)) {
                return false;
            }

            return true;
        }

        function selectionIsValid(selectionText) {
            if (selectionText.length > selectedField.maxLength) {
                var text = 'selected text is too big';
                var report_current = ' ( current - ' + selectionText.length ;
                var report_max = ', max - ' + selectedField.maxLength + ')';
                alert(text + report_current + report_max);
                return false;
            }

            return true;
        }

        function getSelectionInfo() {
            var selectedText = '';
            if (typeof window.getSelection !== 'undefined') {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    if (sel.baseNode.parentNode.id !== 'content') {
                        var container = document.createElement('div');
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                        selectedText = container.innerHTML;
                    }
                }
            }

            if(count_space(selectedText) < 2) {
                var select = window.getSelection().getRangeAt(0);
                var textInLeft = select.startContainer;
                var startposition = select.startOffset;
                var textInRight = select.endContainer;
                var endposition = select.endOffset;
                var wordInLeft = getWordsInLeft($(textInLeft).text(), startposition - 1, 3);
                var wordInRight = getWordsInRight($(textInRight).text(), endposition, 3);
                return {
                    'text': selectedText,
                    'length': selectedText.length,
                    'textLeft' : wordInLeft,
                    'textRight' : wordInRight
                };
            }

            return {
                'text': selectedText,
                'length': selectedText.length,
                'textLeft' : '',
                'textRight' : ''
            };
        }

        function getWordsInLeft(text, leftPosition, amountWords) {
            var res = 0;
            var word = '';
            for(i = leftPosition; i >= 0; i--){
                if(text.charAt(i) === " "){
                    res++;
                }
                if(res === amountWords){
                    break;
                }
                word = text.charAt(i) + word;
            }
            return word;
        }

        function getWordsInRight(text, rightPosition, amountWords) {
            var res = 0;
            var word = '';
            for(i = rightPosition; i < text.length; i++){
                if(text.charAt(i) === " "){
                    res++;
                }
                if(res === amountWords){
                    break;
                }
                word += text.charAt(i);
            }
            return word;
        }

        function count_space(str) {
            count = str.length;
            var res = 0;
            for(i = 0; i < count; i++){
                if(str.charAt(i) === " "){
                    res++;
                }
            }
            return res;
        }

        function getSelection() {
            return window.getSelection().getRangeAt(0);
        }

        $('body').keydown(function(e, byScript) {
            var keyCode = e.keyCode || e.charCode || e.which;
            if (keyCode === 10 || keyCode === 13) {
                if (e.ctrlKey) {
                    var selectionInfo = getSelectionInfo();
                    selectionInfo['text'] = selectionInfo['text'].replace(/<[^>]+>/g,'');

                    if (selectionInfo['text']) {
                        var currentSelection = getSelection();

                        if (selectionHasValidLocation(currentSelection)) {
                            if (selectionIsValid(selectionInfo['text'])) {

                                if (selectionInfo['textLeft'] !== '') {
                                    var mainText = '<span style="text-decoration: underline;">' + selectionInfo['text'] + '</span>';
                                    var leftText = selectionInfo['textLeft'];
                                    var rightText = selectionInfo['textRight'];
                                    selectedText = leftText + selectionInfo['text'] + rightText;
                                    $('.mistakes_popup_text').html(leftText + mainText + rightText);
                                } else {
                                    selectedText = selectionInfo['text'];
                                    $('.mistakes_popup_text').html(selectionInfo['text']);
                                }

                                $('#popup_title').text(selectedField['reportText']);

                                PopUpShow();
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

        $('#popup_hide').click(function (el) {
            PopUpHide();
        });

        $('body').click(function (event) {
            if ($(event.target).closest('#mistakes_popup_content').length === 0) {
                PopUpHide();
            }
        });

        $('#popup_send').click(function () {
            objectLink = $('head').find('link[rel="canonical"]').attr('href');
            objectType = objectLink.split('/')[1];
            objectId = objectLink.split('/')[2];

            $.ajax({
                url: Drupal.settings.textMistakesReportsAjax.ajaxUrl,
                type: 'POST',
                data: {
                    'objectType': objectType,
                    'objectId': objectId,
                    'objectLink': objectLink,
                    'fieldName': selectedField.fieldName,
                    'selectedText': selectedText,
                    'username': Drupal.settings.textMistakesReportsUser.username
                },
                dataType: 'JSON',
                success: function(data) {
                    console.log(data);
                }
            });
            PopUpHide();
        });
    })
}(jQuery));