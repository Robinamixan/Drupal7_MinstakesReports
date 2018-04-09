<?php

class EntityCreator {

  public function createTextMistakesReportEntity(
    $entityLink,
    $fieldNameId,
    $selectedText,
    $userId,
    $userIP
  ) {
    $record = new TextMistakesReportEntity();

    $properties = $this->convertLinkToProperties($entityLink);
    $currentDate = new DateTime();

    $record->entity_id = $properties['entity_id'];
    $record->revision_id = $properties['revision_id'];
    $record->entity_type = $properties['entity_type'];
    $record->date_create = $currentDate->format('Y-m-d H:i:s');
    $record->field_name = $fieldNameId;
    $record->selected_text = $selectedText;
    $record->user_id = $userId;
    $record->user_ip = $userIP;

    return $record;
  }

  private function convertLinkToProperties($entityLink) {
    $linkParts = explode('/', $entityLink);
    $entityType = $linkParts[0];

    if ($entityType === 'taxonomy') {
      $entityType = $linkParts[0] . '_' . $linkParts[1];
      $entityId = $linkParts[2];
      $revisionId = -1;
    }
    else {
      $entityId = $linkParts[1];
      $entity = entity_load($entityType, [(int) $entityId]);
      $revisionId = $entity[$entityId]->vid ? $entity[$entityId]->vid : '';
    }

    return [
      'entity_id' => $entityId,
      'entity_type' => $entityType,
      'revision_id' => $revisionId,
    ];
  }
}
