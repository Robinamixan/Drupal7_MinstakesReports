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

  public function setValues($values = []) {
    $this->entity_id = $values['entity_id'];
    $this->revision_id = $values['revision_id'];
    $this->entity_type = $values['entity_type'];
    $this->date_create = $values['date_create'];
    $this->field_name = $values['field_name'];
    $this->selected_text = $values['selected_text'];
    $this->user_id = $values['user_id'];
    $this->user_ip = $values['user_ip'];
  }

  public function getValues() {
    return [
      'entity_id' => $this->entity_id,
      'revision_id' => $this->revision_id,
      'entity_type' => $this->entity_type,
      'date_create' => $this->date_create,
      'field_name' => $this->field_name,
      'selected_text' => $this->selected_text,
      'user_id' => $this->user_id,
      'user_ip' => $this->user_ip,
    ];
  }
}
