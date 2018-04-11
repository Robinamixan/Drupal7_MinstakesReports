<?php

class TextMistakesReportEntity {

  public $report_id;

  public $entity_id;

  public $revision_id;

  public $entity_type;

  public $date_create;

  public $field_name;

  public $selected_text;

  public $user_id;

  public $user_ip;

  /**
   * Converting record for view in grid
   *
   * @return array
   */
  public function getView() {
    if ($this->entity_type === 'taxonomy_term') {
      $entityLink = url(str_replace('_', '/',
          $this->entity_type) . '/' . $this->entity_id . '/edit');

      $term = entity_load($this->entity_type, [(int) $this->entity_id]);
      $vocabularyId = $term[$this->entity_id]->vid;
      $vocabulary = entity_load('taxonomy_vocabulary', [(int) $vocabularyId]);
      $bundle = $vocabulary[$vocabularyId]->machine_name;
      $fieldNameLabel = field_info_instance($this->entity_type,
        $this->field_name,
        $bundle)['label'];
    }
    else {
      $entityLink = url($this->entity_type . '/' . $this->entity_id . '/edit');
      $entity = entity_load($this->entity_type, [(int) $this->entity_id]);
      $bundle = $entity[$this->entity_id]->type;
      $fieldNameLabel = field_info_instance($this->entity_type,
        $this->field_name,
        $bundle)['label'];
    }

    $username = $this->user_id ? user_load($this->user_id)->name : 'anonymous';

    return [
      'Report ID' => $this->report_id,
      'Entity ID' => $this->entity_id,
      'Revision ID' => $this->revision_id !== '-1' ? $this->revision_id : '',
      'Entity Type' => $this->entity_type,
      'Entity Link' => $entityLink,
      'Date of Create' => $this->date_create,
      'Field Name Label' => $fieldNameLabel,
      'Field Name ID' => $this->field_name,
      'Selected Text' => $this->selected_text,
      'Username' => $username,
      'User IP' => $this->user_ip,
    ];
  }
}
