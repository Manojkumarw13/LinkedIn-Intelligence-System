// Merger Logic for n8n
// This code combines all incoming items (CSV rows) into a single text string.

let fullText = "";
const items = $input.all();

// Safety limit to prevent token overflow if data is massive
// Adjust MAX_ROWS as needed based on your token budget (e.g., Llama 3 70B context window)
const MAX_ROWS = 5000; 

if (items.length > 0) {
  fullText += `Processed ${Math.min(items.length, MAX_ROWS)} rows of data.\n\n`;
  
  // Iterate through items
  for (let i = 0; i < items.length && i < MAX_ROWS; i++) {
    const row = items[i].json;
    
    // Check if this item is a GitHub Repository
    if (row.html_url && row.full_name) {
       fullText += `[SOURCE: GitHub] ${row.name}: ${row.description || 'No description'} (${row.language || 'No language'})\n`;
       continue;
    }

    // Attempt to guess source based on keys (optional, but helps AI context)
    let sourceType = "Unknown CSV";
    if (row['Company Name'] && row['Title']) sourceType = "Positions";
    else if (row['First Name'] && row['Connected On']) sourceType = "Connections";
    else if (row['Skill Name']) sourceType = "Skills";
    else if (row['School Name']) sourceType = "Education";
    
    // Convert current row object to a readable string format
    // e.g. "Title: Software Engineer, Company: Google, ..."
    const rowString = Object.entries(row)
      .filter(([key, value]) => value !== '' && value !== null) // Skip empty fields
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
      
    if (rowString.length > 0) {
      fullText += `- ${rowString}\n`;
    }
  }
} else {
  fullText = "No data found in the processed CSV files.";
}

// Output a single item containing the merged text
return [{
  json: {
    text_context: fullText
  }
}];
