(function ($) {
    $(function() {

        $('.btn_report_delete').click( function () {
            var reportId = $(this).attr('id').split('_')[2];

            $.ajax({
                url: Drupal.settings.textMistakesReportsAjax.gridDeleteUrl,
                type: 'POST',
                data: {'reportId': reportId},
                dataType: 'JSON',
                success: function(data) {
                    location.reload();
                }
            });
        });

    })
}(jQuery));
