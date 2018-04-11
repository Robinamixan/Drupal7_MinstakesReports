<?php

class TextMistakesReportEntityController extends DrupalDefaultEntityController {

  public function __construct($entityType) {
    parent::__construct($entityType);
  }

  /**
   * Load multiple records in interval.
   *
   * @param $startNumber
   * @param $amount
   *
   * @return array
   */
  public function loadInInterval($startNumber, $amount) {
    $query = db_select('text_mistakes_report', 'r',
      ['fetch' => 'TextMistakesReportEntity',]);
    $query->fields('r', [
      'report_id',
      'entity_id',
      'revision_id',
      'entity_type',
      'date_create',
      'field_name',
      'selected_text',
      'user_id',
      'user_ip',
    ]);
    $query->range($startNumber, $amount);
    $rows = $query->execute()->fetchAll();
    return $rows;
  }

  /**
   *Delete one or more entities.
   *
   * @param $ids
   *   An array of entity IDs, IF EMPTY DELETE ALL RECORDS.
   */
  public function delete($ids = []) {
    if ($ids) {
      $delete = db_delete('text_mistakes_report');
      $db_or = db_or();
      foreach ($ids as $id) {
        $db_or->condition('report_id', $id);
      }
      $delete->condition($db_or);
      $delete->execute();
    }
    else {
      db_delete('text_mistakes_report')
        ->execute();
    }
  }

  /**
   * Count amount of reports in table
   *
   * @return int
   */
  public function getAmountReports() {
    $query = db_select('text_mistakes_report', 'r');
    $query->fields('r', [
      'report_id',
    ]);

    return $query->execute()->rowCount();
  }

  /**
   * Count amount of reports that user sent today
   *
   * @param $userIP
   *
   * @return int
   */
  function getAmountReportsByIP($userIP) {
    $todayDate = new DateTime();
    $query = db_select('text_mistakes_report', 'r');
    $query->fields('r', [
      'report_id',
    ]);
    $query->condition('user_ip', $userIP);
    $query->condition('date_create', $todayDate->format('Y-m-d'), '>=');

    return $query->execute()->rowCount();
  }

  /**
   * Save a single record.
   *
   * @param \TextMistakesReportEntity $record
   *
   * @return bool
   */
  function save(TextMistakesReportEntity $record) {
    return drupal_write_record('text_mistakes_report', $record);
  }
}
