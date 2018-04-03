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

    function selectionIsValid(selectionText) {
      if (selectionText.length > selectedField.maxLength) {
        var text = 'selected text is too big';
        var report_current = ' ( current - ' + selectionText.length;
        var report_max = ', max - ' + selectedField.maxLength + ')';
        alert(text + report_current + report_max);
        return false;
      }

      return true;
    }

    function getSelectionInfo() {
      var selectedText = '';
      var $container;
      if (typeof window.getSelection !== 'undefined') {
        var sel = window.getSelection();
        if (sel.rangeCount) {
          if (sel.baseNode.parentNode.id !== 'content') {
            $container = document.createElement('div');
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
              $container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            selectedText = $container.innerHTML;
          }
        }
      }

      if (count_space(selectedText) < 2) {
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
          'textLeft': wordInLeft,
          'textRight': wordInRight
        };
      }

      return {
        'text': selectedText,
        'length': selectedText.length,
        'textLeft': '',
        'textRight': ''
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
          selectionInfo['text'] = selectionInfo['text'].replace(/<[^>]+>/g, '');

          if (selectionInfo['text']) {
            currentSelection = getSelection();

            if (selectionHasValidLocation(currentSelection)) {
              if (selectionIsValid(selectionInfo['text'])) {

                if (selectionInfo['textLeft'] !== '') {
                  mainText = '<span style="text-decoration: underline;">' + selectionInfo['text'] + '</span>';
                  inLeftText = selectionInfo['textLeft'];
                  inRightText = selectionInfo['textRight'];
                  selectedText = inLeftText + selectionInfo['text'] + inRightText;
                  $('.mistakes_popup_text').html(inLeftText + mainText + inRightText);
                }
                else {
                  selectedText = selectionInfo['text'];
                  $('.mistakes_popup_text').html(selectionInfo['text']);
                }

                $('#popup_title').text(selectedField['reportText']);

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
      var objectLink = $('head').find('link[rel="shortlink"]').attr('href');
      var objectType = objectLink.split('/')[1];
      var objectId = objectLink.split('/')[2];

      $.ajax({
        url: Drupal.settings.textMistakesReportsAjax.sendReportUrl,
        type: 'POST',
        data: {
          'objectType': objectType,
          'objectId': objectId,
          'objectLink': objectLink,
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
        }
      });
      PopUpHide();
    });
  })
}(jQuery));
