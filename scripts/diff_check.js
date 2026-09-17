// Diff Check Logic for n8n
// This code checks if the fetched file ID has already been processed.
// Note: staticData is only saved during production executions (Active mode), not manual tests.

const staticData = $getWorkflowStaticData('global');
const lastFileId = staticData.lastFileId;

const newFileId = $input.item.json.id;

if (!newFileId) {
  return $input.all();
}

if (lastFileId === newFileId) {
  return [];
}

staticData.lastFileId = newFileId;

return $input.all();
