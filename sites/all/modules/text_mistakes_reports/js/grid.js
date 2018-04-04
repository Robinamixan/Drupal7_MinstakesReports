(function ($) {
  $(function () {

    var currentPage = 0;
    var maxPage = Drupal.settings.textMistakesReportsAjax.gridMaxPage;

    setButtonsPagination();

    function setButtonsPagination() {
      currentPage = parseInt(currentPage);
      $('#grid_current_page').text(currentPage + 1);

      if (currentPage === 0) {
        $('#grid_btn_back_page').attr("disabled", true);
      }

      if (maxPage === 1) {
        $('#grid_btn_next_page').attr("disabled", true);
      }
    }

    function sendAjaxDelete($element) {
      var reportId = $($element).attr('id').split('_')[2];
      var $container = $($element).parents('#report_mistake_grid').parent();
      $.ajax({
        url: Drupal.settings.textMistakesReportsAjax.gridDeleteUrl,
        type: 'POST',
        data: {
          'reportId': reportId,
          'currentPage': currentPage
        },
        dataType: 'JSON',
        success: function (data) {
          data = $.parseJSON(data);
          $($container).html(data['htmlGrid']);
          maxPage = data['maxPage'];
          currentPage = data['currentPage'];
          setButtonsPagination();
        }
      });
    }

    function sendAjaxGetNextPage($element) {
      var $container = $($element).parents('#report_mistake_grid').parent();

      if ((currentPage + 1) < maxPage) {
        $.ajax({
          url: Drupal.settings.textMistakesReportsAjax.gridPageUrl,
          type: 'POST',
          data: {
            'currentPage': currentPage + 1
          },
          dataType: 'JSON',
          success: function (data) {
            data = $.parseJSON(data);
            $container = $($container);
            $container.html(data['htmlGrid']);
            maxPage = data['maxPage'];

            currentPage++;
            $('#grid_current_page').text(currentPage + 1);

            if (currentPage + 1 === maxPage) {
              $($container).find('#grid_btn_next_page').attr("disabled", true);
            }
          }
        });
      }
    }

    function sendAjaxGetBackPage($element) {
      var $container = $($element).parents('#report_mistake_grid').parent();

      if (currentPage > 0) {
        $.ajax({
          url: Drupal.settings.textMistakesReportsAjax.gridPageUrl,
          type: 'POST',
          data: {
            'currentPage': currentPage - 1
          },
          dataType: 'JSON',
          success: function ($data) {
            $data = $.parseJSON($data);
            $container = $($container);
            $container.html($data['htmlGrid']);
            maxPage = $data['maxPage'];

            currentPage--;
            $('#grid_current_page').text(currentPage + 1);

            if (currentPage === 0) {
              $($container).find('#grid_btn_back_page').attr("disabled", true);
            }
          }
        });
      }
    }

    $(document).delegate('.btn_report_delete', 'click', function () {
      sendAjaxDelete(this);
    });

    $(document).delegate('#grid_btn_next_page', 'click', function () {
      sendAjaxGetNextPage(this);
    });

    $(document).delegate('#grid_btn_back_page', 'click', function () {
      sendAjaxGetBackPage(this);
    });

  })
}(jQuery));
