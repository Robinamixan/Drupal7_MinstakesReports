(function ($) {
    $(function() {

        $('.btn_report_delete').click(function () {

            reportId = $(this).attr('id').split('_')[2];

            console.log(reportId);

            $.ajax({
                url: Drupal.settings.textMistakesReportsAjax.gridDeleteUrl,
                type: 'POST',
                data: {
                    'reportId': reportId
                },
                dataType: 'JSON',
                success: function(data) {
                    location.reload();
                }
            });
        });
    })
}(jQuery));