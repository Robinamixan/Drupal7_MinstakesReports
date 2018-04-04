<div id="report_mistake_grid" class="container">
  <?php if (count($rows)): ?>
      <table>
          <thead>
          <tr>
            <?php foreach ($rows as $key => $row): ?>
              <?php foreach ($row as $key => $value): ?>

                    <th><?php print $key; ?></th>

              <?php endforeach; ?>
              <?php break; ?>
            <?php endforeach; ?>
              <th><?php print t('Action'); ?></th>
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
                  <?php elseif ($key === 'Selected Text'): ?>
                        <td>
                          <?php foreach (explode('|', $value) as $string): ?>
                            <?php print $string; ?>
                          <?php endforeach; ?>
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
      <button id="grid_btn_back_page">Back</button>
      <strong><?php print t('Page: ') ?><span
                  id="grid_current_page"></span></strong>
      <button id="grid_btn_next_page">Next</button>
  <?php else: ?>
      <span><?php print t('There are not reports'); ?></span>
  <?php endif; ?>
</div>
