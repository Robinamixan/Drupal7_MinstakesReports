<div class="container">
    <table class="table table-hover table-bordered ">
        <thead>
            <tr>
            <?php foreach ($rows[0] as $key => $value): ?>

                <th><?php print $key?></th>

            <?php endforeach; ?>
            </tr>
        </thead>

        <tbody>
        <?php foreach ($rows as $key => $row): ?>

            <tr>
            <?php foreach ($row as $key => $value): ?>

                <?php if ($key === 'Entity Link'):?>
                    <td><a href="<?php print $value?>"><?php print $value?></a></td>
                <?php else:; ?>
                    <td><?php print $value?></td>
                <?php endif; ?>

            <?php endforeach; ?>

                    <td>
                        <button id="report_delete_<?php print $row['Report ID']?>" class="btn_report_delete btn">
                            Delete
                        </button>
                    </td>
            </tr>

        <?php endforeach; ?>
        </tbody>
    </table>
</div>