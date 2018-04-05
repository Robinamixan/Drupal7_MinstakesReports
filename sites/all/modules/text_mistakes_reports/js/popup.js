(function ($) {
  $(function () {

    var selectedField;
    var selectedText;

    function PopUpHide() {
      $('#mistakes_popup_panel').hide();
    }

    function PopUpShow() {
      $('#mistakes_popup_panel').show();
    }

    function PopUpShowInfo(text) {
      $('#mistakes_popup_info').text(text);
      $('#mistakes_popup_info').fadeIn();
      setTimeout(function () {
        $('#mistakes_popup_info').fadeOut();
      }, 2000);
    }

    function selectionIsInSingleField(currentSelection, fieldClassName) {
      return !((!$(currentSelection.startContainer.parentElement).parents(fieldClassName).length) ||
          (!$(currentSelection.endContainer.parentElement).parents(fieldClassName).length));
    }

    function selectionIsInAllowedField(currentSelection) {
      var activeFields = Drupal.settings.textMistakesReportsFields;
      var allowed = false;
      var htmlName;

      $.each(activeFields, function (index, field) {
        if (!allowed) {
          htmlName = getHtmlFieldName(field.fieldName);

          if (selectionIsInSingleField(currentSelection, htmlName)) {
            selectedField = field;
            allowed = true;
            return true;
          }
        }
      });

      return allowed;
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

    function selectionIsValid(selectionInfo) {
      if (selectionInfo['length'] > selectedField.maxLength) {
        var text = 'selected text is too big';
        var report_current = ' ( current - ' + selectionInfo['length'];
        var report_max = ', max - ' + selectedField.maxLength + ')';
        alert(text + report_current + report_max);
        return false;
      }

      return true;
    }

    function getSelectionInfo() {
      var selectedText = [];
      var textLeft = [];
      var textRight = [];
      var $containers = [];
      var text = '';
      var select;
      var allTextLenght = 0;

      if (typeof window.getSelection !== 'undefined') {
        var sel = window.getSelection();
        if (sel.rangeCount) {
          if (sel.anchorNode.parentNode.id !== 'content') {

            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
              $containers.push(document.createElement('div'));
              $containers[i].appendChild(sel.getRangeAt(i).cloneContents());

              text = $containers[i].innerHTML;

              selectedText.push(text.replace(/<[^>]+>/g, ''));
              if (count_space(text) < 2) {
                select = sel.getRangeAt(i);
                var textInLeft = select.startContainer;
                var startposition = select.startOffset;
                var textInRight = select.endContainer;
                var endposition = select.endOffset;
                var wordInLeft = getWordsInLeft($(textInLeft).text(), startposition - 1, 3);
                var wordInRight = getWordsInRight($(textInRight).text(), endposition, 3);
                textLeft.push(wordInLeft.replace(/<[^>]+>/g, ''));
                textRight.push(wordInRight.replace(/<[^>]+>/g, ''));
              } else {
                textLeft.push('');
                textRight.push('');
              }
            }
          }
        }
      }

      for (var i = 0; i < selectedText.length; ++i) {
        allTextLenght += selectedText[i].length;
      }

      return {
        'text': selectedText,
        'length': allTextLenght,
        'textLeft': textLeft,
        'textRight': textRight
      };
    }


    function getWordsInLeft(text, leftPosition, amountWords) {
      var res = 0;
      var word = '';
      for (var i = leftPosition; i >= 0; i--) {
        if (text.charAt(i) === ' ') {
          res++;
        }
        if (res === amountWords) {
          break;
        }
        word = text.charAt(i) + word;
      }
      return word;
    }

    function getWordsInRight(text, rightPosition, amountWords) {
      var res = 0;
      var word = '';
      for (var i = rightPosition; i < text.length; i++) {
        if (text.charAt(i) === ' ') {
          res++;
        }
        if (res === amountWords) {
          break;
        }
        word += text.charAt(i);
      }
      return word;
    }

    function count_space(str) {
      var count = str.length;
      var res = 0;
      for (var i = 0; i < count; i++) {
        if (str.charAt(i) === ' ') {
          res++;
        }
      }
      return res;
    }

    function getSelection() {
      return window.getSelection().getRangeAt(0);
    }

    $('body').keydown(function (e, byScript) {
      var keyCode = e.keyCode || e.charCode || e.which;
      var selectionInfo;
      var currentSelection;
      var mainText;
      var inLeftText;
      var inRightText;

      if (keyCode === 10 || keyCode === 13) {
        if (e.ctrlKey) {
          selectionInfo = getSelectionInfo();
          selectionInfo['text'] = selectionInfo['text'];

          if (selectionInfo['text'][0]) {
            currentSelection = getSelection();

            if (selectionHasValidLocation(currentSelection)) {
              if (selectionIsValid(selectionInfo)) {
                $('.mistakes_popup_text').html('');
                selectedText = '';
                for (var i = 0; i < selectionInfo['text'].length; ++i) {

                  if (selectionInfo['textLeft'][i] !== '') {
                    mainText = '<span style="text-decoration: underline;">' + selectionInfo['text'][i] + '</span>';
                    inLeftText = selectionInfo['textLeft'][i];
                    inRightText = selectionInfo['textRight'][i];
                    selectedText += inLeftText + '*' + selectionInfo['text'][i] + '*' + inRightText + '|';
                    $('.mistakes_popup_text').append(inLeftText + mainText + inRightText + '<br>');
                  }
                  else {
                    selectedText += selectionInfo['text'][i] + '|';
                    $('.mistakes_popup_text').append(selectionInfo['text'][i] + '<br>');
                  }

                  $('#popup_title').text(selectedField['reportText']);

                }


                PopUpShow();
              }
            }
            else {
              alert('wrong selection!(you cant select this text)');
            }
          }
          else {
            alert('you didn\'t select anything!');
          }
        }

        return false;
      }
    })
        .click(function (event) {
          if ($(event.target).closest('#mistakes_popup_content').length === 0) {
            PopUpHide();
          }
        });

    $('#popup_hide').click(function () {
      PopUpHide();
    });

    $('#popup_send').click(function () {
      var test = true;
      if (test) {
        var objectLink = $('head').find('link[rel="shortlink"]').attr('href');
        var objectType = objectLink.split('/')[1];
        var objectId = objectLink.split('/')[2];

        $.ajax({
          url: Drupal.settings.textMistakesReportsAjax.sendReportUrl,
          type: 'POST',
          data: {
            'objectType': objectType,
            'objectId': objectId,
            'fieldName': selectedField.fieldName,
            'selectedText': selectedText,
            'userId': Drupal.settings.textMistakesReportsUser.userId
          },
          dataType: 'JSON',
          success: function (data) {
            data = $.parseJSON(data);
            if (data['condition'] === 'failure') {
              alert(data['errorText']);
            }
            else {
              PopUpShowInfo('Report sent!');
            }
          }
        });
      }

      PopUpHide();
    });
  })
}(jQuery));
