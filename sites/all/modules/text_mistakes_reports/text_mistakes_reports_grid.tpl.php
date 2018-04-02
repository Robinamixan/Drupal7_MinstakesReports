<div class="container">
    <table>
        <thead>
        <tr>
          <?php foreach ($rows as $key => $row): ?>
            <?php foreach ($row as $key => $value): ?>

                <th><?php print $key; ?></th>

            <?php endforeach; ?>
            <?php break; ?>
          <?php endforeach; ?>
        </tr>
        </thead>

        <tbody>
        <?php foreach ($rows as $key => $row): ?>

            <tr>
              <?php foreach ($row as $key => $value): ?>

                <?php if ($key === 'Entity Link'): ?>
                      <td>
                          <a href="<?php print $value; ?>"><?php print $value; ?></a>
                      </td>
                <?php else: ?>
                      <td><?php print $value; ?></td>
                <?php endif; ?>

              <?php endforeach; ?>

                <td>
                    <button id="report_delete_<?php print $row['Report ID']; ?>"
                            class="btn_report_delete btn">
                      <?php print t('Delete') ?>
                    </button>
                </td>
            </tr>

        <?php endforeach; ?>
        </tbody>
    </table>
</div>
