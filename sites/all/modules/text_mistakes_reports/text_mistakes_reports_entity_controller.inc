<?php

class TextMistakesReportEntityController implements DrupalEntityControllerInterface {

  public function __construct() {

  }

  /**
   * Resets the internal, static entity cache.
   *
   * @param $ids
   *   (optional) If specified, the cache is reset for the entities with the
   *   given ids only.
   */
  public function resetCache(array $ids = NULL) {
    // TODO: Implement resetCache() method.
  }

  /**
   * Loads one or more entities.
   *
   * @param $ids
   *   An array of entity IDs, or FALSE to load all entities.
   * @param $conditions
   *   An array of conditions. Keys are field names on the entity's base table.
   *   Values will be compared for equality. All the comparisons will be ANDed
   *   together. This parameter is deprecated; use an EntityFieldQuery instead.
   *
   * @return
   *   An array of entity objects indexed by their ids. When no results are
   *   found, an empty array is returned.
   */
  public function load($ids = [], $conditions = []) {
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
    if ($ids) {
      $db_or = db_or();
      foreach ($ids as $id) {
        $db_or->condition('report_id', $id);
      }
      $query->condition($db_or);
    }
    $rows = $query->execute()->fetchAll();
    return $rows;
  }

  /**
   * Load multiple records in interval.
   *
   * @param $startNumber
   * @param $amount
   *
   * @return array
   */
  public function load_interval($startNumber, $amount) {
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
  public function get_amount_reports() {
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
  function get_amount_reports_by_ip($userIP) {
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
    try {
      db_insert('text_mistakes_report')
        ->fields($record->getValues())
        ->execute();
    } catch (Exception $e) {
      return FALSE;
    }
    return TRUE;
  }
}