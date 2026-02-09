// Diff Check Logic for n8n
// This code checks if the fetched file ID has already been processed.
// Note: staticData is only saved during production executions (Active mode), not manual tests.

const staticData = $getWorkflowStaticData('global');
const lastFileId = staticData.lastFileId;

// Assuming the previous node is named "Google Drive List" and outputs 'id' in json
const newFileId = $input.item.json.id;

if (!newFileId) {
  // Safety check: if no ID found, let it pass or error out. 
  // Here we pass it to investigate, or you could return [] to stop.
  return $input.all();
}

if (lastFileId === newFileId) {
  // File has already been processed. Stop workflow.
  return [];
}

// Update the static data with the new ID
// IMPORTANT: This only persists in Production/Active executions!
staticData.lastFileId = newFileId;

return $input.all();
